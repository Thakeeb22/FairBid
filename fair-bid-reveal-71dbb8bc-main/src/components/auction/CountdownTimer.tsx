import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
  days: number;
}

function getTimeLeft(deadline: Date): TimeLeft {
  const diff = Math.max(0, deadline.getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

interface CountdownTimerProps {
  deadline: Date;
  compact?: boolean;
  className?: string;
}

const TimeBlock: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="text-center">
      <div className="card-glass px-3 py-2 min-w-[52px] relative overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={padded}
            initial={{ y: -12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="font-heading text-2xl font-bold text-foreground"
          >
            {padded}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="text-xs text-muted-foreground mt-1 font-body">{label}</div>
    </div>
  );
};

const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, compact = false, className = "" }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft(deadline));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(deadline));
    }, 1000);
    return () => clearInterval(timer);
  }, [deadline]);

  const pad = (n: number) => String(n).padStart(2, "0");

  if (compact) {
    const isUrgent = timeLeft.days === 0 && timeLeft.hours < 2;
    return (
      <motion.span
        className={`font-heading font-semibold ${isUrgent ? "text-destructive" : "text-gold"} ${className}`}
        animate={isUrgent ? { opacity: [1, 0.5, 1] } : {}}
        transition={isUrgent ? { duration: 1.2, repeat: Infinity } : {}}
      >
        {timeLeft.days > 0 ? `${timeLeft.days}d ` : ""}
        {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </motion.span>
    );
  }

  return (
    <div className={`flex gap-3 ${className}`}>
      {timeLeft.days > 0 && <TimeBlock value={timeLeft.days} label="Days" />}
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Mins" />
      <div className="text-center">
        <div className="card-glass px-3 py-2 min-w-[52px] relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={timeLeft.seconds}
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="font-heading text-2xl font-bold text-gold"
            >
              {pad(timeLeft.seconds)}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="text-xs text-muted-foreground mt-1 font-body">Secs</div>
      </div>
    </div>
  );
};

export default CountdownTimer;
