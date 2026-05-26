import { motion } from 'framer-motion';

// Decorative orbiting rings for subtle depth
const SpotlightRings = () => {
  const rings = [
    { size: 500, top: '10%', left: '5%', color: 'border-primary/20', delay: 0 },
    { size: 400, top: '40%', left: '70%', color: 'border-indigo-500/20', delay: 5 },
  ];

  return (
    <>
      {rings.map((r, i) => (
        <motion.div
          key={i}
          className={`absolute border rounded-full pointer-events-none ${r.color}`}
          style={{
            width: r.size,
            height: r.size,
            top: r.top,
            left: r.left,
          }}
          animate={{ rotate: [0, 360] }}
          transition={{
            repeat: Infinity,
            duration: 60,
            ease: 'linear',
            delay: r.delay,
          }}
        />
      ))}
    </>
  );
};

export default SpotlightRings;
