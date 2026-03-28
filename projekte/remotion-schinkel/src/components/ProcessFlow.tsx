import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { TEAL, NAVY_MID, WHITE, GRAY } from "../helpers";

interface ProcessStep {
  icon: string;
  label: string;
  sublabel?: string;
}

interface ProcessFlowProps {
  steps: ProcessStep[];
  startFrame?: number;
  color?: string;
}

/** Animated horizontal process flow: Step → Arrow → Step → Arrow → Step */
export const ProcessFlow: React.FC<ProcessFlowProps> = ({
  steps,
  startFrame = 0,
  color = TEAL,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((step, i) => {
        const stepDelay = startFrame + i * 22;
        const arrowDelay = stepDelay + 14;

        const stepProgress = spring({
          frame: frame - stepDelay,
          fps,
          config: { damping: 14, stiffness: 200, mass: 0.6 },
        });
        const stepOpacity = interpolate(stepProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });
        const stepScale = interpolate(stepProgress, [0, 1], [0.7, 1]);

        const arrowWidth = i < steps.length - 1
          ? interpolate(frame, [arrowDelay, arrowDelay + 18], [0, 60], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        const arrowOpacity = i < steps.length - 1
          ? interpolate(frame, [arrowDelay, arrowDelay + 18], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })
          : 0;

        return (
          <React.Fragment key={i}>
            {/* Step Node */}
            <div
              style={{
                opacity: stepOpacity,
                transform: `scale(${stepScale})`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: `rgba(0,180,200,0.12)`,
                  border: `2px solid ${color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 30,
                }}
              >
                {step.icon}
              </div>

              {/* Label */}
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: WHITE,
                  textAlign: "center",
                  maxWidth: 90,
                  lineHeight: 1.3,
                  fontFamily: "system-ui, -apple-system, sans-serif",
                }}
              >
                {step.label}
              </div>
              {step.sublabel && (
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 400,
                    color: GRAY,
                    textAlign: "center",
                    maxWidth: 90,
                    lineHeight: 1.3,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >
                  {step.sublabel}
                </div>
              )}
            </div>

            {/* Arrow */}
            {i < steps.length - 1 && (
              <div
                style={{
                  opacity: arrowOpacity,
                  display: "flex",
                  alignItems: "center",
                  paddingBottom: 28, // align with icon center (not label)
                }}
              >
                {/* Line */}
                <div
                  style={{
                    width: arrowWidth,
                    height: 2,
                    background: `linear-gradient(90deg, ${color}, ${color}cc)`,
                    borderRadius: 1,
                  }}
                />
                {/* Arrowhead */}
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    borderLeft: `8px solid ${color}`,
                    opacity: arrowWidth > 50 ? 1 : arrowWidth / 50,
                  }}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
