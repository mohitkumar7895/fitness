'use client';

import React, { useEffect, useState, useRef } from 'react';

interface StatCounterProps {
  end: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  label: string;
  sublabel?: string;
}

export function StatCounter({
  end,
  prefix = '',
  suffix = '',
  duration = 2000,
  label,
  sublabel,
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const countRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.2 }
    );

    if (countRef.current) {
      observer.observe(countRef.current);
    }

    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;

    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * end));

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <div ref={countRef} className="text-center md:text-left flex flex-col">
      <div className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight flex items-baseline justify-center md:justify-start">
        {prefix}
        <span>{count.toLocaleString()}</span>
        <span className="text-[#ff5a1f]">{suffix}</span>
      </div>
      <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-wider text-zinc-300">
        {label}
      </p>
      {sublabel && <p className="text-xs text-zinc-500 mt-0.5">{sublabel}</p>}
    </div>
  );
}

