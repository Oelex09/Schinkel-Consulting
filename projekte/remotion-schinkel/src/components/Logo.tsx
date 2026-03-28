import React from "react";
import { Img, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";

interface LogoProps {
  variant?: "white" | "color";
  height?: number;
  startFrame?: number;
  animationType?: "fadeUp" | "spring" | "none";
}

export const Logo: React.FC<LogoProps> = ({
  variant = "white",
  height = 52,
  startFrame = 0,
  animationType = "spring",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const src = variant === "white"
    ? staticFile("logo_white.png")
    : staticFile("logo_color.png");

  let opacity = 1;
  let transform = "none";

  if (animationType === "spring") {
    const progress = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 16, stiffness: 160, mass: 0.8 },
    });
    opacity = interpolate(progress, [0, 0.3], [0, 1], { extrapolateRight: "clamp" });
    const scale = interpolate(progress, [0, 1], [0.85, 1]);
    transform = `scale(${scale})`;
  } else if (animationType === "fadeUp") {
    opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const y = interpolate(frame, [startFrame, startFrame + 20], [20, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    transform = `translateY(${y}px)`;
  }

  return (
    <Img
      src={src}
      style={{
        height,
        width: "auto",
        opacity,
        transform,
        objectFit: "contain",
      }}
    />
  );
};
