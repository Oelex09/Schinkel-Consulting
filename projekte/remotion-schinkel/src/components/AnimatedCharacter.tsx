import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { TEAL, NAVY, WHITE } from "../helpers";

type Pose = "falling" | "walking" | "stressed" | "celebrating" | "presenting" | "working-phone";

interface AnimatedCharacterProps {
  pose: Pose;
  startFrame?: number;
  size?: number;
  flip?: boolean;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  pose,
  startFrame = 0,
  size = 220,
  flip = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = Math.max(0, frame - startFrame);
  const s = size;

  // ── FALLING ──
  if (pose === "falling") {
    const fallProgress = spring({ frame: t, fps, config: { damping: 10, stiffness: 80, mass: 1.5 } });
    const fallY = interpolate(fallProgress, [0, 1], [-s * 2, 0]);
    const rot = interpolate(Math.sin((t / fps) * 6 * Math.PI), [-1, 1], [-18, 18]);
    const squish = t > 30 ? interpolate(spring({ frame: t - 30, fps, config: { damping: 8, stiffness: 300 } }), [0, 1], [1.4, 1]) : 1;
    const squishY = t > 30 ? interpolate(spring({ frame: t - 30, fps, config: { damping: 8, stiffness: 300 } }), [0, 1], [0.6, 1]) : 1;

    return (
      <g transform={`translate(0, ${fallY}) rotate(${rot}, ${s / 2}, ${s / 2})`}>
        <FlatPerson s={s} scaleX={squish} scaleY={squishY} armAngleL={-40} armAngleR={40} legAngleL={20} legAngleR={-20} />
      </g>
    );
  }

  // ── WALKING ──
  if (pose === "walking") {
    const cycle = (t / fps) * 2.5 * Math.PI;
    const legSwing = Math.sin(cycle) * 28;
    const armSwing = Math.sin(cycle) * 22;
    const bobY = Math.abs(Math.sin(cycle)) * -4;

    return (
      <g transform={`translate(0, ${bobY})`}>
        <FlatPerson s={s} armAngleL={armSwing} armAngleR={-armSwing} legAngleL={legSwing} legAngleR={-legSwing} />
      </g>
    );
  }

  // ── STRESSED ──
  if (pose === "stressed") {
    const shake = Math.sin((t / fps) * 8 * Math.PI) * 3;
    const handShake = Math.sin((t / fps) * 6 * Math.PI) * 12;

    return (
      <g transform={`translate(${shake}, 0)`}>
        <FlatPerson
          s={s}
          armAngleL={-70 + handShake}
          armAngleR={-70 - handShake}
          legAngleL={0}
          legAngleR={0}
          headTilt={shake * 0.5}
          mouthFrown
          eyebrowAngry
        />
        {/* Stress sparks */}
        {[0, 1, 2].map((i) => {
          const sparkOpacity = interpolate(
            (t + i * 8) % 24,
            [0, 4, 20, 24],
            [0, 1, 1, 0]
          );
          const sparkX = s * 0.5 + (i - 1) * 18 + Math.sin((t / fps) * 4 + i) * 6;
          const sparkY = s * 0.12 - interpolate((t + i * 8) % 24, [0, 24], [0, 22]);
          return (
            <text key={i} x={sparkX} y={sparkY}
              fontSize={14} textAnchor="middle"
              style={{ opacity: sparkOpacity }}>
              💢
            </text>
          );
        })}
      </g>
    );
  }

  // ── CELEBRATING ──
  if (pose === "celebrating") {
    const bounce = Math.abs(Math.sin((t / fps) * 3 * Math.PI)) * -14;
    const armWave = Math.sin((t / fps) * 4 * Math.PI) * 20;

    return (
      <g transform={`translate(0, ${bounce})`}>
        <FlatPerson
          s={s}
          armAngleL={-100 + armWave}
          armAngleR={-100 - armWave}
          legAngleL={10}
          legAngleR={-10}
          happy
        />
        {/* Confetti */}
        {[0, 1, 2, 3, 4].map((i) => {
          const confX = s * 0.2 + i * (s * 0.16) + Math.sin((t / fps) * 2 + i * 1.2) * 12;
          const confY = s * 0.05 - ((t * 0.8 + i * 15) % (s * 0.7));
          const colors = [TEAL, "#f5a623", "#e74c3c", WHITE, "#2ecc71"];
          return (
            <rect key={i} x={confX} y={confY} width={6} height={10} rx={1}
              fill={colors[i]} opacity={0.9}
              transform={`rotate(${(t * 3 + i * 45) % 360}, ${confX + 3}, ${confY + 5})`}
            />
          );
        })}
      </g>
    );
  }

