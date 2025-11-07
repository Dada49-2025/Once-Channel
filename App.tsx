
import React, { useState, useEffect, useCallback } from 'react';

interface TimeLeft {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

interface Snowflake {
  id: number;
  className: string;
}

const calculateTimeLeft = (): TimeLeft => {
  const now = new Date();
  const currentYear = now.getFullYear();
  let christmasDate = new Date(currentYear, 11, 25); // Month is 0-indexed (11 is December)

  if (now.getTime() > christmasDate.getTime()) {
    christmasDate = new Date(currentYear + 1, 11, 25);
  }

  const difference = christmasDate.getTime() - now.getTime();

  if (difference <= 0) {
    return {};
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / (1000 * 60)) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const TimeDisplay = ({ value, label }: { value: number; label: string }) => (
  <div className="flex flex-col items-center mx-2 sm:mx-4">
    <span className="text-4xl sm:text-6xl lg:text-7xl font-sans font-bold tracking-tighter">
      {String(value).padStart(2, '0')}
    </span>
    <span className="text-sm sm:text-base font-christmas uppercase tracking-widest">{label}</span>
  </div>
);

const App: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addSnowflake = useCallback(() => {
    const id = Date.now() + Math.random();
    const left = `left-[${Math.random() * 100}vw]`;
    const duration = `duration-[${Math.random() * 5 + 5}s]`;
    const delay = `delay-[${Math.random() * 5}s]`;
    const size = `text-[${Math.random() * 15 + 10}px]`;
    const animation = 'animate-fall';
    
    const newSnowflake: Snowflake = {
      id,
      className: `absolute text-white pointer-events-none ${left} ${duration} ${delay} ${size} ${animation}`
    };

    setSnowflakes(prev => [...prev, newSnowflake]);

    setTimeout(() => {
      setSnowflakes(prev => prev.filter(s => s.id !== id));
    }, 10000); // Corresponds to max duration + delay
  }, []);

  useEffect(() => {
    const snowflakeInterval = setInterval(addSnowflake, 300);
    return () => clearInterval(snowflakeInterval);
  }, [addSnowflake]);


  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  const isChristmas = Object.keys(timeLeft).length === 0;

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-700 via-red-800 to-green-800 text-white p-4 overflow-hidden">
      {snowflakes.map(flake => (
        <div key={flake.id} className={flake.className}>
          ❄
        </div>
      ))}
      
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <header className="mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-christmas drop-shadow-lg">
            Greetings from ONCE CHANNEL
          </h1>
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-christmas mt-2 drop-shadow-xl">
            🎅 Christmas Countdown 🎄
          </h2>
          <p className="text-lg md:text-xl mb-8 drop-shadow-md">
              The most wonderful time of the year is coming!
            </p>
        </header>

        {isChristmas ? (
          <div className="bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-2xl">
            <h3 className="text-5xl md:text-7xl font-christmas animate-pulse">Merry Christmas! 🎁</h3>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl">
            <div className="flex justify-center">
              {timeUnits.map(unit =>
                unit.value !== undefined ? (
                  <TimeDisplay key={unit.label} value={unit.value} label={unit.label} />
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default App;
