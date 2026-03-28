import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TEAL, NAVY_MID, WHITE, GRAY } from "../helpers";

interface PersonCardProps {
  imageSrc: string;
  name: string;
  title: string;
  startFrame?: number;
  size?: number;
}

export const PersonCard: React.FC<PersonCardProps> = ({
  imageSrc,
  name,
  title,
  startFrame = 0,
  size = 320,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 150, mass: 1 },
  });

  const opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(progress, [0, 1], [0.92, 1]);
  const y = interpolate(progress, [0, 1], [30, 0]);

  const nameOpacity = interpolate(frame, [startFrame + 15, startFrame + 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const nameY = interpolate(frame, [startFrame + 15, startFrame + 30], [12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Teal accent line on photo
  const lineWidth = interpolate(frame, [startFrame + 8, startFrame + 28], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        opacity,
        transform: `scale(${scale}) translateY(${y}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0,
      }}
    >
      {/* Photo frame */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size * 1.25,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(0,180,200,0.2)`,
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center top",
          }}
        />

        {/* Bottom gradient overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: `linear-gradient(0deg, ${NAVY_MID}ee 0%, transparent 100%)`,
          }}
        />

        {/* Teal accent bar at bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: `${lineWidth}%`,
            height: 4,
            background: TEAL,
          }}
        />
      </div>

      {/* Name + title */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          marginTop: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: WHITE,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </div>
        <div
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: TEAL,
            fontFamily: "system-ui, -apple-system, sans-serif",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
};
