import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TEAL, NAVY_MID, WHITE, GRAY } from "../helpers";

interface StatCalloutProps {
  number: string;
  label: string;
  startFrame?: number;
  suffix?: string;
}

/** Large animated stat number with label – used for "40% weniger Aufwand" etc. */
export const StatCallout: React.FC<StatCalloutProps> = ({
  number,
  label,
  startFrame = 0,
  suffix = "",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const scale = interpolate(progress, [0, 1], [0.3, 1]);
  const opacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(
    frame,
    [startFrame + 10, startFrame + 25],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const labelY = interpolate(
    frame,
    [startFrame + 10, startFrame + 25],
    [15, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {/* Accent bar above */}
      <div
        style={{
          width: interpolate(frame, [startFrame, startFrame + 20], [0, 80], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          height: 4,
          background: TEAL,
          borderRadius: 2,
        }}
      />

      {/* Number */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 160,
          fontWeight: 900,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          color: WHITE,
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <span style={{ color: TEAL }}>{number}</span>
        <span style={{ fontSize: 80, color: TEAL }}>{suffix}</span>
      </div>

      {/* Label */}
      <div
        style={{
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
          fontSize: 28,
          fontWeight: 500,
          color: GRAY,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {label}
      </div>
    </div>
  );
};
