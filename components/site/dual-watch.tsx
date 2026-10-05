import { useEffect, useRef, useState, type RefObject } from "react";
import { Check, X } from "lucide-react";
import { Cortex } from "@/components/site/cortex";
import { SCENES } from "@/components/site/scenes";
import { WatchingEye } from "@/components/site/watching-eye";
import { cn } from "@/lib/utils";

type Phase = "type" | "scan" | "alert" | "hold";
type Gaze = { nx: number; ny: number };

type Snapshot = {
  sceneIndex: number;
  phase: Phase;
  lineIndex: number;
  col: number;
  driftCount: number;
};

const CHAR_MS = 22;
const SCAN_MS = 480;
const ALERT_MS = 2400;
const HOLD_MS = 900;

function clamp(n: number, min = -1, max = 1) {
  return Math.max(min, Math.min(max, n));
}

function gazeFor(line: number, col: number, totalLines: number, toward: number): Gaze {
  const ny = -0.18 + (line / Math.max(totalLines - 1, 1)) * 0.72;
  const nx = toward * 0.7 + (col / 32) * toward * 0.3;
  return { nx: clamp(nx), ny: clamp(ny) };
}

function visibleLines(source: string, lineIndex: number, col: number, showAll: boolean) {
  const lines = source.split("\n");
  if (showAll) return lines;
  return lines.map((line, i) => {
    if (i < lineIndex) return line;
    if (i === lineIndex) return line.slice(0, col);
    return "";
  });
}

function CodeOverlay({
  source,
  lineIndex,
  col,
  mismatchLine,
  phase,
  env,
  totalLines,
}: {
  source: string;
  lineIndex: number;
  col: number;
  mismatchLine: number;
  phase: Phase;
  env: "test" | "live";
  totalLines: number;
}) {
  const showAll = phase !== "type";
  const lines = visibleLines(source, lineIndex, col, showAll);
  const tint = env === "test" ? "text-test" : "text-primary";

  return (
    <div
      className="code-on-eye pointer-events-none absolute inset-0 flex items-center justify-center"
      aria-hidden="true"
    >
      <pre
        className={cn(
          "w-3/4 rounded-md bg-background/60 px-2 py-1.5 text-left font-mono text-2xs leading-tight sm:text-xs sm:leading-snug",
          tint,
        )}
      >
        {lines.map((line, i) => {
          const isMismatch = i === mismatchLine && (phase === "alert" || phase === "hold");
          const isMatch = isMismatch && env === "test";
          const isDrift = isMismatch && env === "live";
          const showCaret = phase === "type" && i === lineIndex && i < totalLines;
          return (
            <div
              key={`${env}-${i}`}
              className={cn(
                "relative flex min-h-4 items-center gap-1 whitespace-pre rounded-sm px-0.5",
                isDrift && "animate-line-shake bg-danger/20 text-danger",
                isMatch && "bg-success/15 text-success",
              )}
            >
              <span className={cn("min-w-0 grow truncate", isDrift && "line-through decoration-danger decoration-2")}>
                {line.length > 0 ? line : " "}
              </span>
              {showCaret ? <span className="inline-block h-3 w-1.5 bg-current animate-caret" /> : null}
              {isDrift ? <X className="size-3.5 shrink-0 text-danger" strokeWidth={3} /> : null}
              {isMatch ? <Check className="size-3.5 shrink-0 text-success" strokeWidth={3} /> : null}
            </div>
          );
        })}
      </pre>
    </div>
  );
}

