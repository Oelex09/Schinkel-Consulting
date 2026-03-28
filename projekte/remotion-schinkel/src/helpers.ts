import { interpolate, spring } from "remotion";

export const NAVY = "#0d1f3c";
export const NAVY_MID = "#162d55";
export const TEAL = "#00b4c8";
export const WHITE = "#ffffff";
export const GRAY = "rgba(255,255,255,0.55)";

export const FPS = 30;

/** Fade-in + slide-up from bottom */
export function fadeUp(
  frame: number,
  startFrame: number,
  durationFrames = 18,
  distance = 40
) {
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const y = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [distance, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return { opacity, transform: `translateY(${y}px)` };
}

/** Fade-in only */
export function fadeIn(frame: number, startFrame: number, durationFrames = 18) {
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return { opacity };
}

/** Slide-in from left */
export function slideLeft(
  frame: number,
  startFrame: number,
  durationFrames = 20,
  distance = 60
) {
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const x = interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [-distance, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return { opacity, transform: `translateX(${x}px)` };
}

/** Scale + fade spring pop */
export function springPop(
  frame: number,
  startFrame: number,
  fps: number,
  damping = 18
) {
  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping, stiffness: 200, mass: 0.8 },
  });
  const scale = interpolate(progress, [0, 1], [0.5, 1]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  return { opacity, transform: `scale(${scale})` };
}

/** Width animation (for underlines, bars) */
export function expandWidth(
  frame: number,
  startFrame: number,
  durationFrames = 25
) {
  return interpolate(
    frame,
    [startFrame, startFrame + durationFrames],
    [0, 100],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
}
