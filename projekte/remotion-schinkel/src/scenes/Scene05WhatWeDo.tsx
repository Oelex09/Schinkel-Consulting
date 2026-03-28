import React from "react";
import { useCurrentFrame, interpolate, AbsoluteFill } from "remotion";
import { KenBurns } from "../components/KenBurns";
import { ProcessFlow } from "../components/ProcessFlow";
import { Logo } from "../components/Logo";
import { WordReveal } from "../components/WordReveal";
import { NAVY, TEAL, WHITE, GRAY } from "../helpers";

const SERVICES = [
  {
    icon: "📱", title: "Digitales Bautagebuch", delay: 30,
    flow: [
      { icon: "📱", label: "Smartphone", sublabel: "Vor Ort" },
      { icon: "☁️", label: "Cloud-Sync", sublabel: "Automatisch" },
      { icon: "📋", label: "Tagesbericht", sublabel: "Fertig" },
      { icon: "📁", label: "Archiviert", sublabel: "Sicher" },
    ],
  },
  {
    icon: "🎙️", title: "Besprechungsprotokolle", delay: 90,
    flow: [
      { icon: "🎙️", label: "Aufnahme", sublabel: "Sprache" },
      { icon: "🤖", label: "KI analysiert", sublabel: "Sekunden" },
      { icon: "📝", label: "Protokoll", sublabel: "Formatiert" },
      { icon: "📤", label: "Versandt", sublabel: "An alle" },
    ],
  },
  {
    icon: "📧", title: "E-Mail-Organisation", delay: 150,
    flow: [
      { icon: "📬", label: "Posteingang", sublabel: "Chaos" },
      { icon: "⚡", label: "Automation", sublabel: "Filtert" },
      { icon: "✅", label: "Wichtiges", sublabel: "Priorisiert" },
      { icon: "💬", label: "Antwort", sublabel: "Automatisch" },
    ],
  },
  {
    icon: "📄", title: "Angebote & Rechnungen", delay: 210,
    flow: [
      { icon: "📏", label: "Aufmaß", sublabel: "Erfasst" },
      { icon: "⚙️", label: "Verarbeitung", sublabel: "Auto" },
      { icon: "📄", label: "Angebot", sublabel: "Erstellt" },
      { icon: "✉️", label: "Rechnung", sublabel: "Versandt" },
    ],
  },
];

export const Scene05WhatWeDo: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <KenBurns src="photos/worker_digital.jpg" direction="pan-left" overlayStrength="heavy" />

      <AbsoluteFill style={{ display: "flex", flexDirection: "column", padding: "48px 90px 36px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <WordReveal
            text="Was wir für dich automatisieren:"
            startFrame={0}
            framesPerWord={6}
            highlightWords={["automatisieren:"]}
            style={{
              fontSize: 42, fontWeight: 900, color: WHITE,
              letterSpacing: "-0.025em",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          />
          <div style={{
            opacity: interpolate(frame, [12, 28], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            }),
          }}>
            <Logo variant="white" height={36} startFrame={0} animationType="none" />
          </div>
        </div>

        {/* Services */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
          {SERVICES.map((s) => {
            const op = interpolate(frame, [s.delay, s.delay + 20], [0, 1], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const x = interpolate(frame, [s.delay, s.delay + 20], [-30, 0], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });
            const barW = interpolate(frame, [s.delay, s.delay + 25], [0, 100], {
              extrapolateLeft: "clamp", extrapolateRight: "clamp",
            });

            return (
              <div key={s.title} style={{
                opacity: op,
                transform: `translateX(${x}px)`,
                display: "flex", alignItems: "center", gap: 28,
                background: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(12px)",
                borderLeft: `3px solid ${TEAL}`,
                borderRadius: "0 10px 10px 0",
                padding: "16px 24px",
                position: "relative", overflow: "hidden",
              }}>
                {/* Subtle teal top bar */}
                <div style={{
                  position: "absolute", top: 0, left: 0,
                  width: `${barW}%`, height: 2, background: TEAL,
                }} />

                <div style={{ minWidth: 220 }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{
                    fontSize: 17, fontWeight: 700, color: WHITE,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}>{s.title}</div>
                </div>

                <div style={{ width: 1, height: 44, background: "rgba(0,180,200,0.3)", flexShrink: 0 }} />

                <ProcessFlow steps={s.flow} startFrame={s.delay + 14} color={TEAL} />
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
