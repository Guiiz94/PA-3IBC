import { useEffect, useState } from 'react';

const CountdownTimer = ({ readyTime }) => {
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const calculateRemainingTime = () => {
      const currentTime = Math.floor(Date.now() / 1000);
      const difference = (readyTime - currentTime) * 1000;
      console.log(difference);
      setRemainingTime(difference);
    };

    const interval = setInterval(calculateRemainingTime, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [readyTime]);

  const formatTime = (time) => {
    if(time <= 0)return "Auction ended !"
    const seconds = Math.floor((time / 1000) % 60);
    const s_seconds = seconds > 0 ? `${seconds.toString().padStart(2,'0')}s` : ""
    const minutes = Math.floor((time / 1000 / 60) % 60);
    const s_minutes = minutes > 0 ? `${minutes.toString().padStart(2,'0')}m` : ""
    const hours = Math.floor((time / 1000 / 60 / 60) % 24);
    const s_hours = hours > 0 ? `${hours.toString().padStart(2,'0')}h` : ""
    const days = Math.floor(time / 1000 / 60 / 60 / 24);
    const s_days = days > 0 ? `${days.toString().padStart(2,'0')}d` : ""

    return `Countdown : ${s_days} ${s_hours} ${s_minutes} ${s_seconds}`;
  };

  return (
    <div>
      {formatTime(remainingTime)}
    </div>
  );
};

export default CountdownTimer;
