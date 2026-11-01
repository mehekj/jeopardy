import { useEffect, useState, useRef } from "react";
import "./Timer.css";
import songs from "../songs";

interface TimerProps {
  currentCategoryIndex: number;
  currentClueIndex: number;
  isMuted: boolean;
}

export default function Timer(props: TimerProps) {
  const COUNTDOWN_LENGTH = 30000;
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
      audioRef.current.currentTime = songs[getSongIndex()].start;
      audioRef.current.play();
    }
    setCountdownStarted(true);
    setTimeLeft(COUNTDOWN_LENGTH);
    setStartTime(new Date().getTime());
  }

  function getSongIndex() {
    const cluesPerCategory = 5;
    return (
      (props.currentCategoryIndex * cluesPerCategory + props.currentClueIndex) %
      songs.length
    );
  }

  return (
    <div className="timer">
      <div className="timer-controls">
        <div className="timer-countdown" onClick={startTimer}>
          {countdownStarted
            ? timeLeft === 0
              ? "Time's Up!"
              : Math.round(timeLeft / 1000)
            : "Start Timer"}
        </div>
        <audio
          src={`/audio/${songs[getSongIndex()].name}.mp3`}
          ref={audioRef}
          muted={props.isMuted}
        />
      </div>
    </div>
  );
}
