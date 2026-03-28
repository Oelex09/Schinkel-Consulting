import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill, spring, useVideoConfig } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Logo } from "../components/Logo";
import { WordReveal } from "../components/WordReveal";
import { AnimatedCharacter } from "../components/AnimatedCharacter";
import { TEAL, WHITE, GRAY } from "../helpers";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowOp = interpolate(frame, [8, 24], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(frame, [8, 32], [0, 48], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Character enters from top at frame 0
  const charProgress = spring({ frame, fps, config: { damping: 9, stiffness: 60, mass: 1.8 } });
  const charY = interpolate(charProgress, [0, 1], [-280, 0]);

  return (
    <AbsoluteFill>
      <KenBurns src="photos/craftsman_site.jpg" direction="zoom-in" overlayStrength="heavy" />

      {/* Logo */}
      <AbsoluteFill style={{ padding: "44px 100px" }}>
        <Logo variant="white" height={46} startFrame={0} animationType="spring" />
      </AbsoluteFill>

      {/* Animated character – falls from sky into bottom-right */}
      <div style={{
        position: "absolute",
        right: 140,
        bottom: 0,
        transform: `translateY(${charY}px)`,
      }}>
        <svg width={220} height={340} viewBox="0 0 220 340" overflow="visible">
          <AnimatedCharacter pose="falling" startFrame={0} size={220} />
        </svg>
      </div>

      {/* Text content */}
      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        justifyContent: "center", padding: "0 100px",
      }}>
        <div style={{
          opacity: eyebrowOp,
          display: "flex", alignItems: "center", gap: 14, marginBottom: 32,
        }}>
          <div style={{ width: lineW, height: 2, background: TEAL, borderRadius: 1 }} />
          <span style={{
            fontSize: 15, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: TEAL,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Workflow-Automatisierung · Handwerk & Bau</span>
        </div>

        <WordReveal
          text="Handwerker, die heute noch alles manuell erledigen,"
          startFrame={18} framesPerWord={7}
          highlightWords={["manuell"]}
          style={{
            fontSize: 76, fontWeight: 900, lineHeight: 1.08,
            letterSpacing: "-0.025em", color: WHITE,
            maxWidth: 960, fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        />
        <div style={{ marginTop: 8 }}>
          <WordReveal
            text="verlieren morgen den Auftrag."
            startFrame={55} framesPerWord={8}
            highlightWords={["verlieren", "Auftrag."]}
            style={{
              fontSize: 76, fontWeight: 900, lineHeight: 1.08,
              letterSpacing: "-0.025em", color: TEAL,
              maxWidth: 960, fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          />
        </div>
      </AbsoluteFill>

      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, ${TEAL}, transparent)`,
        opacity: interpolate(frame, [80, 110], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }} />
    </AbsoluteFill>
  );
};
