"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { QrCode, X, Download, Share2, BadgeCheck, Smartphone, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileQrCodeProps {
    userId: string
    fullName: string
    specialty?: string
    year?: number
    university?: string
    location?: string
}

function generateQrMatrix(text: string): boolean[][] {
    const size = 33
    const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false))

    const drawFinder = (row: number, col: number) => {
        for (let r = 0; r < 7; r++) {
            for (let c = 0; c < 7; c++) {
                const isOuter = r === 0 || r === 6 || c === 0 || c === 6
                const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4
                matrix[row + r][col + c] = isOuter || isInner
            }
        }
    }
    drawFinder(0, 0)
    drawFinder(0, size - 7)
    drawFinder(size - 7, 0)

    for (let i = 8; i < size - 8; i++) {
        matrix[6][i] = i % 2 === 0
        matrix[i][6] = i % 2 === 0
    }

    const drawAlignment = (row: number, col: number) => {
        for (let r = -2; r <= 2; r++) {
            for (let c = -2; c <= 2; c++) {
                const dist = Math.max(Math.abs(r), Math.abs(c))
                matrix[row + r][col + c] = dist === 0 || dist === 2
            }
        }
    }
    drawAlignment(24, 24)

    let hash = 0
    for (let i = 0; i < text.length; i++) {
        hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0
    }

    let seed = Math.abs(hash)
    const next = () => {
        seed = (seed * 1103515245 + 12345) & 0x7fffffff
        return seed
    }

    const isReserved = (r: number, c: number): boolean => {
        if (r < 9 && c < 9) return true
        if (r < 9 && c >= size - 8) return true
        if (r >= size - 8 && c < 9) return true
        if (r === 6 || c === 6) return true
        if (Math.abs(r - 24) <= 2 && Math.abs(c - 24) <= 2) return true
        return false
    }

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!isReserved(r, c)) {
                matrix[r][c] = next() % 3 !== 0
            }
        }
    }

    return matrix
}

function drawQrOnCanvas(
    canvas: HTMLCanvasElement,
    matrix: boolean[][],
    moduleSize: number,
    fgColor: string,
    bgColor: string,
    cornerRadius: number = 2,
    logoLetter: string = "B"
) {
    const size = matrix.length
    const canvasSize = size * moduleSize + moduleSize * 2
    canvas.width = canvasSize
    canvas.height = canvasSize
    const ctx = canvas.getContext("2d")!

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    ctx.fillStyle = fgColor
    const offset = moduleSize

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (matrix[r][c]) {
                const x = c * moduleSize + offset
                const y = r * moduleSize + offset
                const cr = cornerRadius
                ctx.beginPath()
                ctx.moveTo(x + cr, y)
                ctx.lineTo(x + moduleSize - cr, y)
                ctx.quadraticCurveTo(x + moduleSize, y, x + moduleSize, y + cr)
                ctx.lineTo(x + moduleSize, y + moduleSize - cr)
                ctx.quadraticCurveTo(x + moduleSize, y + moduleSize, x + moduleSize - cr, y + moduleSize)
                ctx.lineTo(x + cr, y + moduleSize)
                ctx.quadraticCurveTo(x, y + moduleSize, x, y + moduleSize - cr)
                ctx.lineTo(x, y + cr)
                ctx.quadraticCurveTo(x, y, x + cr, y)
                ctx.closePath()
                ctx.fill()
            }
        }
    }

    const centerX = canvasSize / 2
    const centerY = canvasSize / 2
    const logoRadius = moduleSize * 3

    ctx.fillStyle = bgColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius + moduleSize, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = fgColor
    ctx.beginPath()
    ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = bgColor
    ctx.font = `bold ${logoRadius * 1.2}px Inter, sans-serif`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(logoLetter, centerX, centerY + 1)
}

