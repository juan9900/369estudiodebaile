"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealOptions {
  /** Animate each direct child with a stagger instead of the container as a whole. */
  stagger?: boolean;
  /** Initial vertical offset in px. Defaults to 16. */
  y?: number;
  /** Animation duration in seconds. Defaults to 0.6. */
  duration?: number;
  /** ScrollTrigger `start` position. Defaults to "top 85%". */
  start?: string;
  /**
   * Extra values that should re-run the reveal — e.g. an async list's
   * length, so rows revealed after a fetch still animate in.
   */
  deps?: unknown[];
}

/**
 * Attaches a subtle fade + translate-up reveal (GSAP ScrollTrigger) to the
 * returned ref once it enters the viewport. No-ops when the user has
 * `prefers-reduced-motion` enabled — the element is simply visible from the
 * start in that case.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: ScrollRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    stagger = false,
    y = 16,
    duration = 0.6,
    start = "top 85%",
    deps = [],
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el || !el.children.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.fromTo(
        targets,
        { opacity: 0, y },
        {
          opacity: 1,
          y: 0,
          duration,
          ease: "power2.out",
          stagger: stagger ? 0.08 : 0,
          scrollTrigger: { trigger: el, start, once: true },
        },
      );
    }, el);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stagger, y, duration, start, ...deps]);

  return ref;
}

/**
 * Runs a one-off entrance stagger (opacity + translate-up) across the direct
 * children of the returned ref as soon as it mounts — no scroll trigger.
 * Used for above-the-fold content like the hero.
 */
export function useEntranceReveal<T extends HTMLElement = HTMLDivElement>(
  options: Pick<ScrollRevealOptions, "y" | "duration"> = {},
) {
  const ref = useRef<T>(null);
  const { y = 16, duration = 0.6 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(el.children),
        { opacity: 0, y },
        { opacity: 1, y: 0, duration, ease: "power2.out", stagger: 0.1 },
      );
    }, el);

    return () => ctx.revert();
  }, [y, duration]);

  return ref;
}
