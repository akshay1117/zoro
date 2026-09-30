import React from 'react';
import { motion, Variants } from 'framer-motion';

export type OrbState = 'IDLE' | 'LISTENING' | 'THINKING' | 'EXECUTING' | 'SUCCESS' | 'ERROR';

interface ZoroOrbProps {
  state?: OrbState;
  className?: string;
}

const stateConfig = {
  IDLE: {
    scale: 1,
    opacity: 0.85,
    glow: '0px 0px 32px rgba(139, 92, 246, 0.15)', // primary
    borderColor: 'rgba(139, 92, 246, 0.3)',
    rotateDuration: 60,
    rotateDirection: 1,
  },
  LISTENING: {
    scale: 1.06,
    opacity: 1,
    glow: '0px 0px 40px rgba(168, 85, 247, 0.40)', // violet-secondary
    borderColor: 'rgba(168, 85, 247, 0.8)',
    rotateDuration: 0,
    rotateDirection: 0,
  },
  THINKING: {
    scale: 1.03,
    opacity: 0.95,
    glow: '0px 0px 36px rgba(139, 92, 246, 0.30)', 
    borderColor: 'rgba(139, 92, 246, 0.6)',
    rotateDuration: 3,
    rotateDirection: -1,
  },
  EXECUTING: {
    scale: 1.08,
    opacity: 1,
    glow: '0px 0px 20px rgba(192, 132, 252, 0.60)', // violet-soft
    borderColor: 'rgba(192, 132, 252, 1)',
    rotateDuration: 1.2,
    rotateDirection: 1,
  },
  SUCCESS: {
    scale: 1.0,
    opacity: 1,
    glow: '0px 0px 20px rgba(34, 197, 94, 0.35)', // accent-success
    borderColor: 'rgba(34, 197, 94, 0.8)',
    rotateDuration: 0,
    rotateDirection: 0,
  },
  ERROR: {
    scale: 0.98,
    opacity: 1,
    glow: '0px 0px 20px rgba(239, 68, 68, 0.35)', // accent-danger
    borderColor: 'rgba(239, 68, 68, 0.8)',
    rotateDuration: 0,
    rotateDirection: -1,
  }
};

export const ZoroOrb: React.FC<ZoroOrbProps> = ({ state = 'IDLE', className = '' }) => {
  const config = stateConfig[state];

  // For ERROR shake effect
  const xShake = state === 'ERROR' ? [0, -4, 4, -4, 4, 0] : 0;
  
  // For SUCCESS effect (expands slightly before settling)
  const successScale = state === 'SUCCESS' ? [1.12, 1.0] : config.scale;

  const containerVariants: Variants = {
    animate: {
      scale: successScale,
      opacity: config.opacity,
      x: xShake,
      transition: {
        scale: { type: 'spring', stiffness: 400, damping: 28 },
        x: { duration: 0.25 },
        opacity: { duration: 0.8 }
      }
    }
  };

  const outerRingVariants: Variants = {
    animate: {
      rotate: config.rotateDuration > 0 ? (config.rotateDirection > 0 ? 360 : -360) : 0,
      transition: {
        rotate: {
          duration: config.rotateDuration || 0,
          ease: 'linear',
          repeat: config.rotateDuration > 0 ? Infinity : 0,
        }
      }
    }
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center ${className}`}
      style={{
        width: 'var(--orb-size-outer, 260px)',
        height: 'var(--orb-size-outer, 260px)',
      }}
      variants={containerVariants}
      animate="animate"
      initial="animate"
    >
      {/* Outer Ring */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 260 260"
        variants={outerRingVariants}
        animate="animate"
        style={{ filter: `drop-shadow(${config.glow})` }}
      >
        <circle
          cx="130"
          cy="130"
          r="128"
          fill="none"
          stroke={config.borderColor}
          strokeWidth="1"
          strokeDasharray="40 20 60 10"
          className="transition-colors duration-800"
        />
      </motion.svg>

      {/* Inner Core */}
      <div 
        className="absolute rounded-full flex items-center justify-center overflow-hidden transition-colors duration-800"
        style={{
          width: 'calc(var(--orb-size-outer, 260px) * 0.69)',
          height: 'calc(var(--orb-size-outer, 260px) * 0.69)',
          background: 'radial-gradient(circle, rgba(15,15,18,0.4) 0%, rgba(8,8,10,0.8) 100%)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(36, 36, 42, 0.5)'
        }}
      >
        {/* Wordmark */}
        <div 
          className="font-display font-extrabold tracking-[0.35em] uppercase"
          style={{
            fontSize: 'calc(var(--orb-size-outer, 260px) * 0.18)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #C084FC 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginLeft: '0.35em' // compensate for tracking on last letter to keep it centered
          }}
        >
          Zoro
        </div>
      </div>
    </motion.div>
  );
};
