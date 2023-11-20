import { useState } from 'react';
import "./Player.css"

interface PlayerProps {
  showMenu: boolean;
  togglePlayer: (show: boolean) => void;
}

function Player(props: PlayerProps) {
  const [playingAudio, setPlayingAudio] = useState<HTMLAudioElement | null>(null);

  const songs = [
    "Boku Wa Doctor.mp3",
    "Drums of Liberation.mp3",
    "Memories.mp3",
    "Overtaken.mp3",
    "Sunflower but it's Tony Tony Chopper.mp3",
    "We Are! but it's Obama.mp3",
    "We Are!.mp3",
    "We Go!.mp3",
    "What You See Is What You Get.mp3",
  ].sort();

  const handlePlay = (audioEl: HTMLAudioElement) => {
    if (playingAudio && playingAudio !== audioEl) {
      playingAudio.pause();
    }
    setPlayingAudio(audioEl);
  };

  return (
    <div className="player" onClick={ () => props.togglePlayer(!props.showMenu) }>
      { props.showMenu && 
        <div className="player-menu">
          <h3>Select a song:</h3>
          { songs.map((song, index) => {
            return (
              <div className="player-menu-child" key={index}>
                <label htmlFor={song}>{song.split(".mp3")[0]}</label>
                <audio
                  controls 
                  id={song} 
                  loop
                  onPlay={(e) => handlePlay(e.currentTarget)}
                >
                  <source src={`/sounds/${song}`} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )
          })}
        </div> 
      }
      { !props.showMenu && 
        <h1 style={{ margin: 0, padding: "20px", lineHeight: 0 }}>
          <span className="material-symbols-outlined note">
            music_note
          </span>
        </h1> 
      }
    </div>
  );
}

export default Player;
