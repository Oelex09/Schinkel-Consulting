import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig, AbsoluteFill, Img, staticFile } from "remotion";
import { Logo } from "../components/Logo";
import { WordReveal } from "../components/WordReveal";
import { AlexanderCartoon } from "../components/AlexanderCartoon";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

const CREDENTIALS = [
  { icon: "🏗️", text: "Maurer- & Stahlbetonbaumeister" },
  { icon: "📐", text: "Bautechniker & Kaufmann" },
  { icon: "⏱️", text: "30 Jahre Branchenerfahrung" },
  { icon: "🤖", text: "KI- & Prozess-Experte" },
];

export const Scene04WhoAmI: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const photoProgress = spring({
    frame: frame - 0,
    fps,
    config: { damping: 20, stiffness: 130, mass: 1.2 },
  });
  const photoOpacity = interpolate(photoProgress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const photoScale = interpolate(photoProgress, [0, 1], [0.94, 1]);
  const photoX = interpolate(photoProgress, [0, 1], [40, 0]);

  const lineWidth = interpolate(frame, [5, 28], [0, 100], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #060d1a 0%, ${NAVY} 55%, #0d2240 100%)`,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "60px 80px",
        gap: 72,
      }}
    >
      {/* Left: Alexander Cartoon + real photo side by side */}
      <div style={{ flex: "0 0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: 0 }}>
        {/* Cartoon character */}
        <AlexanderCartoon pose="presenting" startFrame={0} size={240} />

        {/* Small real photo badge below */}
        <div style={{
          marginTop: -20,
          opacity: interpolate(frame, [30, 48], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(0,0,0,0.45)",
          backdropFilter: "blur(8px)",
          border: `1px solid rgba(0,180,200,0.3)`,
          borderRadius: 40,
          padding: "6px 14px 6px 6px",
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            overflow: "hidden", border: `2px solid ${TEAL}`, flexShrink: 0,
          }}>
            <Img src={staticFile("alexander.jpeg")}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: WHITE, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Alexander Schinkel
            </div>
            <div style={{ fontSize: 10, fontWeight: 500, color: TEAL, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "system-ui, -apple-system, sans-serif" }}>
              Schinkel Consulting
            </div>
          </div>
        </div>
      </div>

      {/* Right: Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          opacity: interpolate(frame, [5, 20], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          display: "flex", alignItems: "center", gap: 12, marginBottom: 22,
        }}>
          <div style={{ width: `${lineWidth}%`, maxWidth: 36, height: 2, background: TEAL }} />
          <span style={{
            fontSize: 13, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: TEAL,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Hi, ich bin</span>
        </div>

        <WordReveal
          text="Ich kenne den Alltag im Bauhandwerk – nicht aus Büchern, sondern aus 30 Jahren auf der Baustelle."
          startFrame={22}
          framesPerWord={6}
          highlightWords={["30", "Jahren"]}
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: WHITE,
            lineHeight: 1.35,
            letterSpacing: "-0.015em",
            marginBottom: 32,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 32 }}>
          {CREDENTIALS.map((c, i) => {
            const op = interpolate(frame, [58 + i * 16, 74 + i * 16], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [58 + i * 16, 74 + i * 16], [-28, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            return (
              <div key={c.text} style={{ opacity: op, transform: `translateX(${x}px)`, display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 20 }}>{c.icon}</span>
                <span style={{
                  fontSize: 19, fontWeight: 500, color: GRAY,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}>{c.text}</span>
              </div>
            );
          })}
        </div>

        <div style={{
          opacity: interpolate(frame, [125, 142], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [125, 142], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          display: "flex", alignItems: "center", gap: 16,
          paddingTop: 20,
          borderTop: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Logo variant="white" height={34} startFrame={0} animationType="none" />
          <span style={{
            fontSize: 15, color: GRAY,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Praxisnah · Ohne IT-Kenntnisse · Sofort wirksam</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};
