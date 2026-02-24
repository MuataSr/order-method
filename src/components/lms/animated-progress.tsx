'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface AnimatedProgressProps {
  value: number;
  className?: string;
  showLabel?: boolean;
  label?: string;
}

export function AnimatedProgress({ 
  value, 
  className, 
  showLabel = false,
  label,
}: AnimatedProgressProps) {
  return (
    <div className="space-y-1">
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{label || 'Progress'}</span>
          <motion.span
            key={value}
            initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
            animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
            className="font-medium tabular-nums"
          >
            {Math.round(value)}%
          </motion.span>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Progress value={value} className={className} />
      </motion.div>
    </div>
  );
}

interface AnimatedNumberProps {
  value: number;
  duration?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  duration = 500,
  formatValue = (v) => v.toString(),
  className 
}: AnimatedNumberProps) {
  const spring = useSpring(value, { duration: duration / 1000 });
  const display = useTransform(spring, formatValue);
  const [renderValue, setRenderValue] = useState(formatValue(value));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  useEffect(() => {
    const unsubscribe = display.on('change', (v) => setRenderValue(v));
    return unsubscribe;
  }, [display]);

  return (
    <motion.span 
      className={className}
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {renderValue}
    </motion.span>
  );
}

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showValue?: boolean;
}

export function CircularProgress({
  value,
  size = 48,
  strokeWidth = 4,
  className,
  showValue = true,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      {showValue && (
        <motion.span 
          className="absolute text-xs font-bold tabular-nums"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {Math.round(value)}%
        </motion.span>
      )}
    </div>
  );
}
