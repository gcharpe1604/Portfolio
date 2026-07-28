export function ResponsiveImage({
  asset,
  className = "",
  loading = "lazy",
  fetchPriority,
  sizes = "(max-width: 47.9375rem) 100vw, 80vw",
  ...props
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={asset.avif} sizes={sizes} />
      <source type="image/webp" srcSet={asset.webp} sizes={sizes} />
      <img
        className={className}
        src={asset.fallback}
        width={asset.width}
        height={asset.height}
        alt={asset.alt}
        loading={loading}
        decoding="async"
        {...(fetchPriority ? { fetchpriority: fetchPriority } : {})}
        {...props}
      />
    </picture>
  );
}
