import classNames from 'classnames';
import { Play } from 'components/icons';
import Button from 'components/inputs/button';
import React, { useRef, useState } from 'react';
import ReactAudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { useDisclosure } from 'state/hooks/useDisclosure';
import Dialog, { DialogTitle } from '../dialog';

type Track = {
  src: string;
  name: string;
};

export type AudioPlayerDialogProps = {
  trackList: Track | Track[];
};

const AudioPlayerDialog: React.FC<AudioPlayerDialogProps> = ({ trackList }) => {
  const { isOpen, open, close } = useDisclosure();
  const [trackNumber, setTrackNumber] = useState(0);
  const multipleTracks = Array.isArray(trackList);

  const cancelButtonRef = useRef(null);

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
    <>
      <button
        type="button"
        onClick={open}
        className={classNames(
          'rounded-md border-none outline-2 outline-gray-400 hover:scale-110 duration-200',
          {
            'text-green-500 animate-spin': isOpen,
            'text-indigo-500': !isOpen,
          }
        )}
      >
        <Play className="w-10 h-10" />
      </button>
      <Dialog isOpen={isOpen} onClose={close} initialFocus={cancelButtonRef}>
        <div className="w-full">
          <div className="flex justify-between">
            <DialogTitle
              as="h3"
              className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100"
            >
              {multipleTracks ? trackList[trackNumber].name : trackList.name}
            </DialogTitle>
            {multipleTracks && (
              <p className="text-sm text-gray-500 dark:text-gray-300">{`Audio ${
                trackNumber + 1
              } of ${trackList.length}`}</p>
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
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="inverse"
              className="w-full inline-flex justify-center rounded-md border focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={close}
              ref={cancelButtonRef}
            >
              Close
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default AudioPlayerDialog;
