import { motion } from 'framer-motion';

const Orbs = () => {
  const orbs = [
    { size: 160, top: '15%', left: '-5%', color: 'var(--primary)', opacity: 0.12, delay: 0, duration: 18 },
    { size: 220, top: '55%', left: '75%', color: '#8b5cf6', opacity: 0.08, delay: 3, duration: 22 },
    { size: 120, top: '75%', left: '25%', color: '#06b6d4', opacity: 0.1, delay: 6, duration: 20 },
    { size: 90, top: '30%', left: '50%', color: '#ec4899', opacity: 0.06, delay: 9, duration: 24 },
  ];

  return (
    <>
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none z-0"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: 'blur(40px)',
            opacity: orb.opacity,
          }}
          animate={{
            y: [0, -30, 15, 0],
            x: [0, 15, -10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: orb.delay,
          }}
        />
      ))}
    </>
  );
};

export default Orbs;
