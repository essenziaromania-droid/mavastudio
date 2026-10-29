"use client";
import { useEffect, useRef, useState } from "react";
import { Eraser } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Zonă de semnătură: se desenează cu mouse-ul, degetul sau stylus-ul.
 * Imaginea (PNG, data URL) este pusă într-un câmp ascuns cu numele dat, ca să fie trimisă cu formularul.
 */
export function SignaturePad({ name, className, hint = "Semnează aici cu mouse-ul sau cu degetul" }: { name: string; className?: string; hint?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [empty, setEmpty] = useState(true);

  useEffect(() => {
    const c = canvas.current!;
    const resize = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const { width, height } = c.getBoundingClientRect();
      c.width = Math.round(width * ratio);
      c.height = Math.round(height * ratio);
      const ctx = c.getContext("2d")!;
      ctx.scale(ratio, ratio);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0A0F3D";
      ctx.lineWidth = 2.2;
      clear();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function point(e: React.PointerEvent) {
    const r = canvas.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  function start(e: React.PointerEvent) {
    e.preventDefault();
    canvas.current!.setPointerCapture(e.pointerId);
    drawing.current = true;
    last.current = point(e);
  }
  function move(e: React.PointerEvent) {
    if (!drawing.current || !last.current) return;
    const p = point(e);
    const ctx = canvas.current!.getContext("2d")!;
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    if (empty) setEmpty(false);
  }
  function end() {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    if (input.current) input.current.value = canvas.current!.toDataURL("image/png");
  }
  function clear() {
    const c = canvas.current;
    if (!c) return;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    if (input.current) input.current.value = "";
    setEmpty(true);
  }

  return (
    <div className={cn("w-full max-w-md", className)}>
      <div className="relative rounded-xl border-2 border-dashed border-line bg-white">
        <canvas
          ref={canvas}
          className="block h-40 w-full cursor-crosshair touch-none rounded-xl"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
        />
        {empty && <span className="pointer-events-none absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted">{hint}</span>}
        <div className="pointer-events-none absolute bottom-8 left-6 right-6 border-b border-line" />
      </div>
      <input ref={input} type="hidden" name={name} />
      <button type="button" onClick={clear} className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-muted hover:text-ink">
        <Eraser className="h-3.5 w-3.5" /> Șterge și semnează din nou
      </button>
    </div>
  );
}

