import FAQ from "./components/FAQ"
import { render } from 'react-dom';
import VideoTut from "./components/videoTut"

const Help: React.FC = () => {
  return (
    <>
      <FAQ></FAQ>
      <VideoTut
        videoUrl="https://youtu.be/dQw4w9WgXcQ"
        posterUrl="https://i.ytimg.com/an_webp/xm3YgoEiEDc/mqdefault_6s.webp?du=3000&sqp=COWT8Z0G&rs=AOn4CLCmFFrJN9OW-OAlQIiWxZO7S9U5LQ"    />
    </>
  );
};


export default Help;
