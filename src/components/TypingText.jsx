import { useState, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';

const TypingText = ({ text, speed = 100, delay = 0, className = '' }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayedText(text);
      setCurrentIndex(text.length);
      setIsStarted(true);
      return undefined;
    }

    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [delay, prefersReducedMotion, text]);

  useEffect(() => {
    if (!isStarted || prefersReducedMotion) return;

    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, isStarted, prefersReducedMotion]);

  return (
    <span className={className}>
      {displayedText}
      {!prefersReducedMotion && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default TypingText;

