import type { ReactNode } from 'react';
import MeshGradient from './MeshGradient';
import Orbs from './Orbs';
import ParticleCanvas from './ParticleCanvas';
import CyberGrid from './CyberGrid';
import LightStreaks from './LightStreaks';
import NoiseOverlay from './NoiseOverlay';

interface GlobalBackgroundProps {
  children: ReactNode;
  /** Control intensity: 'full' for landing, 'subtle' for dashboards, 'minimal' for auth */
  intensity?: 'full' | 'subtle' | 'minimal';
}

export default function GlobalBackground({ children, intensity = 'subtle' }: GlobalBackgroundProps) {
  const showFull = intensity === 'full';
  const showSubtle = intensity !== 'minimal';

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Always show the grid and noise */}
      <CyberGrid />
      <NoiseOverlay />

      {/* Mesh gradient & orbs for full and subtle */}
      {showSubtle && <MeshGradient />}
      {showSubtle && <Orbs />}

      {/* Particles and streaks only for full */}
      {showFull && <ParticleCanvas />}
      {showFull && <LightStreaks />}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
