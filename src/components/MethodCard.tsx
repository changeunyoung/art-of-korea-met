import Link from "next/link";

interface MethodCardProps {
  index: string;
  title: string;
  description: string;
  href: string;
  tilt?: number;
  onHover?: () => void;
  onLeave?: () => void;
}

export default function MethodCard({ index, title, href, tilt = 0, onHover, onLeave }: MethodCardProps) {
  return (
    <div className="group flex flex-col" onMouseEnter={onHover} onMouseLeave={onLeave}>
      <Link href={href} className="block p-8 transition-museum relative min-h-[420px]">
        <div
          className="absolute inset-0 flex flex-col items-center justify-end pb-40"
          style={{ transform: `rotate(${tilt}deg)` }}
        >
          <img
            src="/images/moonjar-transparent.png"
            alt=""
            aria-hidden="true"
            className="h-96 w-auto absolute top-[44%] left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 [filter:drop-shadow(0_0px_0px_rgba(0,0,0,0))] group-hover:[filter:drop-shadow(0_8px_20px_rgba(0,0,0,0.2))]"
          />
          <div className="relative z-10 flex flex-col items-center text-center">
            <span className="text-xs uppercase tracking-widest2 text-text-gray">{index}</span>
            <h3 className="font-display text-2xl mt-4 mb-0 group-hover:opacity-80 transition-museum">
              {title}
            </h3>
            <span className="inline-block mt-4 text-[10px] uppercase tracking-widest2 border-b border-ink pb-1 group-hover:opacity-60 transition-museum">
              Explore
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
