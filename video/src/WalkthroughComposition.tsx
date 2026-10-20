import React from 'react';
import { staticFile } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { ScreenSlide } from './ScreenSlide';
import screensManifest from '../screens.json';

export const WalkthroughComposition: React.FC = () => {
  const { fps } = screensManifest.videoConfig;

  return (
    <TransitionSeries>
      {screensManifest.screens.map((screen, index) => {
        const durationInFrames = screen.duration * fps;

        const transition =
          screen.transitionType === 'slide'
            ? slide({ direction: 'from-right' })
            : fade();

        return (
          <React.Fragment key={screen.id}>
            <TransitionSeries.Sequence durationInFrames={durationInFrames}>
              <ScreenSlide
                imageSrc={staticFile(screen.imagePath)}
                title={screen.title}
                description={screen.description}
                width={screen.width}
                height={screen.height}
              />
            </TransitionSeries.Sequence>
            {index < screensManifest.screens.length - 1 && (
              <TransitionSeries.Transition
                presentation={transition}
                timing={linearTiming({
                  durationInFrames: 24,
                })}
              />
            )}
          </React.Fragment>
        );
      })}
    </TransitionSeries>
  );
};
