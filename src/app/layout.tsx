import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export const metadata: Metadata = {
  title: "Sujay Patni — Software Engineer",
  description:
    "Personal portfolio of Sujay Patni, Software Engineer specializing in backend systems, microservices, and AI-powered products.",
  keywords: ["Sujay Patni", "Software Engineer", "Backend", "Java", "Spring Boot", "OfBusiness"],
  authors: [{ name: "Sujay Patni" }],
};

// Theme CSS injected inline so it's guaranteed to be in the HTML regardless of
// the build pipeline (Turbopack dev strips [data-theme] blocks from globals.css).
const THEME_CSS = `
:root {
  color-scheme: dark;
  --t-bg: #09090b;
  --t-surface: #18181b;
  --t-border: #27272a;
  --t-text: #f4f4f5;
  --t-text-2: #e4e4e7;
  --t-muted-1: #a1a1aa;
  --t-muted-2: #71717a;
  --t-muted-3: #52525b;
  --t-muted-4: #3f3f46;
  --t-accent: #34d399;
  --t-accent-2: #6ee7b7;
  --t-accent-rgb: 52,211,153;
  --t-accent-dim: rgba(52,211,153,0.08);
  --t-danger: #f87171;
}
[data-theme="latte"] {
  color-scheme: light;
  --t-bg: #eff1f5;
  --t-surface: #e6e9ef;
  --t-border: #ccd0da;
  --t-text: #4c4f69;
  --t-text-2: #5c5f77;
  --t-muted-1: #6c6f85;
  --t-muted-2: #7c7f93;
  --t-muted-3: #9ca0b0;
  --t-muted-4: #bcc0cc;
  --t-accent: #7287fd;
  --t-accent-2: #04a5e5;
  --t-accent-rgb: 114,135,253;
  --t-accent-dim: rgba(114,135,253,0.08);
  --t-danger: #d20f39;
}
[data-theme="coffee"] {
  color-scheme: light;
  --t-bg: #F5ECD7;
  --t-surface: #EDE0C4;
  --t-border: #C4A882;
  --t-text: #2C1810;
  --t-text-2: #3D2415;
  --t-muted-1: #8B6E52;
  --t-muted-2: #9E7A5A;
  --t-muted-3: #B08060;
  --t-muted-4: #C8A882;
  --t-accent: #B5651D;
  --t-accent-2: #CD853F;
  --t-accent-rgb: 181,101,29;
  --t-accent-dim: rgba(181,101,29,0.08);
  --t-danger: #c0392b;
}
[data-theme="nord"] {
  color-scheme: dark;
  --t-bg: #2E3440;
  --t-surface: #3B4252;
  --t-border: #4C566A;
  --t-text: #ECEFF4;
  --t-text-2: #E5E9F0;
  --t-muted-1: #D8DEE9;
  --t-muted-2: #8FBCBB;
  --t-muted-3: #4C566A;
  --t-muted-4: #434C5E;
  --t-accent: #88C0D0;
  --t-accent-2: #8FBCBB;
  --t-accent-rgb: 136,192,208;
  --t-accent-dim: rgba(136,192,208,0.08);
  --t-danger: #BF616A;
}
[data-theme="amber"] {
  color-scheme: dark;
  --t-bg: #0a0800;
  --t-surface: #14100a;
  --t-border: #2a1f0a;
  --t-text: #fef3c7;
  --t-text-2: #fde68a;
  --t-muted-1: #d97706;
  --t-muted-2: #b45309;
  --t-muted-3: #92400e;
  --t-muted-4: #78350f;
  --t-accent: #f59e0b;
  --t-accent-2: #fcd34d;
  --t-accent-rgb: 245,158,11;
  --t-accent-dim: rgba(245,158,11,0.08);
  --t-danger: #f87171;
}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Theme CSS variables — must be inline to survive Turbopack dev processing */}
        <style dangerouslySetInnerHTML={{ __html: THEME_CSS }} />
      </head>
      <body className="h-full flex flex-col overflow-hidden">
        {/* Apply stored theme before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('sp-theme')||'terminal';document.documentElement.setAttribute('data-theme',t);})();`,
          }}
        />
        {children}
      </body>
    </html>
  );
}
