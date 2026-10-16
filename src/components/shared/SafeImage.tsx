import { useEffect, useRef, useState } from 'react';
import { Expand, X } from 'lucide-react';

interface Props {
  src?: string;
  alt: string;
  label: string;
  className?: string;
  lighter?: boolean;
  onOpen?: () => void;
  zoomable?: boolean;
}

export function SafeImage({
  src,
  alt,
  label,
  className = '',
  lighter = false,
  onOpen,
  zoomable = true,
}: Props) {
  const [failed, setFailed] = useState(!src);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageClass = `safe-image ${lighter ? 'safe-image--lighter' : ''} ${className}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (lightboxOpen && dialog && !dialog.open) dialog.showModal();
  }, [lightboxOpen]);

  if (failed) {
    return (
      <div className={imageClass}>
        <span>[ {label} ]</span>
      </div>
    );
  }

  if (!zoomable) {
    return (
      <div className={imageClass}>
        <img src={src} alt={alt} onError={() => setFailed(true)} />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        className={imageClass}
        aria-label={`Enlarge image: ${alt}`}
        aria-haspopup="dialog"
        onClick={() => (onOpen ? onOpen() : setLightboxOpen(true))}
      >
        <img src={src} alt={alt} onError={() => setFailed(true)} />
        <span className="safe-image__zoom" aria-hidden="true">
          <Expand />
        </span>
      </button>

      {!onOpen && (
        <dialog
          ref={dialogRef}
          className="image-lightbox"
          aria-label={alt}
          onClose={() => setLightboxOpen(false)}
          onClick={(event) => {
            if (event.target === event.currentTarget) dialogRef.current?.close();
          }}
        >
          <button
            type="button"
            className="image-lightbox__close"
            aria-label="Close enlarged image"
            onClick={() => dialogRef.current?.close()}
          >
            <X />
          </button>
          <img className="image-lightbox__image" src={src} alt={alt} />
        </dialog>
      )}
    </>
  );
}