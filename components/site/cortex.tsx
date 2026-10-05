import { useId } from "react";
import { cn } from "@/lib/utils";

type CortexProps = {
  alert: boolean;
  driftCount: number;
};

export function Cortex({ alert, driftCount }: CortexProps) {
  const rawId = useId();
  const uid = `c${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <svg
      viewBox="0 0 320 188"
      role="img"
      aria-label="Cortex that receives telemetry from both environment watchers"
      className="mx-auto w-36 sm:w-44 md:w-52"
    >
      <defs>
        <radialGradient id={`${uid}-glow`} cx="50%" cy="48%" r="55%">
          <stop
            offset="0%"
            stopColor={alert ? "oklch(0.64 0.2 25 / 0.55)" : "oklch(0.83 0.15 78 / 0.42)"}
          />
          <stop offset="70%" stopColor="oklch(0.83 0.15 78 / 0)" />
        </radialGradient>
        <radialGradient id={`${uid}-core`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="oklch(0.94 0.08 88)" />
          <stop offset="55%" stopColor="oklch(0.78 0.14 78)" />
          <stop offset="100%" stopColor="oklch(0.42 0.1 55)" />
        </radialGradient>
        <linearGradient id={`${uid}-membrane`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.38 0.03 80)" />
          <stop offset="100%" stopColor="oklch(0.26 0.025 80)" />
        </linearGradient>
      </defs>

      <circle cx="160" cy="92" r="86" fill={`url(#${uid}-glow)`} className={alert ? "animate-cortex-alert" : undefined} />

      <g aria-hidden="true" className="fill-muted-foreground font-mono" fontSize="9" letterSpacing="1.4">
        <text x="18" y="14">
          CORTEX
        </text>
        <text x="302" y="14" textAnchor="end" className={alert ? "fill-danger" : undefined}>
          {alert ? `DRIFT ${driftCount}` : "SYNC"}
        </text>
      </g>

      <path
        d="M160 28C128 20 86 28 62 52C40 74 38 106 52 130C64 150 92 164 122 170C140 174 150 168 160 158C170 168 180 174 198 170C228 164 256 150 268 130C282 106 280 74 258 52C234 28 192 20 160 28Z"
        fill={`url(#${uid}-membrane)`}
        className="stroke-foreground/80"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      <path
        d="M160 36C156 70 164 108 160 156"
        fill="none"
        className="stroke-foreground/35"
        strokeWidth="1.4"
      />

      <g fill="none" className="stroke-foreground/55" strokeWidth="1.25" strokeLinecap="round">
        <path d="M92 58c18-10 34-8 46 4" />
        <path d="M78 86c16-8 30-4 44 6" />
        <path d="M84 114c14-6 28-2 40 8" />
        <path d="M108 142c12-8 24-6 36 2" />
        <path d="M228 58c-18-10-34-8-46 4" />
        <path d="M242 86c-16-8-30-4-44 6" />
        <path d="M236 114c-14-6-28-2-40 8" />
        <path d="M212 142c-12-8-24-6-36 2" />
        <path d="M118 48c10 8 18 22 16 36" />
        <path d="M202 48c-10 8-18 22-16 36" />
      </g>

      <g fill="none" stroke="oklch(0.83 0.15 78 / 0.45)" strokeWidth="0.9">
        <path d="M104 96h20" />
        <path d="M196 96h20" />
        <path d="M148 78v-14" />
        <path d="M172 78v-14" />
        <path d="M132 128l12 10" />
        <path d="M188 128l-12 10" />
      </g>

      <circle cx="160" cy="96" r="16" fill={`url(#${uid}-core)`} className={alert ? "animate-cortex-alert" : undefined} />
      <circle cx="160" cy="96" r="16" fill="none" className="stroke-primary/70" strokeWidth="1.2" />
      <circle cx="160" cy="96" r="7" className={alert ? "fill-danger" : "fill-primary"} />

      {[
        [104, 72],
        [216, 72],
        [90, 108],
        [230, 108],
        [124, 148],
        [196, 148],
        [160, 54],
      ].map(([cx, cy], i) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r={i === 6 ? 3.2 : 2.4}
          className={cn(
            alert ? "fill-danger" : "fill-primary",
            "animate-node-pulse",
          )}
          style={{ animationDelay: `${i * 180}ms` }}
        />
      ))}

      <circle cx="118" cy="172" r="4" className={alert ? "fill-danger" : "fill-test"} />
      <circle cx="202" cy="172" r="4" className={alert ? "fill-danger" : "fill-primary"} />
      <circle cx="118" cy="172" r="7" fill="none" className={alert ? "stroke-danger/50" : "stroke-test/50"} />
      <circle cx="202" cy="172" r="7" fill="none" className={alert ? "stroke-danger/50" : "stroke-primary/50"} />
    </svg>
  );
}
