// Icon Component
interface ImgProps {
  src: string;
  class?: string;
  alt?: string;
}

export const Img = ({ src, class: className, alt = '' }: ImgProps) => {
  return <img src={src} alt={alt} class={className} aria-hidden="true" />;
};
