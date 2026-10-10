import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/*
 * The shared-link card: a 1200 x 630 PNG generated at build time and served
 * for LinkedIn, WhatsApp, Slack and X previews. The stylesheet never reaches
 * this file, so colours are the dark-theme token values written as literals
 * (bg, text, faint, border, accent from app/globals.css), and the serif is
 * loaded from the static Source Serif 4 files in app/og/, since next/font is
 * not available to next/og and satori cannot use the variable font.
 */

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Pranay Patil - product management portfolio";

const sourceSerifRegular = readFileSync(join(process.cwd(), "app/og", "SourceSerif4-Regular.ttf"));
const sourceSerifSemibold = readFileSync(join(process.cwd(), "app/og", "SourceSerif4-Semibold.ttf"));

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 80,
          background: "#0f0f0f",
          fontFamily: "Source Serif 4",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 400,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#858078",
          }}
        >
          Portfolio
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.1,
            color: "#edeae4",
          }}
        >
          Pranay Patil
        </div>
        <div style={{ marginTop: 40, marginBottom: 40, width: 120, height: 1, background: "#2a2a28" }} />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 34,
            fontWeight: 400,
            lineHeight: 1.35,
            color: "#edeae4",
          }}
        >
          <div>Product thinking, evidence,</div>
          <div>and the decisions behind it.</div>
        </div>
        <div style={{ marginTop: "auto", fontSize: 26, fontWeight: 400, color: "#d99a4e" }}>
          Targeting APM / Junior PM roles
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Source Serif 4", data: sourceSerifRegular, weight: 400, style: "normal" },
        { name: "Source Serif 4", data: sourceSerifSemibold, weight: 600, style: "normal" },
      ],
    },
  );
}
