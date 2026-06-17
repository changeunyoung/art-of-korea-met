import Link from "next/link";

interface MethodCardProps {
  index: string;
  title: string;
  description: string;
  href: string;
}

export default function MethodCard({ index, title, description, href }: MethodCardProps) {
  return (
    <Link
      href={href}
      className="group block bg-white border border-light-gray p-8 transition-museum hover:border-text-gray hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
    >
      <span className="text-xs uppercase tracking-widest2 text-text-gray">{index}</span>
      <h3 className="font-display text-2xl mt-4 mb-3 group-hover:opacity-80 transition-museum">
        {title}
      </h3>
      <p className="text-sm text-text-gray leading-relaxed">{description}</p>
      <span className="inline-block mt-6 text-xs uppercase tracking-widest2 border-b border-ink pb-1 group-hover:opacity-60 transition-museum">
        Explore
      </span>
    </Link>
  );
}
