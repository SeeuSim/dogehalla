import * as React from 'react';

interface Props {
  videoUrl: string; // The URL of the video file
  posterUrl?: string; // The URL of an image to show as a placeholder before the video loads (optional)
}

const Video: React.FC<Props> = ({ videoUrl, posterUrl }) => {
  return (
    <video className='display:flex max-w-fit'
    controls src={videoUrl} poster={posterUrl} />
  );
};

export default Video;
