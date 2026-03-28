import React from "react";
import { Composition } from "remotion";
import { SchinkelVideo } from "./SchinkelVideo";

/**
 * Total frames = sum of all scene durations - (number of transitions * transition duration)
 * 150 + 180 + 150 + 210 + 240 + 210 + 180 - (6 * 20) = 1320 - 120 = 1200 frames = 40s
 */
const TOTAL_FRAMES = 1200;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="SchinkelVideo"
      component={SchinkelVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
