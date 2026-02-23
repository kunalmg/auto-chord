type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  kicker?: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  title,
  subtitle,
  kicker,
  align = "left",
}: SectionHeadingProps) {
  const alignment =
    align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {kicker ? (
        <span className="text-sm uppercase tracking-[0.2em] text-white/60">
          {kicker}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-2xl text-base text-white/70 sm:text-lg">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
