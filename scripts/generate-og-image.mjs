// One-off generator for public/og.png (1200x630 social card).
// Run: node scripts/generate-og-image.mjs
import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../public/notion-data.json", import.meta.url)));
const { name, title, company, location } = data.personal;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#09090b"/>
  <circle cx="1050" cy="80" r="320" fill="rgba(52,211,153,0.05)"/>
  <circle cx="120" cy="580" r="260" fill="rgba(52,211,153,0.04)"/>

  <!-- terminal window -->
  <rect x="100" y="95" width="1000" height="440" rx="16" fill="#18181b" stroke="#27272a" stroke-width="2"/>
  <!-- title bar -->
  <rect x="100" y="95" width="1000" height="56" rx="16" fill="#1f1f23"/>
  <rect x="100" y="123" width="1000" height="28" fill="#1f1f23"/>
  <line x1="100" y1="151" x2="1100" y2="151" stroke="#27272a" stroke-width="2"/>
  <circle cx="140" cy="123" r="9" fill="#f87171"/>
  <circle cx="170" cy="123" r="9" fill="#fbbf24"/>
  <circle cx="200" cy="123" r="9" fill="#34d399"/>
  <text x="600" y="130" text-anchor="middle" font-family="Menlo, Monaco, monospace" font-size="20" fill="#71717a">sujay@portfolio: ~</text>

  <!-- body -->
  <text x="160" y="225" font-family="Menlo, Monaco, monospace" font-size="26" fill="#71717a"><tspan fill="#34d399">$</tspan> whoami</text>
  <text x="160" y="300" font-family="Menlo, Monaco, monospace" font-weight="bold" font-size="64" fill="#f4f4f5">${esc(name)}</text>
  <text x="160" y="356" font-family="Menlo, Monaco, monospace" font-size="32" fill="#34d399">${esc(title)} @ ${esc(company)}</text>
  <text x="160" y="408" font-family="Menlo, Monaco, monospace" font-size="24" fill="#a1a1aa">${esc(location)}</text>

  <text x="160" y="480" font-family="Menlo, Monaco, monospace" font-size="26" fill="#71717a"><tspan fill="#34d399">$</tspan> </text>
  <rect x="200" y="458" width="16" height="30" fill="#34d399"/>

  <text x="600" y="585" text-anchor="middle" font-family="Menlo, Monaco, monospace" font-size="22" fill="#52525b">sujay-patni.github.io</text>
</svg>`;

const png = await sharp(Buffer.from(svg), { density: 96 }).png().toBuffer();
writeFileSync(new URL("../public/og.png", import.meta.url), png);
console.log(`wrote public/og.png (${png.length} bytes)`);
