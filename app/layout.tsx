// app/layout.tsx
// Этот файл является корневым макетом (Root Layout) всего приложения.
// Он определяет базовую HTML-структуру (теги html, body), подключает глобальные стили (globals.css),
// настраивает шрифты (Geist), устанавливает метаданные для SEO и иконок,
// а также оборачивает все страницы провайдерами (Analytics, Toaster для уведомлений).
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'ПрофСтарт - Карьерная платформа для студентов',
  description: 'Геймифицированная платформа для развития карьеры студентов. RPG-прокачка навыков, верифицированное портфолио, AI-помощник.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/ÓRKEN.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/ÓRKEN.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/ÓRKEN4.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/ÓRKEN.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1333',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'oklch(0.17 0.02 260)',
              border: '1px solid oklch(0.28 0.03 260)',
              color: 'oklch(0.96 0.005 260)',
            },
          }}
        />
        <Analytics />
      </body>
    </html>
  )
}
