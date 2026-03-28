import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TEAL, NAVY, WHITE } from "../helpers";

type AlexPose = "presenting" | "thumbsup" | "walking" | "wave" | "explaining";

interface AlexanderCartoonProps {
  pose?: AlexPose;
  startFrame?: number;
  size?: number;
}

/**
 * Cartoon caricature of Alexander Schinkel:
 * - Round friendly face
 * - Short dark brown hair (slightly receding temples)
 * - Navy suit jacket + white collar shirt
 * - Teal tie accent (brand color)
 * - Stocky, confident build
 */
export const AlexanderCartoon: React.FC<AlexanderCartoonProps> = ({
  pose = "presenting",
  startFrame = 0,
  size = 260,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - startFrame);
  const s = size;

  // Entry animation
  const entryP = spring({ frame: t, fps, config: { damping: 14, stiffness: 140, mass: 1 } });
  const entryScale = interpolate(entryP, [0, 1], [0.7, 1]);
  const entryY = interpolate(entryP, [0, 1], [30, 0]);
  const entryOp = interpolate(entryP, [0, 0.25], [0, 1], { extrapolateRight: "clamp" });

  // Idle breathing bob
  const bob = Math.sin((t / fps) * 1.6 * Math.PI) * 2.5;

  // Pose-specific arm angles
  let armAngleL = 15;
  let armAngleR = -15;
  let armExtraL = 0; // forearm angle for gesturing

  if (pose === "presenting") {
    armAngleL = interpolate(spring({ frame: t - 10, fps, config: { damping: 12, stiffness: 160 } }), [0, 1], [0, -75]);
    armAngleR = 20;
  }
  if (pose === "thumbsup") {
    armAngleL = -10;
    armAngleR = interpolate(spring({ frame: t - 8, fps, config: { damping: 10, stiffness: 200 } }), [0, 1], [0, -80]);
  }
  if (pose === "walking") {
    const cycle = (t / fps) * 2.8 * Math.PI;
    armAngleL = Math.sin(cycle) * 24;
    armAngleR = -Math.sin(cycle) * 24;
  }
  if (pose === "wave") {
    armAngleL = -85;
    armExtraL = Math.sin((t / fps) * 5 * Math.PI) * 22;
  }
  if (pose === "explaining") {
    armAngleL = -50 + Math.sin((t / fps) * 2 * Math.PI) * 12;
    armAngleR = -30 + Math.sin((t / fps) * 2 * Math.PI + 1) * 10;
  }

  // Walking leg swing
  const legCycle = (t / fps) * 2.8 * Math.PI;
  const legAngleL = pose === "walking" ? Math.sin(legCycle) * 26 : 0;
  const legAngleR = pose === "walking" ? -Math.sin(legCycle) * 26 : 0;
  const walkBob = pose === "walking" ? Math.abs(Math.sin(legCycle)) * -5 : 0;

  const cx = s * 0.5;

  // Proportions
  const headR = s * 0.155;
  const headY = s * 0.19;
  const bodyW = s * 0.28;
  const bodyH = s * 0.31;
  const bodyY = headY + headR * 0.9;
  const legY = bodyY + bodyH;
  const armLen = s * 0.21;
  const legLen = s * 0.27;

  // Colors – based on Alexander's actual look
  const skinColor = "#f0c8a0";     // warm skin tone
  const hairColor = "#2c1f14";     // very dark brown
  const suitColor = "#162d55";     // navy (brand)
  const shirtColor = "#f5f5f5";    // white shirt
  const tieColor = TEAL;            // brand teal
  const pantsColor = "#1a2a45";    // dark navy pants
  const shoeColor = "#111827";     // near black shoes

  return (
    <svg
      width={s}
      height={s * 1.55}
      viewBox={`0 0 ${s} ${s * 1.55}`}
      overflow="visible"
      style={{
        opacity: entryOp,
        transform: `scale(${entryScale}) translateY(${entryY + bob + walkBob}px)`,
        transformOrigin: `${cx}px ${legY + legLen}px`,
      }}
    >
      {/* ── SHADOW ── */}
      <ellipse
        cx={cx} cy={legY + legLen + 12}
        rx={s * 0.22} ry={s * 0.04}
        fill="rgba(0,0,0,0.25)"
        style={{
          transform: `scaleX(${entryScale})`,
          transformOrigin: `${cx}px ${legY + legLen}px`,
        }}
      />

      {/* ── LEGS ── */}
      <g transform={`translate(${cx - bodyW * 0.28}, ${legY})`}>
        <g transform={`rotate(${legAngleL}, 0, 0)`}>
          <rect x={-9} y={0} width={18} height={legLen} rx={8} fill={pantsColor} />
          <rect x={-9} y={legLen - 8} width={18} height={16} rx={4} fill={pantsColor} />
          {/* Shoe */}
          <ellipse cx={2} cy={legLen + 8} rx={14} ry={8} fill={shoeColor} />
          <ellipse cx={-2} cy={legLen + 6} rx={12} ry={6} fill="#222f3e" />
        </g>
      </g>
      <g transform={`translate(${cx + bodyW * 0.28}, ${legY})`}>
        <g transform={`rotate(${legAngleR}, 0, 0)`}>
          <rect x={-9} y={0} width={18} height={legLen} rx={8} fill={pantsColor} />
          <rect x={-9} y={legLen - 8} width={18} height={16} rx={4} fill={pantsColor} />
          <ellipse cx={-2} cy={legLen + 8} rx={14} ry={8} fill={shoeColor} />
          <ellipse cx={2} cy={legLen + 6} rx={12} ry={6} fill="#222f3e" />
        </g>
      </g>

      {/* ── BODY / SUIT JACKET ── */}
      {/* White shirt base */}
      <rect x={cx - bodyW / 2 + 4} y={bodyY + 4} width={bodyW - 8} height={bodyH - 4} rx={8} fill={shirtColor} />
      {/* Suit jacket */}
      <path
        d={`
          M ${cx - bodyW / 2} ${bodyY + 4}
          Q ${cx - bodyW / 2 - 4} ${bodyY + bodyH / 2} ${cx - bodyW / 2} ${bodyY + bodyH}
          L ${cx - bodyW * 0.12} ${bodyY + bodyH}
          L ${cx - bodyW * 0.12} ${bodyY + 10}
          Z
        `}
        fill={suitColor}
      />
      <path
        d={`
          M ${cx + bodyW / 2} ${bodyY + 4}
          Q ${cx + bodyW / 2 + 4} ${bodyY + bodyH / 2} ${cx + bodyW / 2} ${bodyY + bodyH}
          L ${cx + bodyW * 0.12} ${bodyY + bodyH}
          L ${cx + bodyW * 0.12} ${bodyY + 10}
          Z
        `}
        fill={suitColor}
      />
      {/* Lapels */}
      <path
        d={`M ${cx - bodyW * 0.12} ${bodyY + 8} L ${cx - bodyW / 2 + 2} ${bodyY + 24} L ${cx} ${bodyY + 22} Z`}
        fill={suitColor}
      />
      <path
        d={`M ${cx + bodyW * 0.12} ${bodyY + 8} L ${cx + bodyW / 2 - 2} ${bodyY + 24} L ${cx} ${bodyY + 22} Z`}
        fill={suitColor}
      />
      {/* Teal tie */}
      <path
        d={`
          M ${cx - 5} ${bodyY + 22}
          L ${cx + 5} ${bodyY + 22}
          L ${cx + 8} ${bodyY + bodyH * 0.55}
          L ${cx} ${bodyY + bodyH * 0.72}
          L ${cx - 8} ${bodyY + bodyH * 0.55}
          Z
        `}
        fill={tieColor}
        opacity={0.95}
      />
      {/* Tie knot */}
      <ellipse cx={cx} cy={bodyY + 24} rx={5} ry={4} fill={`${tieColor}cc`} />
      {/* Suit button */}
      <circle cx={cx} cy={bodyY + bodyH * 0.75} r={3} fill={suitColor} />

      {/* ── LEFT ARM ── */}
      <g transform={`translate(${cx - bodyW / 2 + 2}, ${bodyY + 10})`}>
        <g transform={`rotate(${armAngleL}, 0, 0)`}>
          <rect x={-8} y={0} width={16} height={armLen} rx={7} fill={suitColor} />
          {/* Shirt cuff */}
          <rect x={-8} y={armLen - 8} width={16} height={10} rx={4} fill={shirtColor} />
          {/* Hand */}
          <ellipse cx={0} cy={armLen + armExtraL + 7} rx={8} ry={8} fill={skinColor} />
          {/* Thumb */}
          <ellipse cx={-9} cy={armLen + armExtraL + 7} rx={5} ry={4} fill={skinColor}
            transform={`rotate(-20, ${-9}, ${armLen + armExtraL + 7})`} />
          {pose === "thumbsup" && armAngleR < -60 && (
            <g transform={`translate(0, ${armLen + 6})`}>
              {/* Thumbs up hand */}
              <rect x={-7} y={-14} width={14} height={12} rx={4} fill={skinColor} />
              <rect x={-9} y={-4} width={18} height={12} rx={5} fill={skinColor} />
            </g>
          )}
        </g>
      </g>

      {/* ── RIGHT ARM ── */}
      <g transform={`translate(${cx + bodyW / 2 - 2}, ${bodyY + 10})`}>
        <g transform={`rotate(${armAngleR}, 0, 0)`}>
          <rect x={-8} y={0} width={16} height={armLen} rx={7} fill={suitColor} />
          <rect x={-8} y={armLen - 8} width={16} height={10} rx={4} fill={shirtColor} />
          <ellipse cx={0} cy={armLen + 7} rx={8} ry={8} fill={skinColor} />
          <ellipse cx={9} cy={armLen + 7} rx={5} ry={4} fill={skinColor}
            transform={`rotate(20, ${9}, ${armLen + 7})`} />
          {pose === "thumbsup" && (
            <g transform={`translate(0, ${armLen + 4})`}>
              <rect x={-7} y={-16} width={14} height={14} rx={4} fill={skinColor} />
              <rect x={-9} y={-4} width={18} height={12} rx={5} fill={skinColor} />
            </g>
          )}
        </g>
      </g>

      {/* ── HEAD ── */}
      <g transform={`translate(${cx}, ${headY})`}>
        {/* Neck */}
        <rect x={-9} y={headR * 0.8} width={18} height={headR * 0.7} rx={5} fill={skinColor} />
        {/* Shirt collar visible */}
        <path d={`M ${-14} ${headR * 1.1} L ${-6} ${headR * 0.85} L ${0} ${headR * 1.0} L ${6} ${headR * 0.85} L ${14} ${headR * 1.1}`}
          fill="none" stroke={shirtColor} strokeWidth={4} strokeLinecap="round" />

        {/* Head – round, slightly wide */}
        <ellipse cx={0} cy={0} rx={headR * 1.08} ry={headR} fill={skinColor} />

        {/* Ear left */}
        <ellipse cx={-headR * 1.05} cy={headR * 0.1} rx={headR * 0.2} ry={headR * 0.28} fill={skinColor} />
        <ellipse cx={-headR * 1.0} cy={headR * 0.1} rx={headR * 0.12} ry={headR * 0.2} fill="#e8b090" />
        {/* Ear right */}
        <ellipse cx={headR * 1.05} cy={headR * 0.1} rx={headR * 0.2} ry={headR * 0.28} fill={skinColor} />
        <ellipse cx={headR * 1.0} cy={headR * 0.1} rx={headR * 0.12} ry={headR * 0.2} fill="#e8b090" />

        {/* ── HAIR ── short, dark, slightly receding temples */}
        {/* Main hair mass on top */}
        <ellipse cx={0} cy={-headR * 0.72} rx={headR * 1.0} ry={headR * 0.52} fill={hairColor} />
        {/* Hair sides */}
        <ellipse cx={-headR * 0.82} cy={-headR * 0.3} rx={headR * 0.28} ry={headR * 0.45} fill={hairColor} />
        <ellipse cx={headR * 0.82} cy={-headR * 0.3} rx={headR * 0.28} ry={headR * 0.45} fill={hairColor} />
        {/* Hairline – slightly receding at temples */}
        <path
          d={`M ${-headR * 1.0} ${-headR * 0.32}
              Q ${-headR * 0.7} ${-headR * 0.85}
              Q ${-headR * 0.25} ${-headR * 1.05}
              Q ${0} ${-headR * 1.08}
              Q ${headR * 0.25} ${-headR * 1.05}
              Q ${headR * 0.7} ${-headR * 0.85}
              ${headR * 1.0} ${-headR * 0.32}`}
          fill={hairColor}
        />
        {/* Small hair highlight */}
        <path d={`M ${-headR * 0.3} ${-headR * 0.88} Q ${0} ${-headR * 0.98} ${headR * 0.3} ${-headR * 0.88}`}
          fill="none" stroke="#5a3d28" strokeWidth={2} opacity={0.5} />

        {/* ── EYES ── light hazel/green */}
        {/* Eye whites */}
        <ellipse cx={-headR * 0.36} cy={-headR * 0.08} rx={headR * 0.26} ry={headR * 0.2} fill="white" />
        <ellipse cx={headR * 0.36} cy={-headR * 0.08} rx={headR * 0.26} ry={headR * 0.2} fill="white" />
        {/* Irises – green/hazel */}
        <circle cx={-headR * 0.36} cy={-headR * 0.08} r={headR * 0.15} fill="#6b8c5a" />
        <circle cx={headR * 0.36} cy={-headR * 0.08} r={headR * 0.15} fill="#6b8c5a" />
        {/* Pupils */}
        <circle cx={-headR * 0.36} cy={-headR * 0.08} r={headR * 0.09} fill="#1a1a1a" />
        <circle cx={headR * 0.36} cy={-headR * 0.08} r={headR * 0.09} fill="#1a1a1a" />
        {/* Eye shine */}
        <circle cx={-headR * 0.3} cy={-headR * 0.13} r={headR * 0.05} fill="white" opacity={0.9} />
        <circle cx={headR * 0.42} cy={-headR * 0.13} r={headR * 0.05} fill="white" opacity={0.9} />
        {/* Eyelids upper */}
        <path d={`M ${-headR * 0.62} ${-headR * 0.12} Q ${-headR * 0.36} ${-headR * 0.3} ${-headR * 0.1} ${-headR * 0.12}`}
          fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />
        <path d={`M ${headR * 0.1} ${-headR * 0.12} Q ${headR * 0.36} ${-headR * 0.3} ${headR * 0.62} ${-headR * 0.12}`}
          fill="none" stroke="#333" strokeWidth={1.8} strokeLinecap="round" />

        {/* ── EYEBROWS ── medium thickness, slightly arched */}
        <path d={`M ${-headR * 0.64} ${-headR * 0.34} Q ${-headR * 0.36} ${-headR * 0.46} ${-headR * 0.08} ${-headR * 0.36}`}
          fill="none" stroke={hairColor} strokeWidth={3.5} strokeLinecap="round" />
        <path d={`M ${headR * 0.08} ${-headR * 0.36} Q ${headR * 0.36} ${-headR * 0.46} ${headR * 0.64} ${-headR * 0.34}`}
          fill="none" stroke={hairColor} strokeWidth={3.5} strokeLinecap="round" />

        {/* ── NOSE ── subtle, rounded */}
        <path d={`M ${-headR * 0.1} ${headR * 0.1} Q ${0} ${headR * 0.22} ${headR * 0.1} ${headR * 0.1}`}
          fill="none" stroke="#d4956a" strokeWidth={1.8} strokeLinecap="round" />
        <ellipse cx={0} cy={headR * 0.18} rx={headR * 0.08} ry={headR * 0.05} fill="#d4956a" opacity={0.4} />

        {/* ── MOUTH ── friendly smile */}
        <path
          d={`M ${-headR * 0.38} ${headR * 0.38} Q ${0} ${headR * 0.58} ${headR * 0.38} ${headR * 0.38}`}
          fill="none" stroke="#b8674a" strokeWidth={2.8} strokeLinecap="round"
        />
        {/* Upper lip hint */}
        <path d={`M ${-headR * 0.26} ${headR * 0.36} Q ${0} ${headR * 0.3} ${headR * 0.26} ${headR * 0.36}`}
          fill="none" stroke="#d4956a" strokeWidth={1.2} opacity={0.5} />
        {/* Dimple hints */}
        <circle cx={-headR * 0.44} cy={headR * 0.42} r={headR * 0.04} fill="#d4956a" opacity={0.3} />
        <circle cx={headR * 0.44} cy={headR * 0.42} r={headR * 0.04} fill="#d4956a" opacity={0.3} />

        {/* ── CHIN / JAW – slightly rounded, fuller ── */}
        <ellipse cx={0} cy={headR * 0.72} rx={headR * 0.5} ry={headR * 0.22} fill={skinColor} />
      </g>

      {/* "SC" badge on jacket – subtle brand touch */}
      <g transform={`translate(${cx + bodyW * 0.28}, ${bodyY + bodyH * 0.6})`}
        opacity={interpolate(entryP, [0.5, 1], [0, 1], { extrapolateRight: "clamp" })}>
        <circle cx={0} cy={0} r={10} fill={TEAL} opacity={0.9} />
        <text x={0} y={4} textAnchor="middle" fontSize={8} fontWeight="bold" fill={NAVY}
          fontFamily="system-ui, -apple-system, sans-serif">SC</text>
      </g>
    </svg>
  );
};
