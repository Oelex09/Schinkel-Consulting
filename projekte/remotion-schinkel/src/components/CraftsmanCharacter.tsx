import React from "react";
import { useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";
import { TEAL, WHITE, NAVY_MID } from "../helpers";

interface CraftsmanCharacterProps {
  variant: "stressed" | "happy" | "phone";
  startFrame?: number;
  size?: number;
}

/**
 * Flat-design SVG craftsman character with looping animations.
 * "stressed" = overwhelmed with papers
 * "happy"    = relaxed, thumbs up, digitally transformed
 * "phone"    = using smartphone on construction site
 */
export const CraftsmanCharacter: React.FC<CraftsmanCharacterProps> = ({
  variant,
  startFrame = 0,
  size = 200,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const elapsed = Math.max(0, frame - startFrame);

  // Entrance
  const entryProgress = spring({
    frame: elapsed,
    fps,
    config: { damping: 14, stiffness: 160 },
  });
  const entryScale = interpolate(entryProgress, [0, 1], [0.5, 1]);
  const entryOpacity = interpolate(entryProgress, [0, 0.4], [0, 1], { extrapolateRight: "clamp" });

  // Body bob (breathing)
  const bob = interpolate(Math.sin((elapsed / fps) * 2.2 * Math.PI), [-1, 1], [-2, 2]);

  // Arm wave (stressed: shaking papers; happy: wave; phone: hold phone)
  const armSwing = interpolate(
    Math.sin((elapsed / fps) * 3 * Math.PI),
    [-1, 1],
    [-15, 15]
  );

  // Paper float (stressed variant)
  const paper1Y = interpolate(Math.sin((elapsed / fps) * 1.8 * Math.PI), [-1, 1], [-4, 4]);
  const paper1Rot = interpolate(Math.sin((elapsed / fps) * 2.1 * Math.PI), [-1, 1], [-8, 8]);
  const paper2Y = interpolate(Math.sin((elapsed / fps) * 1.5 * Math.PI + 1), [-1, 1], [-5, 3]);
  const paper2Rot = interpolate(Math.sin((elapsed / fps) * 1.9 * Math.PI + 0.5), [-1, 1], [5, -5]);

  // Checkmark pop (happy variant)
  const checkScale = spring({
    frame: elapsed - 20,
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  const s = size;
  const cx = s / 2;   // center x
  const headY = s * 0.18;
  const bodyY = s * 0.38;
  const legY = s * 0.62;

  // Hard hat color
  const hatColor = variant === "stressed" ? "#e07a30" : "#f5a623";
  // Vest color
  const vestColor = variant === "stressed" ? "#d44" : "#2ecc71";
  const skinColor = "#f3c39a";
  const shirtColor = "#ecf0f1";

  return (
    <svg
      width={s}
      height={s * 1.4}
      viewBox={`0 0 ${s} ${s * 1.4}`}
      style={{
        opacity: entryOpacity,
        transform: `scale(${entryScale})`,
        transformOrigin: "center bottom",
        overflow: "visible",
      }}
    >
      <g transform={`translate(0, ${bob})`}>

        {/* ── STRESSED VARIANT ── */}
        {variant === "stressed" && (
          <>
            {/* Floating papers behind */}
            <g transform={`translate(${cx + 28}, ${bodyY - 20}) rotate(${paper1Rot}) translate(0, ${paper1Y})`}>
              <rect x={-14} y={-18} width={28} height={36} rx={2} fill="white" stroke="#ccc" strokeWidth={1} opacity={0.9} />
              <line x1={-8} y1={-10} x2={8} y2={-10} stroke="#aaa" strokeWidth={1.5} />
              <line x1={-8} y1={-4} x2={8} y2={-4} stroke="#aaa" strokeWidth={1.5} />
              <line x1={-8} y1={2} x2={4} y2={2} stroke="#aaa" strokeWidth={1.5} />
            </g>
            <g transform={`translate(${cx - 36}, ${bodyY - 35}) rotate(${paper2Rot}) translate(0, ${paper2Y})`}>
              <rect x={-14} y={-18} width={28} height={36} rx={2} fill="white" stroke="#ccc" strokeWidth={1} opacity={0.85} />
              <line x1={-8} y1={-10} x2={8} y2={-10} stroke="#aaa" strokeWidth={1.5} />
              <line x1={-8} y1={-4} x2={8} y2={-4} stroke="#aaa" strokeWidth={1.5} />
            </g>

            {/* Stress sweat drops */}
            <g opacity={interpolate(Math.sin((elapsed / fps) * 4 * Math.PI), [-1, 1], [0.4, 1])}>
              <ellipse cx={cx + 26} cy={headY - 6} rx={3} ry={5} fill="#74b9ff" opacity={0.7} />
              <ellipse cx={cx - 28} cy={headY} rx={2.5} ry={4} fill="#74b9ff" opacity={0.6} />
            </g>

            {/* Right arm raised with papers */}
            <g transform={`translate(${cx + 20}, ${bodyY + 5}) rotate(${-30 + armSwing * 0.5})`}>
              <line x1={0} y1={0} x2={22} y2={-18} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
              {/* Paper in hand */}
              <g transform="translate(22, -18)">
                <rect x={-10} y={-14} width={22} height={28} rx={2} fill="white" stroke="#ccc" strokeWidth={1} />
                <line x1={-5} y1={-7} x2={7} y2={-7} stroke="#bbb" strokeWidth={1.5} />
                <line x1={-5} y1={-1} x2={7} y2={-1} stroke="#bbb" strokeWidth={1.5} />
              </g>
            </g>

            {/* Left arm down */}
            <g transform={`translate(${cx - 20}, ${bodyY + 5}) rotate(${20 - armSwing * 0.3})`}>
              <line x1={0} y1={0} x2={-18} y2={20} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
            </g>

            {/* Worried mouth */}
            <path
              d={`M ${cx - 8} ${headY + 10} Q ${cx} ${headY + 6} ${cx + 8} ${headY + 10}`}
              fill="none"
              stroke="#c0392b"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Furrowed brows */}
            <line x1={cx - 11} y1={headY - 5} x2={cx - 4} y2={headY - 2} stroke="#555" strokeWidth={2.5} strokeLinecap="round" />
            <line x1={cx + 11} y1={headY - 5} x2={cx + 4} y2={headY - 2} stroke="#555" strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}

        {/* ── HAPPY VARIANT ── */}
        {variant === "happy" && (
          <>
            {/* Checkmark badge */}
            <g transform={`translate(${cx + 30}, ${bodyY - 30}) scale(${Math.max(0, checkScale)})`}
               style={{ transformOrigin: `${cx + 30}px ${bodyY - 30}px` }}>
              <circle cx={0} cy={0} r={22} fill={TEAL} />
              <path d="M -10 0 L -3 8 L 12 -8" fill="none" stroke="white" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
            </g>

            {/* Right arm wave up */}
            <g transform={`translate(${cx + 20}, ${bodyY + 5}) rotate(${-45 + armSwing})`}>
              <line x1={0} y1={0} x2={20} y2={-22} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
              {/* Thumbs up hand */}
              <g transform="translate(20, -22)">
                <rect x={-6} y={-12} width={12} height={10} rx={3} fill={skinColor} />
                <rect x={-8} y={-6} width={16} height={10} rx={4} fill={skinColor} />
              </g>
            </g>

            {/* Left arm holding tablet */}
            <g transform={`translate(${cx - 20}, ${bodyY + 5}) rotate(${15})`}>
              <line x1={0} y1={0} x2={-16} y2={18} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
              <g transform="translate(-16, 18)">
                <rect x={-14} y={-10} width={22} height={28} rx={3} fill="#2c3e50" />
                <rect x={-10} y={-6} width={14} height={18} rx={1} fill={`${TEAL}99`} />
                {/* Screen graph */}
                <polyline points="-8,8 -5,2 -1,5 3,0" fill="none" stroke={TEAL} strokeWidth={1.5} />
              </g>
            </g>

            {/* Happy smile */}
            <path
              d={`M ${cx - 9} ${headY + 6} Q ${cx} ${headY + 14} ${cx + 9} ${headY + 6}`}
              fill="none"
              stroke="#27ae60"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            {/* Happy eyes */}
            <path d={`M ${cx - 9} ${headY - 4} Q ${cx - 5} ${headY - 8} ${cx - 1} ${headY - 4}`}
              fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round" />
            <path d={`M ${cx + 1} ${headY - 4} Q ${cx + 5} ${headY - 8} ${cx + 9} ${headY - 4}`}
              fill="none" stroke="#555" strokeWidth={2} strokeLinecap="round" />
          </>
        )}

        {/* ── PHONE VARIANT ── */}
        {variant === "phone" && (
          <>
            {/* Right arm holding phone up */}
            <g transform={`translate(${cx + 20}, ${bodyY + 5}) rotate(${-55 + armSwing * 0.4})`}>
              <line x1={0} y1={0} x2={18} y2={-28} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
              <g transform={`translate(18, -28) rotate(${10})`}>
                {/* Smartphone */}
                <rect x={-9} y={-18} width={18} height={30} rx={3} fill="#2c3e50" />
                <rect x={-6} y={-14} width={12} height={22} rx={1} fill="#3498db" opacity={0.8} />
                {/* Signal waves */}
                <path d="M 14 -14 Q 20 -8 14 -2" fill="none" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round"
                  opacity={interpolate(Math.sin((elapsed / fps) * 3 * Math.PI), [-1, 1], [0.3, 1])} />
                <path d="M 18 -18 Q 26 -8 18 2" fill="none" stroke={TEAL} strokeWidth={1.5} strokeLinecap="round"
                  opacity={interpolate(Math.sin((elapsed / fps) * 3 * Math.PI + 1), [-1, 1], [0.2, 0.8])} />
              </g>
            </g>

            {/* Left arm at side */}
            <g transform={`translate(${cx - 20}, ${bodyY + 5}) rotate(${15})`}>
              <line x1={0} y1={0} x2={-14} y2={22} stroke={skinColor} strokeWidth={8} strokeLinecap="round" />
            </g>

            {/* Focused face */}
            <ellipse cx={cx - 5} cy={headY - 1} rx={3} ry={3.5} fill="#555" />
            <ellipse cx={cx + 5} cy={headY - 1} rx={3} ry={3.5} fill="#555" />
            <line x1={cx - 6} y1={headY + 8} x2={cx + 6} y2={headY + 8} stroke="#666" strokeWidth={2} strokeLinecap="round" />
          </>
        )}

        {/* ── SHARED BODY PARTS (drawn on top so z-order is right) ── */}

        {/* Legs */}
        <line x1={cx - 10} y1={legY} x2={cx - 14} y2={s * 0.95} stroke="#2c3e50" strokeWidth={10} strokeLinecap="round" />
        <line x1={cx + 10} y1={legY} x2={cx + 14} y2={s * 0.95} stroke="#2c3e50" strokeWidth={10} strokeLinecap="round" />
        {/* Boots */}
        <ellipse cx={cx - 16} cy={s * 0.97} rx={10} ry={5} fill="#1a252f" />
        <ellipse cx={cx + 16} cy={s * 0.97} rx={10} ry={5} fill="#1a252f" />

        {/* Safety vest / body */}
        <path
          d={`M ${cx - 22} ${bodyY} L ${cx - 18} ${legY} L ${cx + 18} ${legY} L ${cx + 22} ${bodyY} Z`}
          fill={vestColor}
          opacity={0.85}
        />
        {/* Shirt underneath */}
        <path
          d={`M ${cx - 16} ${bodyY + 2} L ${cx - 13} ${legY - 2} L ${cx + 13} ${legY - 2} L ${cx + 16} ${bodyY + 2} Z`}
          fill={shirtColor}
        />
        {/* Vest reflective stripes */}
        <line x1={cx - 18} y1={bodyY + 14} x2={cx + 18} y2={bodyY + 14} stroke="white" strokeWidth={3} opacity={0.7} />

        {/* Neck */}
        <rect x={cx - 7} y={headY + 14} width={14} height={12} rx={4} fill={skinColor} />

        {/* Head */}
        <ellipse cx={cx} cy={headY} rx={22} ry={24} fill={skinColor} />

        {/* Hard hat */}
        <ellipse cx={cx} cy={headY - 18} rx={26} ry={10} fill={hatColor} />
        <rect x={cx - 20} y={headY - 26} width={40} height={16} rx={8} fill={hatColor} />
        <rect x={cx - 22} y={headY - 16} width={44} height={5} rx={2} fill={`${hatColor}cc`} />
        {/* Hat brim */}
        <ellipse cx={cx} cy={headY - 14} rx={28} ry={5} fill={`${hatColor}88`} />
      </g>
    </svg>
  );
};
