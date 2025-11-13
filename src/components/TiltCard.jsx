import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

const TiltCard = ({ children, className = '' }) => {
  const ref = useRef(null);
  const prefersReducedMotion = useReducedMotion();
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg']);
  
  const handleMouseMove = (e) => {
    if (prefersReducedMotion) return;
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    if (prefersReducedMotion) return;
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        prefersReducedMotion
          ? undefined
          : {
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }
      }
      className={className}
    >
      <div
        style={
          prefersReducedMotion
            ? undefined
            : { transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }
        }
      >
        {children}
      </div>
    </motion.div>
  );
};

export default TiltCard;

