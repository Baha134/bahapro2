import { NextResponse } from "next/server"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { reportType, data } = body

        let content = `Report Type: ${reportType}\n`
        content += `Generated: ${new Date().toLocaleDateString("ru-RU")}\n\n`
        content += `=== STATISTICS ===\n`
        content += `Total Students: ${data?.students?.length ?? 0}\n`
        content += `Average GPA: ${data?.avgGpa}\n`
        content += `Deans List: ${data?.deansListCount ?? 0}\n`
        content += `Ready for Internship: ${data?.internshipReady ?? 0}\n\n`
        content += `=== SKILLS ===\n`
        content += `Total Skills: ${data?.allSkills?.length ?? 0}\n`
        content += `Total Badges: ${data?.allBadges?.length ?? 0}\n`
        content += `Verified: ${data?.allBadges?.filter((b: any) => b.verified).length ?? 0}\n\n`
        content += `=== TOP SKILLS ===\n`
        
        if (data?.topSkills && data.topSkills.length > 0) {
            data.topSkills.forEach((skill: any, idx: number) => {
                content += `${idx + 1}. ${skill[0]} - ${skill[1]} students\n`
            })
        }

        content += `\n=== RECOMMENDATIONS ===\n`
        content += `Total: ${data?.recs?.length ?? 0}\n`

        // Простой PDF текстовый формат
        const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources 4 0 R /MediaBox [0 0 612 792] /Contents 5 0 R >>
endobj
4 0 obj
<< /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> >> >>
endobj
5 0 obj
<< /Length ${content.length + 100} >>
stream
BT
/F1 10 Tf
50 750 Td
${content.split("\n").map((line, i) => `(${line.replace(/\(/g, "\\(").replace(/\)/g, "\\)")}) Tj\n0 -15 Td`).join("")}
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
0000000284 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
${content.length + 400}
%%EOF`

        const pdfBuffer = Buffer.from(pdfContent, "utf8")

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="report-${reportType}-${new Date().toISOString().split("T")[0]}.pdf"`,
            },
        })
    } catch (error) {
        console.error("Error:", error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
