import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"
import './globals.css'

export const metadata: Metadata = {
    title: 'Multi Language Transcriber',
    description: 'Your universal transcription platform—convert speech to text in multiple languages with ease and accuracy.',
    icons: {
        icon: './favicon'
    },
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                <Analytics />
            </body>
        </html>
    )
}
