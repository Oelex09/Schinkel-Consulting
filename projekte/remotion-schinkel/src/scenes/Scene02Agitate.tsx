import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { WordReveal } from "../components/WordReveal";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

const PAIN_POINTS = [
  { icon: "📋", label: "Bautagebuch", sub: "täglich per Hand", delay: 30 },
  { icon: "🎙️", label: "Protokolle", sub: "stundenlang schreiben", delay: 58 },
  { icon: "📧", label: "E-Mail-Chaos", sub: "100+ Mails unbeantwortet", delay: 86 },
  { icon: "📄", label: "Rechnungen & Angebote", sub: "alles manuell", delay: 114 },
];

export const Scene02Agitate: React.FC = () => {
  const frame = useCurrentFrame();

  const punchOpacity = interpolate(frame, [140, 158], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const punchY = interpolate(frame, [140, 158], [24, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      {/* Stressed office worker background */}
      <KenBurns src="photos/stress_office.jpg" direction="zoom-in" overlayStrength="heavy" />

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 100px",
        }}
      >
        <WordReveal
          text="Als Chef läuft deine Baustelle."
          startFrame={10}
          framesPerWord={6}
          highlightWords={["Baustelle."]}
          style={{
            fontSize: 52,
            fontWeight: 800,
            color: WHITE,
            marginBottom: 6,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.02em",
          }}
        />
        <WordReveal
          text="Aber im Büro verlierst du täglich Stunden mit:"
          startFrame={42}
          framesPerWord={5}
          highlightWords={["Stunden"]}
          style={{
            fontSize: 30,
            fontWeight: 400,
            color: GRAY,
            marginBottom: 48,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        />

        {/* Pain point rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {PAIN_POINTS.map((p) => {
            const op = interpolate(frame, [p.delay, p.delay + 18], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [p.delay, p.delay + 18], [-50, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div
                key={p.label}
                style={{
                  opacity: op,
                  transform: `translateX(${x}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  background: "rgba(0,0,0,0.35)",
                  backdropFilter: "blur(8px)",
                  borderLeft: `4px solid ${TEAL}`,
                  borderRadius: "0 10px 10px 0",
                  padding: "14px 24px",
                  maxWidth: 520,
                }}
              >
                <span style={{ fontSize: 28 }}>{p.icon}</span>
                <div>
                  <div style={{
                    fontSize: 20, fontWeight: 700, color: WHITE,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}>
                    {p.label}
                  </div>
                  <div style={{
                    fontSize: 14, fontWeight: 400, color: GRAY,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}>
                    {p.sub}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Punch line */}
        <div
          style={{
            opacity: punchOpacity,
            transform: `translateY(${punchY}px)`,
            marginTop: 36,
            fontSize: 32,
            fontWeight: 900,
            color: TEAL,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.02em",
          }}
        >
          Das muss nicht so sein.
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
