import React from 'react';
import { Composition } from 'remotion';
import { HeroAmbient } from './HeroAmbient';
import { WalkthroughComposition } from './WalkthroughComposition';
import screensManifest from '../screens.json';

// Calculate total duration in frames for TransitionSeries
const calculateWalkthroughDuration = () => {
  const { fps } = screensManifest.videoConfig;
  const totalScreenFrames = screensManifest.screens.reduce(
    (sum, screen) => sum + screen.duration * fps,
    0
  );
  const transitionOverlap = (screensManifest.screens.length - 1) * 24;
  return totalScreenFrames - transitionOverlap;
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* 1. Hero Ambient Background Loop: 1920x1080 @ 24fps, 8s (192 frames) */}
      <Composition
        id="HeroAmbient"
        component={HeroAmbient}
        durationInFrames={192}
        fps={24}
        width={1920}
        height={1080}
      />

      {/* 2. Stitch Screens Walkthrough: 1920x1080 @ 30fps */}
      <Composition
        id="WalkthroughComposition"
        component={WalkthroughComposition}
        durationInFrames={calculateWalkthroughDuration()}
        fps={screensManifest.videoConfig.fps}
        width={screensManifest.videoConfig.width}
        height={screensManifest.videoConfig.height}
      />
    </>
  );
};
