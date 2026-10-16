import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { SafeImage } from '@/components/shared/SafeImage';
import type { ProjectImage } from '@/data/projects';

interface Props {
  images: ProjectImage[];
  projectTitle: string;
  variant?: string;
}

export function ProjectImageCarousel({
  images,
  projectTitle,
  variant = '',
}: Props) {
  const [index, setIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = images.length
    ? images
    : [{ src: '', alt: `${projectTitle} placeholder` }];
  const multiple = items.length > 1;
  const currentImage = items[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (lightboxOpen && dialog && !dialog.open) dialog.showModal();
  }, [lightboxOpen]);

  const changeImage = (step: number) => {
    setIndex((current) => (current + step + items.length) % items.length);
  };

  return (
    <div
      className={`carousel ${variant}`}
      tabIndex={0}
      aria-label={`${projectTitle} images`}
      onKeyDown={(event) => {
        if (!multiple) return;

        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          changeImage(-1);
        } else if (event.key === 'ArrowRight') {
          event.preventDefault();
          changeImage(1);
        }
      }}
    >
      <div className="carousel-frame">
        {items.map((image, imageIndex) => (
          <div
            className={`carousel-slide ${
              imageIndex === index ? 'is-current' : ''
            }`}
            key={image.src || imageIndex}
          >
            <SafeImage
              src={image.src}
              alt={image.alt}
              label={`${projectTitle} image ${imageIndex + 1}`}
              lighter={projectTitle.startsWith('Live-in-Labs')}
              onOpen={() => setLightboxOpen(true)}
            />
          </div>
        ))}
      </div>

      {multiple && (
        <>
          <button
            type="button"
            className="carousel-arrow carousel-arrow--left"
            aria-label={`Show previous image for ${projectTitle}`}
            onClick={() => changeImage(-1)}
          >
            <ChevronLeft />
          </button>
          <button
            type="button"
            className="carousel-arrow carousel-arrow--right"
            aria-label={`Show next image for ${projectTitle}`}
            onClick={() => changeImage(1)}
          >
            <ChevronRight />
          </button>
          <div className="carousel-dots" aria-hidden="true">
            {items.map((_, imageIndex) => (
              <i
                className={imageIndex === index ? 'is-current' : ''}
                key={imageIndex}
              />
            ))}
          </div>
          <span className="sr-only" aria-live="polite">
            Image {index + 1} of {items.length}
          </span>
        </>
      )}

      <dialog
        ref={dialogRef}
        className="image-lightbox"
        aria-label={`${projectTitle} images`}
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

        {multiple && (
          <>
            <button
              type="button"
              className="image-lightbox__nav image-lightbox__nav--prev"
              aria-label={`Show previous enlarged image for ${projectTitle}`}
              onClick={() => changeImage(-1)}
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              className="image-lightbox__nav image-lightbox__nav--next"
              aria-label={`Show next enlarged image for ${projectTitle}`}
              onClick={() => changeImage(1)}
            >
              <ChevronRight />
            </button>
            <span className="image-lightbox__count" aria-live="polite">
              {index + 1} / {items.length}
            </span>
          </>
        )}

        {currentImage.src && (
          <img
            className="image-lightbox__image"
            src={currentImage.src}
            alt={currentImage.alt}
          />
        )}
      </dialog>
    </div>
  );
}