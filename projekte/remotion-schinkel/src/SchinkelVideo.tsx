import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { Scene01Hook } from "./scenes/Scene01Hook";
import { Scene02Agitate } from "./scenes/Scene02Agitate";
import { Scene03SocialProof } from "./scenes/Scene03SocialProof";
import { Scene04WhoAmI } from "./scenes/Scene04WhoAmI";
import { Scene05WhatWeDo } from "./scenes/Scene05WhatWeDo";
import { Scene06Results } from "./scenes/Scene06Results";
import { Scene07CTA } from "./scenes/Scene07CTA";

/**
 * Set to true after running: npm run voiceover
 * This enables audio playback in the preview and final render.
 */
const VOICEOVER_ENABLED = true;

/** Frame counts per scene at 30 fps */
const SCENE_DURATIONS = {
  hook: 150,        // 5s  — "Handwerker die heute..."
  agitate: 180,     // 6s  — "Im Büro verlierst du..."
  socialProof: 150, // 5s  — "40% weniger Büroaufwand"
  whoAmI: 210,      // 7s  — "Hi, ich bin Alexander..."
  whatWeDo: 240,    // 8s  — "Was wir automatisieren"
  results: 210,     // 7s  — "Was du konkret gewinnst"
  cta: 180,         // 6s  — "Jetzt Erstgespräch sichern"
};

/** Transition durations in frames */
const T = 20;

export const SchinkelVideo: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#0d1f3c" }}>
      <TransitionSeries>
        {/* ── Scene 1: Hook ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.hook} premountFor={30}>
          <Scene01Hook />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-01.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 2: Agitate ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.agitate} premountFor={30}>
          <Scene02Agitate />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-02.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 3: Social Proof / Stats ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.socialProof} premountFor={30}>
          <Scene03SocialProof />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-03.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 4: Who Am I ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whoAmI} premountFor={30}>
          <Scene04WhoAmI />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-04.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 5: What We Do ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.whatWeDo} premountFor={30}>
          <Scene05WhatWeDo />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-05.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-bottom" })}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 6: Results ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.results} premountFor={30}>
          <Scene06Results />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-06.mp3")} />
          )}
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: T })}
        />

        {/* ── Scene 7: CTA ── */}
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta} premountFor={30}>
          <Scene07CTA />
          {VOICEOVER_ENABLED && (
            <Audio src={staticFile("voiceover/scene-07.mp3")} />
          )}
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
