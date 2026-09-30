import React, { useState } from 'react';
import { ZoroOrb, OrbState } from '../components/orb/ZoroOrb';

export const DashboardPage: React.FC = () => {
  const [orbState, setOrbState] = useState<OrbState>('IDLE');

  const cycleState = () => {
    const states: OrbState[] = ['IDLE', 'LISTENING', 'THINKING', 'EXECUTING', 'SUCCESS', 'ERROR'];
    const currentIndex = states.indexOf(orbState);
    setOrbState(states[(currentIndex + 1) % states.length]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <div className="mb-12 cursor-pointer" onClick={cycleState}>
        <ZoroOrb state={orbState} />
      </div>
      
      <div className="text-center space-y-4 max-w-md">
        <h1 className="font-display text-3xl font-bold text-[#F5F5F7]">Welcome to ZORO</h1>
        <p className="text-[#94949E]">
          Current Orb State: <span className="text-[#C084FC] font-mono">{orbState}</span>
        </p>
        <p className="text-sm text-[#D1D1D6]">
          Click the Orb to cycle through its animation states.
        </p>
      </div>
    </div>
  );
};
