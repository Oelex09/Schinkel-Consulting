import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, AbsoluteFill } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { StatCallout } from "../components/StatCallout";
import { Logo } from "../components/Logo";
import { WordReveal } from "../components/WordReveal";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

export const Scene03SocialProof: React.FC = () => {
  const frame = useCurrentFrame();

  const topOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const topY = interpolate(frame, [0, 18], [20, 0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <KenBurns src="photos/construction_site.jpg" direction="pan-right" overlayStrength="heavy" />

      {/* Logo */}
      <AbsoluteFill style={{ padding: "44px 100px" }}>
        <Logo variant="white" height={42} startFrame={0} animationType="fadeUp" />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          textAlign: "center",
        }}
      >
        {/* Pre-text */}
        <div
          style={{
            opacity: topOpacity,
            transform: `translateY(${topY}px)`,
            fontSize: 22,
            fontWeight: 500,
            color: GRAY,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 20,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Die erfolgreichsten Betriebe nutzen es bereits
        </div>

        {/* Big stat */}
        <StatCallout number="40" suffix="%" label="weniger Büroaufwand" startFrame={12} />

        {/* Supporting text */}
        <div style={{ marginTop: 44, maxWidth: 820 }}>
          <WordReveal
            text="Durch Workflow-Automatisierung – maßgeschneidert für Handwerk & Bau."
            startFrame={38}
            framesPerWord={7}
            highlightWords={["Workflow-Automatisierung"]}
            align="center"
            style={{
              fontSize: 30,
              fontWeight: 500,
              color: WHITE,
              lineHeight: 1.5,
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          />
        </div>

        {/* Warning box */}
        <div
          style={{
            marginTop: 48,
            opacity: interpolate(frame, [90, 108], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(frame, [90, 108], [20, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(10px)",
            border: `1px solid rgba(0,180,200,0.35)`,
            borderLeft: `4px solid ${TEAL}`,
            borderRadius: "0 8px 8px 0",
            padding: "18px 32px",
            maxWidth: 740,
            textAlign: "left",
          }}
        >
          <span style={{
            fontSize: 18, fontWeight: 400, color: GRAY,
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontStyle: "italic",
          }}>
            ⚠️ Achtung: Sind deine Abläufe nicht klar, verstärkt Automatisierung die Probleme – statt sie zu lösen.
          </span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
