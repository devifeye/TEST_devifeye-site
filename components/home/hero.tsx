import { ArrowRight } from "lucide-react";
import { DualWatch } from "@/components/site/dual-watch";
import { Button } from "@/components/ui/button";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative">
      <div aria-hidden="true" className="bg-grid hero-mask absolute inset-0" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 pb-14 pt-6 text-center sm:px-6 md:pb-20 md:pt-8">
        <DualWatch />
        <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 font-mono text-2xs text-muted-foreground sm:text-xs">
          <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
          {SITE.eyebrow}
        </p>
        <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
          We watch for drift,
          <br />
          <span className="text-primary">so you don't have to.</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {SITE.description}
        </p>
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <Button asChild>
            <a href="#start">
              Start watching for free
              <ArrowRight className="size-4" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href="#how">See how it works</a>
          </Button>
        </div>
        <p className="mt-5 text-xs text-muted-foreground">{SITE.privacy}</p>
      </div>
    </section>
  );
}
