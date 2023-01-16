import Image from "next/image";
import { useState } from "react";
import { blurImageURL } from "utils/images/imageProps";

const ImageWithFallback: React.FC<{
  style: string
  src: string
  size: number | string,
  height: number
  width: number
}> = ({ src, size, height, width, style }) => {
  const [imageError, setImageError] = useState(false);
  return (
    <Image 
      className={`object-cover ${style}`}
      src={imageError? "/collection_fallback.webp": src} 
      alt={""}
      sizes={`${size}`} 
      fill={true}
      placeholder="blur"
      blurDataURL={blurImageURL(`${height}`, `${width}`)}
      onError={() => setImageError(true)}
    />
  )
}

export default ImageWithFallback;