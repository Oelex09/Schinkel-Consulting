import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { WordReveal } from "../components/WordReveal";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

const RESULTS = [
  { text: "Bis zu 40% weniger Büroaufwand", delay: 25 },
  { text: "Keine verlorenen Informationen mehr", delay: 50 },
  { text: "Schnellere Reaktionszeiten gegenüber Kunden", delay: 75 },
  { text: "Mehr Kapazität für Wachstum & Akquise", delay: 100 },
  { text: "Sofort einsetzbar – ohne IT-Kenntnisse", delay: 125 },
];

export const Scene06Results: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 18], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <KenBurns src="photos/craftsman_portrait.jpg" direction="zoom-out" overlayStrength="heavy" />

      <AbsoluteFill
        style={{
          display: "flex", flexDirection: "column",
          justifyContent: "center",
          padding: "0 100px",
        }}
      >
        {/* Header */}
        <div style={{ opacity: headerOpacity, transform: `translateY(${headerY}px)`, marginBottom: 44 }}>
          <div style={{
            fontSize: 14, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: TEAL, marginBottom: 10,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Dein Ergebnis</div>
          <div style={{
            fontSize: 54, fontWeight: 900, color: WHITE,
            letterSpacing: "-0.025em", lineHeight: 1.08,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Was du konkret gewinnst.</div>
        </div>

        {/* Results list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {RESULTS.map((r, i) => {
            const checkProgress = spring({
              frame: frame - r.delay,
              fps,
              config: { damping: 14, stiffness: 220 },
            });
            const rowOp = interpolate(frame, [r.delay, r.delay + 16], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const rowX = interpolate(frame, [r.delay, r.delay + 16], [-40, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            return (
              <div key={r.text} style={{
                opacity: rowOp,
                transform: `translateX(${rowX}px)`,
                display: "flex", alignItems: "center", gap: 20,
                paddingBottom: 16,
                borderBottom: i < RESULTS.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                {/* Animated checkmark */}
                <div style={{
                  transform: `scale(${Math.max(0, checkProgress)})`,
                  width: 38, height: 38, borderRadius: "50%",
                  background: "rgba(0,180,200,0.15)",
                  border: `2px solid ${TEAL}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <span style={{ fontSize: 18, color: TEAL, fontWeight: 700, lineHeight: 1 }}>✓</span>
                </div>
                <span style={{
                  fontSize: 27, fontWeight: 600, color: WHITE,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}>{r.text}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom punch */}
        <div style={{
          marginTop: 40,
          opacity: interpolate(frame, [155, 172], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [155, 172], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          fontSize: 28, fontWeight: 800, color: TEAL,
          fontFamily: "system-ui, -apple-system, sans-serif",
          letterSpacing: "-0.01em",
        }}>
          Innerhalb von 4–8 Wochen. Garantiert.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