  // ── PRESENTING ──
  if (pose === "presenting") {
    const armUp = interpolate(spring({ frame: t - 8, fps, config: { damping: 12, stiffness: 180 } }), [0, 1], [0, -80]);
    const bob = Math.sin((t / fps) * 1.8 * Math.PI) * 2;

    return (
      <g transform={`translate(0, ${bob})`}>
        <FlatPerson s={s} armAngleL={armUp} armAngleR={15} legAngleL={0} legAngleR={0} />
      </g>
    );
  }

  // ── WORKING PHONE ──
  if (pose === "working-phone") {
    const armHold = -55;
    const bob = Math.sin((t / fps) * 1.5 * Math.PI) * 2;
    const screenGlow = interpolate(Math.sin((t / fps) * 2 * Math.PI), [-1, 1], [0.5, 1]);

    return (
      <g transform={`translate(0, ${bob})`}>
        <FlatPerson s={s} armAngleL={armHold} armAngleR={20} legAngleL={5} legAngleR={-5} />
        {/* Phone in hand */}
        <g transform={`translate(${s * 0.22}, ${s * 0.34}) rotate(-15)`}>
          <rect x={-10} y={-18} width={20} height={32} rx={3} fill="#1a1a2e" />
          <rect x={-7} y={-14} width={14} height={24} rx={1} fill={TEAL} opacity={screenGlow * 0.8} />
          <line x1={-4} y1={-8} x2={4} y2={-8} stroke={WHITE} strokeWidth={1.5} opacity={0.6} />
          <line x1={-4} y1={-3} x2={4} y2={-3} stroke={WHITE} strokeWidth={1.5} opacity={0.4} />
        </g>
      </g>
    );
  }

  return null;
};

// ─────────────────────────────────────────────
// FLAT PERSON – reusable base character
// ─────────────────────────────────────────────
interface FlatPersonProps {
  s: number;
  armAngleL?: number;
  armAngleR?: number;
  legAngleL?: number;
  legAngleR?: number;
  scaleX?: number;
  scaleY?: number;
  headTilt?: number;
  mouthFrown?: boolean;
  eyebrowAngry?: boolean;
  happy?: boolean;
}