export function DualWatch() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const cortexRef = useRef<HTMLDivElement>(null);
  const testPortRef = useRef<HTMLSpanElement>(null);
  const livePortRef = useRef<HTMLSpanElement>(null);
  const machine = useRef({
    sceneIndex: 0,
    phase: "type" as Phase,
    lineIndex: 0,
    col: 0,
    driftCount: 0,
    acc: 0,
  });

  const [view, setView] = useState<Snapshot>({
    sceneIndex: 0,
    phase: "type",
    lineIndex: 0,
    col: 0,
    driftCount: 0,
  });
  const [paths, setPaths] = useState({ test: "", live: "", size: { w: 0, h: 0 } });
  const [reduce, setReduce] = useState(false);

  const scene = SCENES[view.sceneIndex] ?? SCENES[0];
  const testLines = scene.test.split("\n");
  const liveLines = scene.live.split("\n");
  const totalLines = Math.max(testLines.length, liveLines.length);

  useEffect(() => {
    const prefersReduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduce(prefersReduce);
    if (prefersReduce) {
      setView({
        sceneIndex: 0,
        phase: "alert",
        lineIndex: 99,
        col: 99,
        driftCount: 1,
      });
    }
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const layout = () => {
      const cortex = cortexRef.current;
      const testPort = testPortRef.current;
      const livePort = livePortRef.current;
      if (!cortex || !testPort || !livePort) return;
      const wr = wrap.getBoundingClientRect();
      const cr = cortex.getBoundingClientRect();
      const tr = testPort.getBoundingClientRect();
      const lr = livePort.getBoundingClientRect();
      const toLocal = (r: DOMRect, xr: number, yr: number) => ({
        x: r.left + r.width * xr - wr.left,
        y: r.top + r.height * yr - wr.top,
      });
      const testStart = toLocal(tr, 0.5, 0.2);
      const liveStart = toLocal(lr, 0.5, 0.2);
      const leftEnd = toLocal(cr, 0.37, 0.9);
      const rightEnd = toLocal(cr, 0.63, 0.9);
      const gap = Math.max(20, testStart.y - leftEnd.y);
      const lift = gap * 0.42;
      const next = {
        test: `M ${testStart.x.toFixed(1)} ${testStart.y.toFixed(1)} C ${testStart.x.toFixed(1)} ${(testStart.y - lift).toFixed(1)}, ${leftEnd.x.toFixed(1)} ${(leftEnd.y + lift).toFixed(1)}, ${leftEnd.x.toFixed(1)} ${leftEnd.y.toFixed(1)}`,
        live: `M ${liveStart.x.toFixed(1)} ${liveStart.y.toFixed(1)} C ${liveStart.x.toFixed(1)} ${(liveStart.y - lift).toFixed(1)}, ${rightEnd.x.toFixed(1)} ${(rightEnd.y + lift).toFixed(1)}, ${rightEnd.x.toFixed(1)} ${rightEnd.y.toFixed(1)}`,
        size: { w: wr.width, h: wr.height },
      };
      setPaths((prev) =>
        prev.test === next.test && prev.live === next.live && prev.size.w === next.size.w && prev.size.h === next.size.h
          ? prev
          : next,
      );
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(wrap);
    window.addEventListener("resize", layout);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", layout);
    };
  }, []);

  useEffect(() => {
    if (reduce) return;

    let raf = 0;
    let last = performance.now();

    const publish = () => {
      const m = machine.current;
      setView({
        sceneIndex: m.sceneIndex,
        phase: m.phase,
        lineIndex: m.lineIndex,
        col: m.col,
        driftCount: m.driftCount,
      });
    };

    const tick = (now: number) => {
      const dt = Math.min(now - last, 48);
      last = now;
      const m = machine.current;
      m.acc += dt;
      const current = SCENES[m.sceneIndex] ?? SCENES[0];
      const tLines = current.test.split("\n");
      const lLines = current.live.split("\n");
      const lines = Math.max(tLines.length, lLines.length);

      if (m.phase === "type") {
        let steps = 0;
        let changed = false;
        while (m.acc >= CHAR_MS && steps < 4) {
          m.acc -= CHAR_MS;
          steps += 1;
          const maxLen = Math.max(tLines[m.lineIndex]?.length ?? 0, lLines[m.lineIndex]?.length ?? 0, 1);
          if (m.col < maxLen) {
            m.col += 1;
            changed = true;
          } else if (m.lineIndex < lines - 1) {
            m.lineIndex += 1;
            m.col = 0;
            changed = true;
          } else {
            m.phase = "scan";
            m.acc = 0;
            changed = true;
            break;
          }
        }
        if (changed) publish();
      } else if (m.phase === "scan") {
        if (m.acc >= SCAN_MS) {
          m.phase = "alert";
          m.driftCount += 1;
          m.acc = 0;
          publish();
        }
      } else if (m.phase === "alert") {
        if (m.acc >= ALERT_MS) {
          m.phase = "hold";
          m.acc = 0;
          publish();
        }
      } else if (m.phase === "hold") {
        if (m.acc >= HOLD_MS) {
          m.sceneIndex = (m.sceneIndex + 1) % SCENES.length;
          m.phase = "type";
          m.lineIndex = 0;
          m.col = 0;
          m.acc = 0;
          publish();
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const { phase, lineIndex, col, driftCount } = view;
  const scanNy = phase === "scan" ? 0.32 : null;
  const testLook =
    phase === "alert" || phase === "hold"
      ? gazeFor(scene.mismatchLine, 10, totalLines, 0.22)
      : scanNy !== null
        ? { nx: 0.14, ny: scanNy }
        : gazeFor(lineIndex, col, totalLines, 0.2);
  const liveLook =
    phase === "alert" || phase === "hold"
      ? gazeFor(scene.mismatchLine, 12, totalLines, -0.22)
      : scanNy !== null
        ? { nx: -0.14, ny: scanNy }
        : gazeFor(lineIndex, col, totalLines, -0.2);

  const alerting = phase === "alert";
  const flagged = phase === "alert" || phase === "hold";

  return (
    <div ref={wrapRef} className="relative mx-auto w-full max-w-4xl">
      <p className="sr-only">
        Two watchers compare TEST and LIVE metadata. When a line drifts, both eyes catch it and send
        a pulse up to the cortex.
      </p>

      <div ref={cortexRef} className="relative z-10 flex justify-center">
        <Cortex alert={flagged} driftCount={driftCount} />
      </div>

      <div className="grid grid-cols-2 items-start gap-2 sm:gap-8 md:gap-12">
        <EnvColumn
          env="test"
          portRef={testPortRef}
          look={testLook}
          alert={alerting}
          flagged={flagged}
          driftCount={driftCount}
          scene={scene}
          lineIndex={lineIndex}
          col={col}
          phase={phase}
          totalLines={totalLines}
        />
        <EnvColumn
          env="live"
          portRef={livePortRef}
          look={liveLook}
          alert={alerting}
          flagged={flagged}
          driftCount={driftCount}
          scene={scene}
          lineIndex={lineIndex}
          col={col}
          phase={phase}
          totalLines={totalLines}
        />
      </div>

      {paths.test && paths.live ? (
        <>
          <svg
            className="pointer-events-none absolute inset-0 overflow-visible"
            width={paths.size.w}
            height={paths.size.h}
            aria-hidden="true"
          >
            <path
              d={paths.test}
              fill="none"
              className={flagged ? "stroke-danger/50" : "stroke-test/55"}
              strokeWidth="2.4"
            />
            <path
              d={paths.live}
              fill="none"
              className={flagged ? "stroke-danger/50" : "stroke-primary/55"}
              strokeWidth="2.4"
            />
            <path
              d={paths.test}
              fill="none"
              className={cn("animate-dash-flow", flagged ? "stroke-danger" : "stroke-test")}
              strokeWidth="1.4"
              strokeDasharray="5 14"
              strokeLinecap="round"
            />
            <path
              d={paths.live}
              fill="none"
              className={cn("animate-dash-flow", flagged ? "stroke-danger" : "stroke-primary")}
              strokeWidth="1.4"
              strokeDasharray="5 14"
              strokeLinecap="round"
            />
          </svg>
          {[0, 1, 2].map((i) => (
            <span
              key={`t-${i}`}
              className={cn("pipeline-dot size-2.5 rounded-full", flagged ? "bg-danger" : "bg-test")}
              style={{
                offsetPath: `path("${paths.test}")`,
                animationDelay: `${i * 0.85}s`,
                boxShadow: flagged ? "0 0 12px var(--color-danger)" : "0 0 12px var(--color-test)",
              }}
            />
          ))}
          {[0, 1, 2].map((i) => (
            <span
              key={`l-${i}`}
              className={cn("pipeline-dot size-2.5 rounded-full", flagged ? "bg-danger" : "bg-primary")}
              style={{
                offsetPath: `path("${paths.live}")`,
                animationDelay: `${i * 0.85}s`,
                boxShadow: flagged ? "0 0 12px var(--color-danger)" : "0 0 12px var(--color-primary)",
              }}
            />
          ))}
        </>
      ) : null}

      <p
        className={cn(
          "mt-3 min-h-5 font-mono text-2xs tracking-wide sm:text-xs",
          flagged ? "text-danger" : "text-muted-foreground",
        )}
        aria-live="polite"
      >
        {flagged
          ? `DRIFT DETECTED · ${scene.source} · ${scene.reason}`
          : `WATCHING · ${scene.source} · TEST ↔ LIVE`}
      </p>
    </div>
  );
}

function EnvColumn({
  env,
  portRef,
  look,
  alert,
  flagged,
  driftCount,
  scene,
  lineIndex,
  col,
  phase,
  totalLines,
}: {
  env: "test" | "live";
  portRef: RefObject<HTMLSpanElement | null>;
  look: Gaze;
  alert: boolean;
  flagged: boolean;
  driftCount: number;
  scene: (typeof SCENES)[number];
  lineIndex: number;
  col: number;
  phase: Phase;
  totalLines: number;
}) {
  const isTest = env === "test";
  return (
    <div className="relative flex flex-col items-center">
      <p
        className={cn(
          "font-mono text-2xs font-medium tracking-hud sm:text-xs",
          isTest ? "text-test" : "text-primary",
        )}
      >
        {isTest ? "TEST ENVIRONMENT" : "LIVE ENVIRONMENT"}
      </p>
      <span
        ref={portRef}
        className={cn(
          "mt-1.5 size-1.5 rounded-full",
          isTest ? "port-test bg-test" : "port-live bg-primary",
          flagged && "bg-danger",
        )}
      />
      <div className="relative mt-1 w-full max-w-52 sm:max-w-64 md:max-w-72">
        <div
          aria-hidden="true"
          className={cn(
            "animate-pulse-ring absolute inset-x-8 inset-y-2 rounded-full border",
            isTest ? "border-test/30" : "border-primary/30",
          )}
        />
        <WatchingEye
          className="relative w-full"
          hudLabel={isTest ? "OBS-T · TEST" : "OBS-L · LIVE"}
          hudMeta={flagged ? "≠ MATCH" : "SYNC"}
          look={look}
          alert={alert}
          driftCount={driftCount}
          status={flagged ? "drift" : "watching"}
        />
        <CodeOverlay
          source={isTest ? scene.test : scene.live}
          lineIndex={lineIndex}
          col={col}
          mismatchLine={scene.mismatchLine}
          phase={phase}
          env={env}
          totalLines={totalLines}
        />
      </div>
    </div>
  );
}
