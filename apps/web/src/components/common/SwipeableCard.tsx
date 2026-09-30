import React from 'react';
import { motion, useAnimation, PanInfo } from 'framer-motion';

interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeComplete: () => void;
  swipeThreshold?: number;
}

export const SwipeableCard: React.FC<SwipeableCardProps> = ({ 
  children, 
  onSwipeComplete,
  swipeThreshold = 100 
}) => {
  const controls = useAnimation();

  const handleDragEnd = async (_: any, info: PanInfo) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > swipeThreshold || velocity > 500) {
      await controls.start({ x: '100%', opacity: 0, transition: { duration: 0.2 } });
      onSwipeComplete();
    } else {
      controls.start({ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 25 } });
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Background showing completion intention (could be colored green with a checkmark) */}
      <div className="absolute inset-0 bg-emerald-500/20 rounded-xl flex items-center px-6">
        <span className="text-emerald-500 font-medium">Complete</span>
      </div>
      
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 1 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="w-full relative z-10 bg-[#0F0F12] touch-pan-y rounded-xl shadow-lg"
      >
        {children}
      </motion.div>
    </div>
  );
};