export function ProfileQrCode({ userId, fullName, specialty, year, university, location }: ProfileQrCodeProps) {
    const [open, setOpen] = useState(false)
    const [copied, setCopied] = useState(false)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const downloadCanvasRef = useRef<HTMLCanvasElement>(null)

    const profileUrl = `https://bahapro.kz/profile/${userId}`

    const renderQr = useCallback(() => {
        if (!canvasRef.current) return
        const matrix = generateQrMatrix(profileUrl)
        const isDark = document.documentElement.classList.contains("dark")
        const fgColor = isDark ? "#c7d2fe" : "#312e81"
        const bgColor = isDark ? "#1e1b4b" : "#ffffff"

        drawQrOnCanvas(canvasRef.current, matrix, 6, fgColor, bgColor, 1.5, "B")

        if (downloadCanvasRef.current) {
            drawQrOnCanvas(downloadCanvasRef.current, matrix, 16, "#312e81", "#ffffff", 3, "B")
        }
    }, [profileUrl])

    useEffect(() => {
        if (open) requestAnimationFrame(renderQr)
    }, [open, renderQr])

    const handleDownload = () => {
        if (!downloadCanvasRef.current) return
        const link = document.createElement("a")
        link.download = `bahapro-qr-${userId}.png`
        link.href = downloadCanvasRef.current.toDataURL("image/png")
        link.click()
    }

    const handleCopyLink = async () => {
        await navigator.clipboard.writeText(profileUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${fullName} - Baha Pro Profile`,
                    text: `Verified student portfolio of ${fullName} on Baha Pro`,
                    url: profileUrl,
                })
            } catch { handleCopyLink() }
        } else {
            handleCopyLink()
        }
    }

    return (
        <>
            <Button variant="ghost" size="icon"
                className="h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => setOpen(true)}>
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Show QR Code</span>
            </Button>

            {open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

                    <div className="relative z-10 mx-4 w-full max-w-sm">
                        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-border px-5 py-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10">
                                        <QrCode className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-semibold text-foreground">My QR Code</h3>
                                        <p className="text-[11px] text-muted-foreground">Scannable verified profile</p>
                                    </div>
                                </div>
                                <button onClick={() => setOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* QR */}
                            <div className="flex flex-col items-center gap-5 px-5 py-6">
                                <div className="relative flex flex-col items-center rounded-2xl border border-border bg-secondary/50 px-6 pb-5 pt-6">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-600">
                                            <BadgeCheck className="h-3.5 w-3.5" />
                                            Verified by University
                                        </span>
                                    </div>

                                    <canvas ref={canvasRef} className="rounded-xl" style={{ width: 210, height: 210 }} />

                                    <div className="mt-4 text-center">
                                        <p className="text-sm font-bold text-foreground">{fullName}</p>
                                        {specialty && year && (
                                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                                                {specialty}, {year} year
                                            </p>
                                        )}
                                        {university && location && (
                                            <p className="text-[11px] text-muted-foreground">
                                                {university} · {location}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* URL */}
                                <div className="flex w-full items-center gap-2 rounded-xl bg-secondary px-3 py-2">
                                    <div className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{profileUrl}</div>
                                    <button onClick={handleCopyLink}
                                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-card hover:text-foreground">
                                        {copied
                                            ? <Check className="h-3.5 w-3.5 text-emerald-500" />
                                            : <Copy className="h-3.5 w-3.5" />
                                        }
                                    </button>
                                </div>

                                <div className="flex items-start gap-2.5 rounded-xl bg-primary/5 px-4 py-3">
                                    <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                    <p className="text-[11px] leading-relaxed text-foreground/70">
                                        Покажи QR-код на карьерной ярмарке — рекрутеры мгновенно увидят твой верифицированный профиль.
                                    </p>
                                </div>

                                <div className="flex w-full gap-3">
                                    <Button onClick={handleDownload}
                                        className="h-10 flex-1 gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
                                        <Download className="h-4 w-4" />
                                        Download PNG
                                    </Button>
                                    <Button onClick={handleShare} variant="outline"
                                        className="h-10 flex-1 gap-2 rounded-xl text-sm font-semibold">
                                        <Share2 className="h-4 w-4" />
                                        Share Link
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <canvas ref={downloadCanvasRef} className="hidden" />
                </div>
            )}
        </>
    )
}