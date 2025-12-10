import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="flex flex-col items-center justify-center text-white mb-8 select-none animate-slide-up">
      <h1 className="text-7xl md:text-9xl font-light tracking-tight drop-shadow-2xl font-[Inter]">
        {formatTime(time)}
      </h1>
      <p className="text-lg md:text-xl font-light opacity-80 mt-2 tracking-wide uppercase">
        {formatDate(time)}
      </p>
    </div>
  );
};

export default Clock;