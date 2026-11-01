import { useEffect, useRef, useState } from "react";
import "./Timer.css";

interface FinalTimerProps {
  isMuted: boolean;
}

export default function FinalTimer({ isMuted }: FinalTimerProps) {
  const COUNTDOWN_LENGTH = 90000;
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [startTime, setStartTime] = useState(-1);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_LENGTH);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (countdownStarted && startTime > 0) {
      const countdownInterval = setInterval(() => {
        const currentTime = Date.now();
        let remainingTime = startTime + COUNTDOWN_LENGTH - currentTime;
        if (remainingTime <= 0) {
          audioRef.current?.pause();
          remainingTime = 0;
          clearInterval(countdownInterval);
        }

        setTimeLeft(remainingTime);
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [countdownStarted, startTime]);

  function startTimer() {
    if (countdownStarted) {
      setCountdownStarted(false);
      setStartTime(-1);
      setTimeLeft(COUNTDOWN_LENGTH);
      audioRef.current?.pause();
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 20;
      audioRef.current.play();
    }
    setCountdownStarted(true);
    setTimeLeft(COUNTDOWN_LENGTH);
    setStartTime(new Date().getTime());
  }

  return (
    <div className="timer">
      <div className="timer-controls">
        <div
          className="timer-countdown"
          onClick={(event) => {
            startTimer();
            event.stopPropagation();
          }}
        >
          {countdownStarted
            ? timeLeft === 0
              ? "Time's Up!"
              : Math.round(timeLeft / 1000)
            : "Start Timer"}
        </div>
        <audio src="/audio/jai_ho.mp3" ref={audioRef} muted={isMuted} />
      </div>
    </div>
  );
}
