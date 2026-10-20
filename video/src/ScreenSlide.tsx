import React from 'react';
import { AbsoluteFill, Img, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface ScreenSlideProps {
  imageSrc: string;
  title: string;
  description?: string;
  width?: number;
  height?: number;
}

export const ScreenSlide: React.FC<ScreenSlideProps> = ({
  imageSrc,
  title,
  description,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Subtle natural zoom in
  const zoom = spring({
    frame,
    fps,
    from: 0.98,
    to: 1.03,
    config: {
      damping: 18,
      stiffness: 60,
    },
  });

  // Smooth fade in
  const opacity = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 12,
    },
  });

  // Text overlay fade in (delayed by 12 frames)
  const textOpacity = spring({
    frame: frame - 12,
    fps,
    from: 0,
    to: 1,
    config: {
      damping: 12,
    },
  });

  const textY = spring({
    frame: frame - 12,
    fps,
    from: 20,
    to: 0,
    config: {
      damping: 12,
    },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#071422',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* Background blurred ambiance */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(35px) brightness(0.35)',
          transform: 'scale(1.1)',
        }}
      />

      {/* Ambient Ice Cyan bloom */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(198, 247, 255, 0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Main Screen Card */}
      <div
        style={{
          transform: `scale(${zoom})`,
          opacity,
          maxWidth: '85%',
          maxHeight: '75%',
          position: 'relative',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(198, 247, 255, 0.25)',
        }}
      >
        <Img
          src={imageSrc}
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            objectFit: 'contain',
            maxHeight: '70vh',
          }}
        />
      </div>

      {/* Text Overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: '6%',
          left: '50%',
          transform: `translate(-50%, ${textY}px)`,
          textAlign: 'center',
          opacity: textOpacity,
          width: '80%',
          maxWidth: '900px',
          padding: '16px 28px',
          borderRadius: '9999px',
          background: 'rgba(7, 20, 34, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(198, 247, 255, 0.3)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#ffffff',
            margin: '0 0 6px 0',
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h2>
        {description && (
          <p
            style={{
              fontSize: '16px',
              color: '#c6f7ff',
              margin: 0,
              fontWeight: '400',
            }}
          >
            {description}
          </p>
        )}
      </div>
    </AbsoluteFill>
  );
};
