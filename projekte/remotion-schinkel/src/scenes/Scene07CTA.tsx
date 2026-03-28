import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring, AbsoluteFill } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { Logo } from "../components/Logo";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

export const Scene07CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const glowOpacity = interpolate(frame % 52, [0, 26, 52], [0.25, 0.75, 0.25], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const ctaScale = spring({ frame: frame - 58, fps, config: { damping: 12, stiffness: 200 } });

  return (
    <AbsoluteFill>
      {/* Alexander's futuristic header image as background */}
      <KenBurns src="header.png" direction="zoom-out" overlayStrength="heavy" />

      {/* Top accent */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
      }} />

      <AbsoluteFill style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 120px", textAlign: "center",
      }}>
        {/* Logo */}
        <div style={{ marginBottom: 24 }}>
          <Logo variant="white" height={60} startFrame={0} animationType="spring" />
        </div>

        {/* Divider */}
        <div style={{
          width: interpolate(frame, [14, 36], [0, 90], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          height: 2, background: TEAL, borderRadius: 1, marginBottom: 36,
        }} />

        {/* Main headline */}
        <div style={{
          opacity: interpolate(frame, [20, 38], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          transform: `translateY(${interpolate(frame, [20, 38], [28, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
          marginBottom: 18,
        }}>
          <div style={{
            fontSize: 72, fontWeight: 900, color: WHITE,
            letterSpacing: "-0.03em", lineHeight: 1.05,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Jetzt kostenloses</div>
          <div style={{
            fontSize: 72, fontWeight: 900, color: TEAL,
            letterSpacing: "-0.03em", lineHeight: 1.05,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Erstgespräch sichern.</div>
        </div>

        {/* Sub */}
        <div style={{
          opacity: interpolate(frame, [40, 56], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          fontSize: 22, fontWeight: 400, color: GRAY, marginBottom: 44,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          Unverbindlich · 30 Minuten · Konkrete Ergebnisse
        </div>

        {/* CTA Button with pulsing glow */}
        <div style={{
          opacity: interpolate(frame, [56, 72], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          transform: `scale(${Math.max(0, ctaScale)})`,
          marginBottom: 28, position: "relative",
        }}>
          <div style={{
            position: "absolute", inset: -12,
            background: TEAL, borderRadius: 16,
            opacity: glowOpacity * 0.25, filter: "blur(18px)",
          }} />
          <div style={{
            position: "relative",
            background: TEAL, color: NAVY,
            fontSize: 22, fontWeight: 900,
            letterSpacing: "0.05em", textTransform: "uppercase",
            padding: "22px 68px", borderRadius: 8,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>
            → Termin buchen
          </div>
        </div>

        {/* URL */}
        <div style={{
          opacity: interpolate(frame, [82, 96], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          fontSize: 20, fontWeight: 500, color: GRAY,
          letterSpacing: "0.06em", marginBottom: 32,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}>
          www.alexanderschinkel.com
        </div>

        {/* Trust badge */}
        <div style={{
          opacity: interpolate(frame, [100, 115], [0, 1], {
            extrapolateLeft: "clamp", extrapolateRight: "clamp",
          }),
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(10px)",
          border: `1px solid rgba(0,180,200,0.25)`,
          borderRadius: 40, padding: "10px 28px",
        }}>
          <span style={{ fontSize: 16 }}>⭐</span>
          <span style={{
            fontSize: 15, fontWeight: 500, color: GRAY,
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}>Über 30 Jahre Branchenerfahrung im Bauhandwerk</span>
        </div>
      </AbsoluteFill>

      {/* Bottom accent */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, transparent, ${TEAL}, transparent)`,
        opacity: 0.7,
      }} />
    </AbsoluteFill>
  );
};
