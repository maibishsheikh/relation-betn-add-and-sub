// Image placeholder — shown when story artwork images are not yet available.
// Replace with: <img src={`/assets/images/${src}`} alt={alt} className="story-img" />
export default function ImgPH({ src, alt }) {
  return (
    <div className="img-ph" role="img" aria-label={alt}>
      <span className="img-ph-icon">🖼️</span>
      <p className="img-ph-lbl">{alt || src}</p>
    </div>
  );
}
