import { motion } from 'framer-motion';

const LightStreaks = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Streak 1 - diagonal */}
      <motion.div
        className="absolute w-[1px] h-[300px] opacity-[0.04] dark:opacity-[0.03]"
        style={{
          background: 'linear-gradient(to bottom, transparent, var(--primary), transparent)',
          top: '10%',
          left: '25%',
          transform: 'rotate(25deg)',
        }}
        animate={{ y: [-100, 400], opacity: [0, 0.06, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
      />
      {/* Streak 2 */}
      <motion.div
        className="absolute w-[1px] h-[250px] opacity-[0.03] dark:opacity-[0.02]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #8b5cf6, transparent)',
          top: '20%',
          left: '65%',
          transform: 'rotate(-20deg)',
        }}
        animate={{ y: [-80, 350], opacity: [0, 0.05, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
      {/* Streak 3 */}
      <motion.div
        className="absolute w-[1px] h-[200px] opacity-[0.03] dark:opacity-[0.02]"
        style={{
          background: 'linear-gradient(to bottom, transparent, #06b6d4, transparent)',
          top: '40%',
          left: '45%',
          transform: 'rotate(15deg)',
        }}
        animate={{ y: [-60, 300], opacity: [0, 0.04, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
      />
    </div>
  );
};

export default LightStreaks;
