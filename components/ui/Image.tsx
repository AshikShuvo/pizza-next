import Image from 'next/image';
import { CSSProperties } from 'react';

interface ImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  priority?: boolean;
  quality?: number;
  fill?: boolean;
  sizes?: string;
}

export default function CustomImage({
  src,
  alt,
  width = 300,
  height = 200,
  className = '',
  style,
  priority = false,
  quality = 75,
  fill = false,
  sizes,
}: ImageProps) {
  // If fill is true, use fill layout
  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={className}
        style={style}
        priority={priority}
        quality={quality}
        sizes={sizes}
      />
    );
  }

  // Use explicit dimensions without conflicting className sizing
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      priority={priority}
      quality={quality}
      sizes={sizes}
    />
  );
}
