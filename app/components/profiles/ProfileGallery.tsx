import { ProfileImage } from "@/app/components/profiles/ProfileImage";

type ProfileGalleryProps = {
  images: Array<{ src?: string; alt: string }>; 
  className?: string;
};

export function ProfileGallery({ images, className = "" }: ProfileGalleryProps) {
  if (!images.length) {
    return (
      <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
        <ProfileImage src="/images/profiles/profile-fallback.svg" alt="Profile placeholder" size="lg" rounded="lg" />
        <ProfileImage src="/images/profiles/profile-fallback.svg" alt="Profile placeholder" size="lg" rounded="lg" />
      </div>
    );
  }

  return (
    <div className={`grid gap-3 sm:grid-cols-2 ${className}`}>
      {images.map((image, index) => (
        <ProfileImage
          key={`${image.alt}-${index}`}
          src={image.src}
          alt={image.alt}
          size="lg"
          rounded="lg"
          className="h-52 sm:h-64"
        />
      ))}
    </div>
  );
}
