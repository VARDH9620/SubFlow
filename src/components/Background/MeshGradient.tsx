import { motion } from 'framer-motion';

const MeshGradient = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Primary gradient blob */}
      <motion.div
        className="absolute -top-[30%] -left-[20%] w-[70%] h-[70%] rounded-full opacity-25 dark:opacity-[0.08]"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Secondary gradient blob */}
      <motion.div
        className="absolute top-[40%] -right-[15%] w-[55%] h-[55%] rounded-full opacity-20 dark:opacity-[0.06]"
        style={{
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 25, -15, 0],
          scale: [1, 0.95, 1.05, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />
      {/* Accent blob */}
      <motion.div
        className="absolute -bottom-[20%] left-[30%] w-[45%] h-[45%] rounded-full opacity-15 dark:opacity-[0.05]"
        style={{
          background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -15, 20, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
      />
    </div>
  );
};

export default MeshGradient;
