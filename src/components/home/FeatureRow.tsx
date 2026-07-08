import Link from "next/link";

interface FeatureRowProps {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  body: string;
  cta?: string;
}

export function FeatureRow({ href, image, imageAlt, title, body, cta }: FeatureRowProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-[16/10] md:aspect-auto md:w-[40%] shrink-0 overflow-hidden">
        <div
          role="img"
          aria-label={imageAlt}
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url(${image})` }}
        />
      </div>
      <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
        <p className="font-bold text-[#0D9488] text-base md:text-lg mb-1.5">{title}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{body}</p>
        {cta && (
          <span className="mt-3 inline-block text-[#0D9488] text-xs font-semibold group-hover:text-[#0F766E] transition-colors w-fit">
            {cta}
          </span>
        )}
      </div>
    </Link>
  );
}
