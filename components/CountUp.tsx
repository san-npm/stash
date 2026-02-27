'use client';

import { useEffect, useState } from 'react';

interface CountUpProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  className?: string;
  children?: (value: number) => React.ReactNode;
}

export function CountUp({
  end,
  start = 0,
  duration = 1500,
  decimals = 2,
  className,
  children,
}: CountUpProps) {
  const [current, setCurrent] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate once when the component mounts
    if (hasAnimated) {
      setCurrent(end);
      return;
    }

    setHasAnimated(true);
    
    const startTime = Date.now();
    const difference = end - start;

    const updateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = start + difference * easeOut;
      
      setCurrent(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(updateValue);
      } else {
        setCurrent(end);
      }
    };

    requestAnimationFrame(updateValue);
  }, [end, start, duration, hasAnimated]);

  const displayValue = parseFloat(current.toFixed(decimals));

  if (children) {
    return <>{children(displayValue)}</>;
  }

  return <span className={className}>{displayValue.toFixed(decimals)}</span>;
}