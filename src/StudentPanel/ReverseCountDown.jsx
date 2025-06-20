import React, { useEffect, useState } from "react";

const ReverseCountdown = ({ to }) => {
  const [remainingTime, setRemainingTime] = useState(getRemainingTime(to));

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime(getRemainingTime(to));
    }, 1000);

    return () => clearInterval(interval); 
  }, [to]);

  if (remainingTime.total <= 0) {
    return (
      <p className="text-sm font-semibold font_primary text-red-600">
        Time is up!
      </p>
    );
  }

  return (
    <p className="text-sm font-semibold font_primary text-primary">
      Time Left: {remainingTime.hours}h {remainingTime.minutes}m{" "}
      {remainingTime.seconds}s
    </p>
  );
};

function getRemainingTime(to) {
  const now = new Date();
  const endTime = new Date(to);
  const total = endTime - now;

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / (1000 * 60 * 60));

  return { total, hours, minutes, seconds };
}

export default ReverseCountdown;
