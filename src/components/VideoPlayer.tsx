import React from 'react';

interface VideoPlayerProps {
  src: string;
  width?: string;
  height?: string;
  controls?: boolean;
  autoplay?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  width = "640",
  height = "360",
  controls = false,
  autoplay = true,
}) => {
  return (
    <div>
      <video width={width} height={height} controls={controls} autoPlay={autoplay}>
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
