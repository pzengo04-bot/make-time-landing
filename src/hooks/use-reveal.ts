import { useEffect, useRef, useState } from "react";

/**
 * Adds a `reveal-in` class when the element enters the viewport.
 * Pair with the base `reveal` utility from styles.css.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: { threshold?: number; rootMargin?: string; delayMs?: number } = {},
) {
  const { threshold = 0.15, rootMargin = "0px 0px -10% 0px", delayMs = 0 } = options;
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || shown) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const t = window.setTimeout(() => setShown(true), delayMs);
            io.disconnect();
            return () => window.clearTimeout(t);
          }
        }
      },
      { threshold, rootMargin },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [shown, threshold, rootMargin, delayMs]);

  return { ref, shown };
}