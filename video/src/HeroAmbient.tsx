import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  OffthreadVideo,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Deterministic particles that loop seamlessly
const PARTICLES = Array.from({ length: 24 }).map((_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const x = (seed % 1000) / 10;
  const y = ((seed * 7) % 1000) / 10;
  const size = 2 + (i % 4) * 1.5;
  const speed = 1 + (i % 3);
  const opacity = 0.2 + (i % 5) * 0.12;
  return { id: i, x, y, size, speed, opacity };
});

export const HeroAmbient: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Progress from 0 to 1
  const progress = frame / durationInFrames;
  const loopAngle = 2 * Math.PI * progress;

  // Seamless periodic camera motion (cos/sin so frame 0 === frame durationInFrames)
  const scale = 1.02 + 0.04 * (0.5 - 0.5 * Math.cos(loopAngle));
  const panX = 12 * Math.sin(loopAngle);
  const panY = 6 * (0.5 - 0.5 * Math.cos(loopAngle));

  // Seamless crossfade transition for the base video loop
  // Crossfade duration: 36 frames (~1.5s at 24fps)
  const crossfadeFrames = 36;
  const crossfadeStart = durationInFrames - crossfadeFrames;
  
  // Opacity of the looped start segment
  const loopOverlayOpacity = interpolate(
    frame,
    [crossfadeStart, durationInFrames],
    [0, 1],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  // Ice cyan LED pulse (#c6f7ff) breathing effect
  const cyanPulse = 0.14 + 0.06 * Math.sin(loopAngle);
  const sunlightGlow = 0.12 + 0.04 * Math.cos(loopAngle);

  return (
    <AbsoluteFill style={{ backgroundColor: '#071422', overflow: 'hidden' }}>
      {/* 1. Main Background Video with slow gimbal transform */}
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          transform: `scale(${scale}) translate(${panX}px, ${panY}px)`,
          transformOrigin: 'center center',
          filter: 'contrast(1.05) saturate(1.1)',
        }}
      >
        {/* Primary video playback */}
        <OffthreadVideo
          src={staticFile('videos/ero.mp4')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          startFrom={0}
          endAt={durationInFrames}
        />

        {/* Seamless Loop Crossfade layer: fades in the beginning of video during the tail */}
        {frame >= crossfadeStart && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: loopOverlayOpacity,
            }}
          >
            <OffthreadVideo
              src={staticFile('videos/ero.mp4')}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              startFrom={0}
              endAt={crossfadeFrames}
            />
          </div>
        )}
      </div>

      {/* 2. Ice Cyan (#c6f7ff) Ambient Architectural Backlighting */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 65% 35%, rgba(198, 247, 255, ${cyanPulse}) 0%, rgba(198, 247, 255, 0.03) 50%, transparent 75%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* 3. Warm African Morning Sunlight Bloom */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60%',
          height: '60%',
          background: `radial-gradient(circle at 80% 20%, rgba(255, 245, 220, ${sunlightGlow}) 0%, transparent 70%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />

      {/* 4. Floating Luminous Dust Particles in Sunlight (Seamlessly Periodic) */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {PARTICLES.map((p) => {
          // Calculate periodic particle position
          const currentY = (p.y + progress * p.speed * 20) % 100;
          const sway = Math.sin(loopAngle * p.speed + p.id) * 1.5;
          const currentX = (p.x + sway + 100) % 100;
          
          // Smooth fade at top and bottom bounds
          const fadeY = Math.sin((currentY / 100) * Math.PI);
          const particleAlpha = p.opacity * fadeY;

          return (
            <div
              key={p.id}
              style={{
                position: 'absolute',
                left: `${currentX}%`,
                top: `${currentY}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                borderRadius: '50%',
                backgroundColor: '#c6f7ff',
                boxShadow: `0 0 ${p.size * 2}px rgba(198, 247, 255, 0.8)`,
                opacity: particleAlpha,
              }}
            />
          );
        })}
      </div>

      {/* 5. Readability & Contrast Gradient (Protects Hero Text & Navigation) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to top, rgba(7, 20, 34, 0.55) 0%, rgba(7, 20, 34, 0.15) 50%, rgba(7, 20, 34, 0.35) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 6. Subtle Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 100px rgba(7, 20, 34, 0.5)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
