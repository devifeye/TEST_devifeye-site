'use client'
import { useEffect, useId, useRef } from "react";
import { cn } from "@/lib/utils";

const MAX_X = 60;
const MAX_Y = 24;
const CX = 200;
const CY = 100;
const EYE_PATH = "M14 100C70 34 132 18 200 18s130 16 186 82c-56 66-118 82-186 82S70 166 14 100Z";

type Point = [number, number];
type Curve = [Point, Point, Point, Point];
type Gaze = { nx: number; ny: number };

const UPPER_LID: Curve[] = [
  [
    [14, 100],
    [70, 34],
    [132, 18],
    [200, 18],
  ],
  [
    [200, 18],
    [268, 18],
    [330, 34],
    [386, 100],
  ],
];
const LOWER_LID: Curve[] = [
  [
    [386, 100],
    [330, 166],
    [268, 182],
    [200, 182],
  ],
  [
    [200, 182],
    [132, 182],
    [70, 166],
    [14, 100],
  ],
];

const round = (n: number) => Number(n.toFixed(2));

function seeded(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function onCurve([p0, p1, p2, p3]: Curve, t: number) {
  const mt = 1 - t;
  const point: Point = [
    mt ** 3 * p0[0] + 3 * mt ** 2 * t * p1[0] + 3 * mt * t ** 2 * p2[0] + t ** 3 * p3[0],
    mt ** 3 * p0[1] + 3 * mt ** 2 * t * p1[1] + 3 * mt * t ** 2 * p2[1] + t ** 3 * p3[1],
  ];
  const tx =
    3 * mt ** 2 * (p1[0] - p0[0]) + 6 * mt * t * (p2[0] - p1[0]) + 3 * t ** 2 * (p3[0] - p2[0]);
  const ty =
    3 * mt ** 2 * (p1[1] - p0[1]) + 6 * mt * t * (p2[1] - p1[1]) + 3 * t ** 2 * (p3[1] - p2[1]);
  const length = Math.hypot(tx, ty) || 1;
  return { point, normal: [ty / length, -tx / length] as Point };
}

function alongLid(lid: Curve[], u: number) {
  return u < 0.5 ? onCurve(lid[0], u * 2) : onCurve(lid[1], (u - 0.5) * 2);
}

const LASH_COUNT = 15;
const lashes = Array.from({ length: LASH_COUNT }, (_, i) => {
  const u = 0.1 + (i / (LASH_COUNT - 1)) * 0.8;
  const { point, normal } = alongLid(UPPER_LID, u);
  const length = 5 + (1 - Math.abs(u - 0.5) * 2) * 11;
  return {
    x1: round(point[0] + normal[0] * 5),
    y1: round(point[1] + normal[1] * 5),
    x2: round(point[0] + normal[0] * (5 + length)),
    y2: round(point[1] + normal[1] * (5 + length)),
    center: i === Math.floor(LASH_COUNT / 2),
  };
});

const lowerDots = Array.from({ length: 9 }, (_, i) => {
  const { point, normal } = alongLid(LOWER_LID, 0.2 + (i / 8) * 0.6);
  return { cx: round(point[0] + normal[0] * 8), cy: round(point[1] + normal[1] * 8) };
});

const fibers = Array.from({ length: 96 }, (_, i) => {
  const angle = (i / 96) * Math.PI * 2 + seeded(i) * 0.05;
  const inner = 27 + seeded(i + 200) * 3;
  const outer = 40 + seeded(i + 400) * 19;
  return {
    x1: round(CX + Math.cos(angle) * inner),
    y1: round(CY + Math.sin(angle) * inner),
    x2: round(CX + Math.cos(angle) * outer),
    y2: round(CY + Math.sin(angle) * outer),
    light: i % 3 === 0,
    width: round(0.6 + seeded(i + 600) * 0.9),
  };
});

const collarette = Array.from({ length: 44 }, (_, i) => {
  const angle = (i / 44) * Math.PI * 2;
  const r = 35 + (i % 2 ? 4.5 : 0) + seeded(i + 800) * 2;
  return `${round(CX + Math.cos(angle) * r)},${round(CY + Math.sin(angle) * r)}`;
}).join(" ");

const crypts = Array.from({ length: 7 }, (_, i) => {
  const angle = (i / 7) * Math.PI * 2 + 0.4;
  const r = 46 + seeded(i + 1000) * 7;
  return {
    cx: round(CX + Math.cos(angle) * r),
    cy: round(CY + Math.sin(angle) * r),
    rotate: round((angle * 180) / Math.PI),
  };
});

const frameCorners = ["M-12 -16v-12h12", "M412 -16v-12h-12", "M-12 204v12h12", "M412 204v12h-12"];

const formatAxis = (n: number) => `${n >= 0 ? "+" : "-"}${Math.abs(n).toFixed(2)}`;

export type WatchingEyeProps = {
  className?: string;
  hudLabel: string;
  hudMeta: string;
  look: Gaze;
  alert?: boolean;
  driftCount?: number;
  status?: "watching" | "drift";
};

export function WatchingEye({
  className,
  hudLabel,
  hudMeta,
  look,
  alert = false,
  driftCount = 0,
  status = "watching",
}: WatchingEyeProps) {
  const rawId = useId();
  const uid = `e${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  const svgRef = useRef<SVGSVGElement>(null);
  const lidsRef = useRef<SVGGElement>(null);
  const irisRef = useRef<SVGGElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const readoutRef = useRef<SVGTSpanElement>(null);

  useEffect(() => {
    const iris = irisRef.current;
    const pupil = pupilRef.current;
    if (!iris || !pupil) return;
    iris.style.transform = `translate(${look.nx * MAX_X}px, ${look.ny * MAX_Y}px)`;
    pupil.style.transform = `scale(${alert ? 1.12 : 0.88})`;
    if (readoutRef.current) {
      readoutRef.current.textContent = `x ${formatAxis(look.nx)}  y ${formatAxis(-look.ny)}`;
    }
  }, [look.nx, look.ny, alert]);

  useEffect(() => {
    const svg = svgRef.current;
    const lids = lidsRef.current;
    if (!svg || !lids) return;

    const blink = () => {
      lids.classList.remove("animate-blink", "animate-blink-once");
      void lids.getBoundingClientRect();
      lids.classList.add("animate-blink-once");
    };
    const resumeIdleBlink = (event: AnimationEvent) => {
      if (event.animationName !== "blink-once") return;
      lids.classList.remove("animate-blink-once");
      lids.classList.add("animate-blink");
    };

    svg.addEventListener("pointerdown", blink);
    lids.addEventListener("animationend", resumeIdleBlink);
    return () => {
      svg.removeEventListener("pointerdown", blink);
      lids.removeEventListener("animationend", resumeIdleBlink);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="-24 -36 448 264"
      role="img"
      aria-label={`${hudLabel}. A watchful eye that follows the code being written. Click it to blink.`}
      className={cn("eye-glow cursor-pointer", className)}
    >
      <defs>
        <radialGradient id={`${uid}-iris`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.95 0.1 88)" />
          <stop offset="45%" stopColor="oklch(0.83 0.16 78)" />
          <stop offset="80%" stopColor="oklch(0.62 0.15 62)" />
          <stop offset="100%" stopColor="oklch(0.42 0.1 50)" />
        </radialGradient>
        <radialGradient id={`${uid}-pupil`} cx="45%" cy="40%" r="60%">
          <stop offset="0%" stopColor="oklch(0.2 0.02 265)" />
          <stop offset="100%" stopColor="oklch(0.07 0.01 265)" />
        </radialGradient>
        <radialGradient id={`${uid}-sclera`} cx="50%" cy="48%" r="58%">
          <stop offset="0%" style={{ stopColor: "var(--color-card)" }} />
          <stop offset="65%" style={{ stopColor: "var(--color-card)" }} />
          <stop
            offset="100%"
            style={{ stopColor: "color-mix(in oklch, var(--color-card), black 45%)" }}
          />
        </radialGradient>
        <linearGradient id={`${uid}-lid-shadow`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0 0 0 / 0.4)" />
          <stop offset="100%" stopColor="oklch(0 0 0 / 0)" />
        </linearGradient>
        <linearGradient id={`${uid}-scan`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-primary)", stopOpacity: 0.35 }} />
        </linearGradient>
        <clipPath id={`${uid}-almond`}>
          <path d={EYE_PATH} />
        </clipPath>
      </defs>

      <g aria-hidden="true" className="fill-muted-foreground font-mono" fontSize="9" letterSpacing="1">
        {frameCorners.map((d) => (
          <path key={d} d={d} fill="none" className="stroke-muted-foreground/50" strokeWidth="1.5" />
        ))}
        <text x="6" y="-20">
          {hudLabel}
        </text>
        <text x="394" y="-20" textAnchor="end">
          {hudMeta}
        </text>
        <text x="6" y="212">
          <tspan ref={readoutRef}>x +0.00  y +0.00</tspan>
        </text>
        <circle
          cx="326"
          cy="209"
          r="3"
          className={status === "drift" ? "animate-rec fill-danger" : "animate-rec fill-success"}
        />
        <text x="394" y="212" textAnchor="end" className={status === "drift" ? "fill-danger" : undefined}>
          {status === "drift" ? `DRIFT ${driftCount}` : "WATCHING"}
        </text>
      </g>

      <g className={alert ? "animate-eye-shake" : undefined}>
        <g ref={lidsRef} className="eye-lids animate-blink">
          <path d={EYE_PATH} fill={`url(#${uid}-sclera)`} />
          <g clipPath={`url(#${uid}-almond)`}>
            <g fill="none" stroke="oklch(0.62 0.16 25 / 0.22)" strokeWidth="0.9" strokeLinecap="round">
              <path d="M20 100c22-5 40 4 62-2s20 2 30 0" />
              <path d="M34 116c16 1 30 8 46 5" />
              <path d="M44 82c14-3 24-10 40-7" />
              <path d="M380 100c-22-5-40 4-62-2s-20 2-30 0" />
              <path d="M366 84c-16-1-30-8-46-5" />
              <path d="M358 118c-14 3-26 9-42 6" />
            </g>
            <g ref={irisRef} style={{ transition: "transform 180ms ease-out" }}>
              <circle cx={CX} cy={CY} r="64" fill="oklch(0 0 0 / 0.18)" />
              <circle cx={CX} cy={CY} r="61" fill={`url(#${uid}-iris)`} />
              {fibers.map((f, i) => (
                <line
                  key={i}
                  x1={f.x1}
                  y1={f.y1}
                  x2={f.x2}
                  y2={f.y2}
                  stroke={f.light ? "oklch(0.97 0.08 90 / 0.4)" : "oklch(0.32 0.08 52 / 0.45)"}
                  strokeWidth={f.width}
                  strokeLinecap="round"
                />
              ))}
              {crypts.map((c, i) => (
                <ellipse
                  key={i}
                  cx={c.cx}
                  cy={c.cy}
                  rx="4"
                  ry="1.6"
                  transform={`rotate(${c.rotate} ${c.cx} ${c.cy})`}
                  fill="oklch(0.3 0.07 50 / 0.35)"
                />
              ))}
              <polygon
                points={collarette}
                fill="none"
                stroke="oklch(0.97 0.1 90 / 0.55)"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <circle cx={CX} cy={CY} r="60" fill="none" stroke="oklch(0.26 0.06 48)" strokeWidth="3.5" opacity="0.85" />
              <circle
                cx={CX}
                cy={CY}
                r="49"
                fill="none"
                stroke="oklch(0.98 0.04 90 / 0.4)"
                strokeWidth="0.8"
                strokeDasharray="1 4"
                className="iris-spin animate-spin-slow"
              />
              <circle
                cx={CX}
                cy={CY}
                r="53"
                fill="none"
                stroke="oklch(0.99 0.03 90 / 0.65)"
                strokeWidth="1.4"
                strokeDasharray="22 311"
                strokeLinecap="round"
                className="iris-spin animate-spin-reverse"
              />
              <g
                ref={pupilRef}
                style={{
                  transition: "transform 300ms ease-out",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
              >
                <circle cx={CX} cy={CY} r="25" fill={`url(#${uid}-pupil)`} />
                <circle cx={CX} cy={CY} r="25" fill="none" stroke="oklch(0.85 0.14 78 / 0.3)" strokeWidth="1" />
                <circle cx={CX} cy={CY} r="17" fill="none" stroke="oklch(0.85 0.14 78 / 0.12)" strokeWidth="0.8" />
              </g>
              <rect x="207" y="76" width="14" height="9" rx="4.5" fill="oklch(1 0 0 / 0.9)" transform="rotate(-22 214 80)" />
              <circle cx="189" cy="114" r="2.5" fill="oklch(1 0 0 / 0.45)" />
              <rect x="219" y="91" width="7" height="2.2" rx="0.6" fill="oklch(1 0 0 / 0.8)" className="animate-caret" />
            </g>
            <path d="M14 100C70 34 132 18 200 18s130 16 186 82Z" fill={`url(#${uid}-lid-shadow)`} opacity="0.7" />
            <rect x="14" y="10" width="372" height="10" fill={`url(#${uid}-scan)`} className="animate-eye-scan" />
          </g>
          <path d={EYE_PATH} fill="none" className="stroke-foreground" strokeWidth="3" strokeLinejoin="round" />
          {lashes.map((l, i) => (
            <line
              key={i}
              x1={l.x1}
              y1={l.y1}
              x2={l.x2}
              y2={l.y2}
              className={l.center ? "stroke-primary" : "stroke-foreground/55"}
              strokeWidth={l.center ? 2.5 : 1.6}
              strokeLinecap="round"
            />
          ))}
          {lowerDots.map((d, i) => (
            <circle key={i} cx={d.cx} cy={d.cy} r="1.3" className="fill-foreground/35" />
          ))}
        </g>
      </g>
    </svg>
  );
}
