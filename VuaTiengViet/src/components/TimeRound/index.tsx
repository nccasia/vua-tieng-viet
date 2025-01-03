import { useEffect, useState } from 'react';

interface Prop {
  time: number;
}
const TimeRound = ({ time }: Prop) => {
  const [currentTime, setCurrentTime] = useState(time);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [time]);
  return (
    <div className="text-3xl font-bold text-emerald-400">{currentTime}</div>
  );
};

export default TimeRound;
