import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={clsx(align === "center" && "text-center", className)}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-widest2 text-text-gray mb-3">{eyebrow}</p>
      )}
      <h2 className="font-display text-3xl md:text-4xl">{title}</h2>
      <div className={clsx("section-rule mt-4", align === "center" && "mx-auto")} />
      {description && (
        <p className="mt-5 text-text-gray max-w-2xl leading-relaxed text-base md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
