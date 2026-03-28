import React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { NAVY } from "../helpers";

interface KenBurnsProps {
  src: string;
  direction?: "zoom-in" | "zoom-out" | "pan-left" | "pan-right";
  overlayStrength?: "light" | "medium" | "heavy";
  overlayColor?: string;
  totalFrames?: number;
}

/**
 * Cinematic Ken Burns effect on a photo.
 * Slow zoom or pan creates motion without video footage.
 */
export const KenBurns: React.FC<KenBurnsProps> = ({
  src,
  direction = "zoom-in",
  overlayStrength = "medium",
  overlayColor = NAVY,
  totalFrames,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const total = totalFrames ?? durationInFrames;

  const progress = interpolate(frame, [0, total], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle fade in at start
  const fadeIn = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let scale = 1;
  let translateX = 0;
  let translateY = 0;

  switch (direction) {
    case "zoom-in":
      scale = interpolate(progress, [0, 1], [1.0, 1.12]);
      break;
    case "zoom-out":
      scale = interpolate(progress, [0, 1], [1.12, 1.0]);
      break;
    case "pan-left":
      scale = 1.08;
      translateX = interpolate(progress, [0, 1], [0, -5]);
      break;
    case "pan-right":
      scale = 1.08;
      translateX = interpolate(progress, [0, 1], [-5, 0]);
      break;
  }

  const overlayOpacity =
    overlayStrength === "light" ? 0.45 :
    overlayStrength === "medium" ? 0.65 :
    0.80;

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      {/* Photo */}
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            transform: `scale(${scale}) translate(${translateX}%, ${translateY}%)`,
            transformOrigin: "center center",
          }}
        />
      </AbsoluteFill>

      {/* Dark overlay gradient – left heavy for text */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(
            105deg,
            ${overlayColor}e0 0%,
            ${overlayColor}bb 35%,
            ${overlayColor}80 60%,
            ${overlayColor}40 100%
          )`,
        }}
      />

      {/* Extra bottom gradient for lower-third legibility */}
      <AbsoluteFill
        style={{
          background: `linear-gradient(0deg, ${overlayColor}cc 0%, transparent 40%)`,
        }}
      />
    </AbsoluteFill>
  );
};
