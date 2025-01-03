import { useEffect, useRef } from 'react';
import { useGameSettings } from '../../hooks';

interface BackgroundMusicProps {
  volume?: number;
  autoPlay?: boolean;
}

const BackgroundMusic: React.FC<BackgroundMusicProps> = ({
  volume = 0.5,
  autoPlay = true,
}) => {

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { settings } = useGameSettings();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;

      if (settings.isMusicPlaying && autoPlay) {
        audioRef.current.play().catch((error) => {
          console.log('Autoplay prevented:', error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, autoPlay, settings.isMusicPlaying]);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <audio ref={audioRef} src={'/music/bg.mp3'} loop />
    </div>
  );
};

export default BackgroundMusic;
