"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type ProjectPhotoGalleryProps = {
  images: string[];
  title: string;
  locale: "en" | "fr" | "pt";
};

const labels = {
  en: { open: "Open photo full size", close: "Close photo viewer", previous: "Previous photo", next: "Next photo", photo: "Photo", of: "of" },
  fr: { open: "Afficher la photo en grand", close: "Fermer la visionneuse", previous: "Photo précédente", next: "Photo suivante", photo: "Photo", of: "sur" },
  pt: { open: "Ver fotografia em tamanho completo", close: "Fechar visualizador de fotografias", previous: "Fotografia anterior", next: "Fotografia seguinte", photo: "Fotografia", of: "de" }
} as const;

export function ProjectPhotoGallery({ images, title, locale }: ProjectPhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const t = labels[locale];

  useEffect(() => {
    if (activeIndex === null) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") setActiveIndex((current) => current === null ? null : (current - 1 + images.length) % images.length);
      if (event.key === "ArrowRight") setActiveIndex((current) => current === null ? null : (current + 1) % images.length);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, images.length]);

  return (
    <>
      <div className="project-card-gallery">
        {images.map((src, imageIndex) => (
          <button className="project-card-thumb" key={src} type="button" onClick={() => setActiveIndex(imageIndex)} aria-label={`${t.open}: ${title}, ${t.photo} ${imageIndex + 1}`}>
            <Image src={src} alt={`${title} — ${t.photo} ${imageIndex + 1}`} fill sizes="(max-width: 720px) 28vw, 100px" />
            <span className="project-card-thumb-zoom" aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
      {activeIndex !== null && (
        <div className="project-lightbox" role="dialog" aria-modal="true" aria-label={title} onClick={() => setActiveIndex(null)}>
          <button className="project-lightbox-close" type="button" aria-label={t.close} onClick={() => setActiveIndex(null)}>×</button>
          {images.length > 1 && <button className="project-lightbox-nav project-lightbox-prev" type="button" aria-label={t.previous} onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}>‹</button>}
          <div className="project-lightbox-stage" onClick={(event) => event.stopPropagation()}>
            <Image src={images[activeIndex]} alt={`${title} — ${t.photo} ${activeIndex + 1}`} fill sizes="100vw" priority />
          </div>
          <div className="project-lightbox-caption">{title} <span>{activeIndex + 1} {t.of} {images.length}</span></div>
          {images.length > 1 && <button className="project-lightbox-nav project-lightbox-next" type="button" aria-label={t.next} onClick={(event) => { event.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}>›</button>}
        </div>
      )}
    </>
  );
}
