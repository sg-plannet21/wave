import { useState } from 'react';
import ReactAudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

type Track = {
  src: string;
  name: string;
};

export type AudioPlayerProps = {
  trackList: Track | Track[];
};

const AudioPlayer: React.FC<AudioPlayerProps> = ({ trackList }) => {
  const [trackNumber, setTrackNumber] = useState(0);
  const multipleTracks = Array.isArray(trackList);

  if (!trackList) return <h1>No audio to play</h1>;

  function handleOnEnded() {
    handleSkipForward();
  }

  function handleSkipForward() {
    if (multipleTracks && trackNumber + 1 < trackList.length) {
      setTrackNumber((prevTrackNumber) => prevTrackNumber + 1);
    }
  }

  function handleSkipBackward() {
    if (multipleTracks && trackNumber > 0) {
      setTrackNumber((prevTrackNumber) => prevTrackNumber - 1);
    }
  }

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h1>{multipleTracks ? trackList[trackNumber].name : trackList.name}</h1>
        {multipleTracks && (
          <p>{`Audio ${trackNumber + 1} of ${trackList.length}`}</p>
        )}
      </div>
      <ReactAudioPlayer
        autoPlay
        src={multipleTracks ? trackList[trackNumber].src : trackList.src}
        showJumpControls={!multipleTracks}
        showSkipControls={multipleTracks}
        loop={false}
        onClickNext={handleSkipForward}
        onClickPrevious={handleSkipBackward}
        onEnded={handleOnEnded}
        onError={(e) => console.log('onError', e)}
        onAbort={(e) => console.log('onAbort', e)}
        onPlayError={(e) => console.log('onPlayError', e)}
        customAdditionalControls={[]}
        // other props here
      />
    </div>
  );
};

export default AudioPlayer;