const FlatPerson: React.FC<FlatPersonProps> = ({
  s,
  armAngleL = -10,
  armAngleR = 10,
  legAngleL = -5,
  legAngleR = 5,
  scaleX = 1,
  scaleY = 1,
  headTilt = 0,
  mouthFrown = false,
  eyebrowAngry = false,
  happy = false,
}) => {
  const cx = s * 0.5;

  // Color palette – flat design
  const skinColor = "#FDBCB4";
  const hairColor = "#4a3728";
  const shirtColor = "#162d55"; // navy – brand color
  const shirtAccent = TEAL;
  const pantsColor = "#2c3e50";
  const shoeColor = "#1a252f";

  const armLen = s * 0.22;
  const legLen = s * 0.28;
  const bodyH = s * 0.32;
  const bodyW = s * 0.22;
  const headR = s * 0.13;
  const headY = s * 0.18;
  const bodyY = headY + headR + s * 0.02;
  const legY = bodyY + bodyH;

  return (
    <g transform={`scale(${scaleX}, ${scaleY})`} style={{ transformOrigin: `${cx}px ${legY}px` }}>
      {/* ── LEGS ── */}
      <g transform={`translate(${cx - bodyW * 0.3}, ${legY})`}>
        <g transform={`rotate(${legAngleL}, 0, 0)`}>
          <rect x={-8} y={0} width={16} height={legLen} rx={7} fill={pantsColor} />
          <ellipse cx={0} cy={legLen + 5} rx={12} ry={8} fill={shoeColor} />
        </g>
      </g>
      <g transform={`translate(${cx + bodyW * 0.3}, ${legY})`}>
        <g transform={`rotate(${legAngleR}, 0, 0)`}>
          <rect x={-8} y={0} width={16} height={legLen} rx={7} fill={pantsColor} />
          <ellipse cx={0} cy={legLen + 5} rx={12} ry={8} fill={shoeColor} />
        </g>
      </g>

      {/* ── BODY ── */}
      <rect
        x={cx - bodyW / 2}
        y={bodyY}
        width={bodyW}
        height={bodyH}
        rx={10}
        fill={shirtColor}
      />
      {/* Collar accent */}
      <path
        d={`M ${cx - 8} ${bodyY + 4} L ${cx} ${bodyY + 16} L ${cx + 8} ${bodyY + 4}`}
        fill={shirtAccent}
        opacity={0.9}
      />

      {/* ── ARMS ── */}
      <g transform={`translate(${cx - bodyW / 2 + 4}, ${bodyY + 8})`}>
        <g transform={`rotate(${armAngleL}, 0, 0)`}>
          <rect x={-7} y={0} width={14} height={armLen} rx={6} fill={shirtColor} />
          <ellipse cx={0} cy={armLen + 4} rx={7} ry={7} fill={skinColor} />
        </g>
      </g>
      <g transform={`translate(${cx + bodyW / 2 - 4}, ${bodyY + 8})`}>
        <g transform={`rotate(${armAngleR}, 0, 0)`}>
          <rect x={-7} y={0} width={14} height={armLen} rx={6} fill={shirtColor} />
          <ellipse cx={0} cy={armLen + 4} rx={7} ry={7} fill={skinColor} />
        </g>
      </g>

      {/* ── HEAD ── */}
      <g transform={`translate(${cx}, ${headY}) rotate(${headTilt}, 0, 0)`}>
        {/* Neck */}
        <rect x={-6} y={headR - 4} width={12} height={12} rx={4} fill={skinColor} />
        {/* Head */}
        <ellipse cx={0} cy={0} rx={headR} ry={headR * 1.05} fill={skinColor} />
        {/* Hair */}
        <ellipse cx={0} cy={-headR * 0.6} rx={headR * 1.02} ry={headR * 0.65} fill={hairColor} />
        <rect x={-headR * 1.02} y={-headR * 0.6} width={headR * 2.04} height={headR * 0.4} fill={hairColor} />

        {/* Eyes */}
        {happy ? (
          <>
            <path d={`M ${-headR * 0.38} ${-headR * 0.08} Q ${-headR * 0.2} ${-headR * 0.28} ${-headR * 0.02} ${-headR * 0.08}`}
              fill="none" stroke="#333" strokeWidth={2.5} strokeLinecap="round" />
            <path d={`M ${headR * 0.02} ${-headR * 0.08} Q ${headR * 0.2} ${-headR * 0.28} ${headR * 0.38} ${-headR * 0.08}`}
              fill="none" stroke="#333" strokeWidth={2.5} strokeLinecap="round" />
          </>
        ) : (
          <>
            <ellipse cx={-headR * 0.3} cy={-headR * 0.12} rx={headR * 0.18} ry={headR * 0.2} fill="#3d3d3d" />
            <ellipse cx={headR * 0.3} cy={-headR * 0.12} rx={headR * 0.18} ry={headR * 0.2} fill="#3d3d3d" />
            {/* Eye shine */}
            <circle cx={-headR * 0.24} cy={-headR * 0.16} r={headR * 0.06} fill="white" />
            <circle cx={headR * 0.36} cy={-headR * 0.16} r={headR * 0.06} fill="white" />
          </>
        )}

        {/* Eyebrows */}
        {eyebrowAngry ? (
          <>
            <line x1={-headR * 0.48} y1={-headR * 0.38} x2={-headR * 0.12} y2={-headR * 0.28}
              stroke="#333" strokeWidth={3} strokeLinecap="round" />
            <line x1={headR * 0.12} y1={-headR * 0.28} x2={headR * 0.48} y2={-headR * 0.38}
              stroke="#333" strokeWidth={3} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d={`M ${-headR * 0.48} ${-headR * 0.32} Q ${-headR * 0.28} ${-headR * 0.42} ${-headR * 0.1} ${-headR * 0.32}`}
              fill="none" stroke={hairColor} strokeWidth={2.5} strokeLinecap="round" />
            <path d={`M ${headR * 0.1} ${-headR * 0.32} Q ${headR * 0.28} ${-headR * 0.42} ${headR * 0.48} ${-headR * 0.32}`}
              fill="none" stroke={hairColor} strokeWidth={2.5} strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        {mouthFrown ? (
          <path d={`M ${-headR * 0.32} ${headR * 0.28} Q 0 ${headR * 0.16} ${headR * 0.32} ${headR * 0.28}`}
            fill="none" stroke="#c0392b" strokeWidth={2.5} strokeLinecap="round" />
        ) : happy ? (
          <path d={`M ${-headR * 0.38} ${headR * 0.2} Q 0 ${headR * 0.45} ${headR * 0.38} ${headR * 0.2}`}
            fill="none" stroke="#27ae60" strokeWidth={2.5} strokeLinecap="round" />
        ) : (
          <line x1={-headR * 0.25} y1={headR * 0.28} x2={headR * 0.25} y2={headR * 0.28}
            stroke="#666" strokeWidth={2} strokeLinecap="round" />
        )}
      </g>
    </g>
  );
};
