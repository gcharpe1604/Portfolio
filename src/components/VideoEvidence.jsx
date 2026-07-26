import { useMediaQuery } from "../hooks/useMediaQuery";

export function VideoEvidence({ video }) {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  return (
    <figure className="video-evidence">
      {reducedMotion ? (
        <img
          src={video.poster}
          width={video.width}
          height={video.height}
          alt={video.description}
          loading="lazy"
        />
      ) : (
        <video
          controls
          preload="metadata"
          poster={video.poster}
          width={video.width}
          height={video.height}
          aria-label="Music Blocks connection feedback demonstration"
        >
          <source src={video.src} type="video/mp4" />
          {video.description}
        </video>
      )}
      <figcaption>{video.description}</figcaption>
    </figure>
  );
}
