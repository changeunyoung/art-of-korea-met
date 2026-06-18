import Link from "next/link";

interface MethodCardProps {
  index: string;
  title: string;
  description: string;
  href: string;
}

export default function MethodCard({ index, title, href }: MethodCardProps) {
  return (
    <Link href={href} className="group block p-8 transition-museum relative">
      <img
        src="/images/moonjar-transparent.png"
        alt=""
        aria-hidden="true"
        className="absolute top-[68%] left-1/2 -translate-x-1/2 -translate-y-1/3 h-96 w-auto transition-all duration-300 [filter:drop-shadow(0_0px_0px_rgba(0,0,0,0))] group-hover:[filter:drop-shadow(0_8px_20px_rgba(0,0,0,0.2))]"
      />
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-xs uppercase tracking-widest2 text-text-gray">{index}</span>
        <h3 className="font-display text-2xl mt-4 mb-0 group-hover:opacity-80 transition-museum">
          {title}
        </h3>
        <span className="inline-block mt-6 text-xs uppercase tracking-widest2 border-b border-ink pb-1 group-hover:opacity-60 transition-museum">
          Explore
        </span>
      </div>
    </Link>
  );
}
