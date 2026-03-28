import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

interface WordRevealProps {
  text: string;
  startFrame?: number;
  framesPerWord?: number;
  style?: React.CSSProperties;
  highlightWords?: string[];
  highlightColor?: string;
  align?: "left" | "center" | "right";
}

/**
 * Reveals words one by one as if being spoken.
 * Highlighted words get teal color + slight scale pop.
 */
export const WordReveal: React.FC<WordRevealProps> = ({
  text,
  startFrame = 0,
  framesPerWord = 8,
  style,
  highlightWords = [],
  highlightColor = "#00b4c8",
  align = "left",
}) => {
  const frame = useCurrentFrame();

  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.3em",
        justifyContent:
          align === "center"
            ? "center"
            : align === "right"
              ? "flex-end"
              : "flex-start",
        ...style,
      }}
    >
      {words.map((word, i) => {
        const wordStart = startFrame + i * framesPerWord;
        const wordEnd = wordStart + framesPerWord + 4;

        const opacity = interpolate(frame, [wordStart, wordEnd], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const y = interpolate(frame, [wordStart, wordEnd], [20, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const isHighlight = highlightWords.some(
          (hw) => word.toLowerCase().replace(/[.,!?]/g, "") === hw.toLowerCase()
        );

        const scale = isHighlight
          ? interpolate(frame, [wordStart, wordEnd + 4], [0.85, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 1;

        return (
          <span
            key={i}
            style={{
              opacity,
              transform: `translateY(${y}px) scale(${scale})`,
              display: "inline-block",
              color: isHighlight ? highlightColor : undefined,
              fontWeight: isHighlight ? 800 : undefined,
            }}
          >
            {word}
          </span>
        );
      })}
    </div>
  );
};
