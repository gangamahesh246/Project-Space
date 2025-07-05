import React, { useEffect, useState } from "react";

const ReverseCountdown = ({ dateFrom, dateTo, timeFrom, timeTo }) => {
  const [status, setStatus] = useState("waiting"); 
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const dateFromTime = dateFrom ? new Date(dateFrom) : null;
    const dateToTime = dateTo ? new Date(dateTo) : null;

    if (!dateToTime || isNaN(dateToTime.getTime())) {
      setStatus("disabled");
      return;
    }

    let fromTime = dateFromTime;
    let toTime = dateToTime; 

    if (timeFrom && timeTo) {
      const [fromH, fromM] = timeFrom.split(":").map(Number);
      const [toH, toM] = timeTo.split(":").map(Number);

      const today = new Date();
      fromTime = new Date(today);
      fromTime.setHours(fromH, fromM, 0, 0);

      toTime = new Date(today);
      toTime.setHours(toH, toM, 59, 999);
    }

    const interval = setInterval(() => {
      const now = new Date();

      if (fromTime && now < fromTime) {
        setStatus("waiting");
        return;
      }

      if (now >= fromTime && now <= toTime) {
        setStatus("running");
        setRemainingTime(getRemainingTime(toTime));
      } else {
        setStatus("ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [dateFrom, dateTo, timeFrom, timeTo]);

  if (status === "disabled") return null;

  if (status === "waiting") {
    return (
      <p className="capitalize text-sm font-semibold font_primary text-yellow-600">
         Exam was not active yet!
      </p>
    );
  }

  if (status === "ended" || !remainingTime || remainingTime.total <= 0) {
    return (
      <p className="text-sm font-semibold font_primary text-red-600">
         Time is up! 
      </p>
    );
  }

  return (
    <p className="text-sm font-semibold font_primary text-primary">
      Time Left: {remainingTime.hours}h {remainingTime.minutes}m
      {remainingTime.seconds}s 
    </p>
  );
};

function getRemainingTime(toTime) {
  const now = new Date();
  const total = toTime - now;

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor(total / (1000 * 60 * 60));

  return { total, hours, minutes, seconds };
}

export default ReverseCountdown;
