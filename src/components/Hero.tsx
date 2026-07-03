"use client";

import { useEffect, useRef } from "react";

const STATS = [
  { count: 500, suffix: "+", label: "Attendees" },
  { count: 20, suffix: "+", label: "Speakers" },
  { count: 1, suffix: "", label: "Track" },
  { count: 2010, suffix: "", label: "Running Since" },
];

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const gemWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particleFieldRef = useRef<HTMLDivElement>(null);
  const statRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // floating particles
    const field = particleFieldRef.current;
    if (field && !reduce) {
      const count = 26;
      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        const size = 2 + Math.random() * 4;
        const gold = Math.random() > 0.4;
        p.className = "particle";
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.background = gold ? "#e8c766" : "#ff8fa3";
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${40 + Math.random() * 55}%`;
        p.style.animationDuration = `${6 + Math.random() * 9}s`;
        p.style.animationDelay = `${Math.random() * 9}s`;
        field.appendChild(p);
      }
    }

    // mouse-tracked gem tilt + facet light angle
    const hero = heroRef.current;
    const gemWrap = gemWrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d") ?? null;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;

    function onMouseMove(e: MouseEvent) {
      const r = hero!.getBoundingClientRect();
      targetX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      targetY = ((e.clientY - r.top) / r.height - 0.5) * 2;
    }
    function onMouseLeave() {
      targetX = 0;
      targetY = 0;
    }
    if (hero && !reduce) {
      hero.addEventListener("mousemove", onMouseMove);
      hero.addEventListener("mouseleave", onMouseLeave);
    }

    const W = 260;
    const H = 260;
    const cx = W / 2;
    let lightAngle = -0.9;
    let targetAngle = -0.9;
    let autoDrift = 0;
    let rafId = 0;

    function shade(t: number) {
      const stops = [
        [92, 10, 26],
        [201, 31, 55],
        [255, 90, 112],
        [255, 205, 150],
      ];
      const scaled = Math.max(0, Math.min(1, t)) * (stops.length - 1);
      const i = Math.floor(scaled);
      const f = scaled - i;
      const a = stops[Math.min(i, stops.length - 1)];
      const b = stops[Math.min(i + 1, stops.length - 1)];
      const r = Math.round(a[0] + (b[0] - a[0]) * f);
      const g = Math.round(a[1] + (b[1] - a[1]) * f);
      const bl = Math.round(a[2] + (b[2] - a[2]) * f);
      return `rgb(${r},${g},${bl})`;
    }

    function poly(radius: number, cy: number, n: number, rot: number) {
      const pts: [number, number][] = [];
      for (let i = 0; i < n; i++) {
        const a = rot + i * ((Math.PI * 2) / n);
        pts.push([cx + Math.cos(a) * radius, cy + Math.sin(a) * radius * 0.62]);
      }
      return pts;
    }

    function drawGem() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      const n = 8;
      const crownY = 92;
      const girdleR = 108;
      const tableR = 48;
      const pavTipY = 244;
      const rot = -Math.PI / 2;
      const crown = poly(girdleR, crownY, n, rot);
      const table = poly(tableR, crownY - 20, n, rot);

      for (let i = 0; i < n; i++) {
        const a1 = crown[i];
        const a2 = crown[(i + 1) % n];
        const midA = rot + (i + 0.5) * ((Math.PI * 2) / n);
        const b = 0.5 + 0.5 * Math.cos(midA - lightAngle);
        ctx.beginPath();
        ctx.moveTo(a1[0], a1[1]);
        ctx.lineTo(a2[0], a2[1]);
        ctx.lineTo(cx, pavTipY);
        ctx.closePath();
        ctx.fillStyle = shade(0.08 + b * 0.4);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.08)";
        ctx.stroke();
      }
      for (let j = 0; j < n; j++) {
        const t1 = table[j];
        const t2 = table[(j + 1) % n];
        const c1 = crown[j];
        const c2 = crown[(j + 1) % n];
        const midA2 = rot + (j + 0.5) * ((Math.PI * 2) / n);
        const b2 = 0.5 + 0.5 * Math.cos(midA2 - lightAngle);
        ctx.beginPath();
        ctx.moveTo(t1[0], t1[1]);
        ctx.lineTo(t2[0], t2[1]);
        ctx.lineTo(c2[0], c2[1]);
        ctx.lineTo(c1[0], c1[1]);
        ctx.closePath();
        ctx.fillStyle = shade(0.42 + b2 * 0.58);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.12)";
        ctx.stroke();
      }
      ctx.beginPath();
      table.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.closePath();
      const tb = 0.5 + 0.5 * Math.cos(-Math.PI / 2 - lightAngle);
      ctx.fillStyle = shade(0.7 + tb * 0.35);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.stroke();

      ctx.beginPath();
      crown.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
      ctx.closePath();
      ctx.strokeStyle = "rgba(232,199,102,0.7)";
      ctx.lineWidth = 1.3;
      ctx.stroke();
    }

    function loop() {
      autoDrift += reduce ? 0 : 0.0035;
      targetAngle = -0.9 + targetX * 1.1 + Math.sin(autoDrift) * 0.15;
      lightAngle += (targetAngle - lightAngle) * 0.06;
      curX += (targetX - curX) * 0.06;
      curY += (targetY - curY) * 0.06;
      if (gemWrap) {
        gemWrap.style.transform = `rotateY(${curX * 12}deg) rotateX(${-curY * 12}deg)`;
      }
      drawGem();
      rafId = requestAnimationFrame(loop);
    }

    drawGem();
    if (!reduce) {
      rafId = requestAnimationFrame(loop);
    }

    // animated counters
    const counters = statRefs.current.filter(Boolean) as HTMLElement[];
    const timeoutId = window.setTimeout(() => {
      counters.forEach((el) => {
        const target = parseInt(el.getAttribute("data-count") || "0", 10);
        const suffix = el.getAttribute("data-suffix") || "";
        if (reduce) {
          el.textContent = `${target}${suffix}`;
          return;
        }
        const dur = 1400;
        let start: number | null = null;
        function step(ts: number) {
          if (start === null) start = ts;
          const p = Math.min(1, (ts - start) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = `${Math.round(eased * target)}${p >= 1 ? suffix : ""}`;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, 400);

    return () => {
      if (hero) {
        hero.removeEventListener("mousemove", onMouseMove);
        hero.removeEventListener("mouseleave", onMouseLeave);
      }
      cancelAnimationFrame(rafId);
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <header
      ref={heroRef}
      className="relative flex h-dvh flex-col items-center justify-center overflow-hidden px-6"
      style={{
        padding: "clamp(5rem,12vh,7rem) 1.5rem clamp(1rem,4vh,2rem)",
        background:
          "radial-gradient(ellipse 55% 45% at 50% 30%, rgba(255,58,92,.28), transparent 65%), radial-gradient(ellipse 70% 50% at 20% 85%, rgba(201,162,39,.14), transparent 70%), radial-gradient(ellipse 90% 70% at 80% 100%, rgba(90,10,30,.5), transparent), var(--navy-deep)",
      }}
    >
      <div
        className="pointer-events-none absolute left-1/2 top-[34%] z-0 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 animate-[spin_40s_linear_infinite] blur-[2px]"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(232,199,102,.14) 8deg, transparent 22deg, transparent 60deg, rgba(255,58,92,.12) 70deg, transparent 90deg, transparent 140deg, rgba(232,199,102,.1) 150deg, transparent 170deg, transparent 360deg)",
        }}
        aria-hidden
      />

      <GirihPattern />
      <Charminar />

      <div ref={particleFieldRef} className="pointer-events-none absolute inset-0 z-[2]" />

      <div className="relative z-[6] flex max-h-full w-full max-w-3xl flex-col items-center gap-[clamp(0.5rem,1.8vh,1.1rem)] text-center">
        <div
          ref={gemWrapRef}
          className="relative mx-auto"
          style={{
            width: "clamp(120px,20vh,220px)",
            height: "clamp(120px,20vh,220px)",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          <div
            className="absolute -inset-[22%] -z-10 animate-[breathe_4.2s_ease-in-out_infinite] rounded-full blur-[22px]"
            style={{
              background:
                "radial-gradient(circle, rgba(255,58,92,.65), rgba(232,199,102,.2) 45%, transparent 72%)",
            }}
          />
          <canvas
            ref={canvasRef}
            width={260}
            height={260}
            role="img"
            aria-label="Large glowing faceted ruby gemstone"
            className="relative z-[1] h-full w-full"
          />
          <Sparkle style={{ top: "8%", left: "15%" }} />
          <Sparkle style={{ top: "70%", left: "85%", animationDelay: ".8s" }} />
          <Sparkle style={{ top: "20%", left: "88%", animationDelay: "1.5s" }} />
        </div>

        <div className="flex flex-none flex-wrap justify-center gap-6 text-[0.76rem] uppercase tracking-[0.08em] text-ivory/85">
          <span>21 Nov 2026</span>
          <span>·</span>
          <span>Hyderabad, India</span>
        </div>

        <h1
          className="flex-none text-balance font-display font-bold leading-[1.08] bg-clip-text text-transparent"
          style={{
            fontSize: "clamp(1.9rem, min(6vw, 5.6vh), 4.6rem)",
            backgroundImage:
              "linear-gradient(100deg, var(--pearl) 30%, var(--gold-bright) 50%, var(--pearl) 70%)",
            backgroundSize: "220% 100%",
            animation: "shimmer 7s ease-in-out infinite",
          }}
        >
          The Future Is Written in{" "}
          <span
            className="bg-none text-ruby-hot"
            style={{ WebkitTextFillColor: "var(--ruby-hot)", textShadow: "0 0 34px rgba(255,58,92,.55)" }}
          >
            Ruby
          </span>
        </h1>

        <p
          className="flex-none max-w-[540px] text-balance font-serif-accent italic text-ivory/90"
          style={{
            fontSize: "clamp(1rem, min(2vw, 2.4vh), 1.3rem)",
            fontWeight: 500,
            textShadow: "0 2px 18px rgba(3,3,12,.75), 0 1px 3px rgba(3,3,12,.9)",
          }}
        >
          Where a city built on pearls and granite hands its craft to the next
          generation of open source. Join India&apos;s most passionate Ruby
          community for a day of learning, inspiration, and innovation.
        </p>

        <div className="flex flex-none flex-wrap justify-center gap-4">
          <a
            href="#tickets"
            className="inline-flex items-center gap-2 rounded-full px-8 py-[0.85rem] text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-pearl transition-transform hover:-translate-y-0.5"
            style={{
              background: "linear-gradient(135deg,var(--ruby),var(--ruby-hot))",
              boxShadow: "0 8px 30px rgba(201,31,55,.45)",
            }}
          >
            Get Your Pass
          </a>
          <a
            href="#about"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-[0.85rem] text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-gold-bright backdrop-blur-md transition-transform hover:-translate-y-0.5 hover:bg-white/10"
          >
            Explore Conference
          </a>
        </div>

        <div className="flex flex-none flex-wrap justify-center gap-3">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="min-w-[104px] rounded-2xl border border-white/10 bg-white/5 px-5 py-3 shadow-[0_8px_24px_rgba(0,0,0,.25)] backdrop-blur-md"
            >
              <b
                ref={(el) => {
                  statRefs.current[i] = el;
                }}
                data-count={stat.count}
                data-suffix={stat.suffix}
                className="block font-display text-[1.3rem] font-bold text-gold-bright"
              >
                0
              </b>
              <span className="text-[0.62rem] uppercase tracking-[0.1em] text-ivory/60">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes breathe { 0%,100% { opacity:.7; transform:scale(.95); } 50% { opacity:1; transform:scale(1.08); } }
        @keyframes shimmer { 0%,100% { background-position:0% 50%; } 50% { background-position:100% 50%; } }
        @keyframes twinkle { 0%,100% { opacity:0; transform:scale(.4); } 50% { opacity:1; transform:scale(1.3); } }
        @keyframes rise {
          0% { transform: translateY(0) scale(.5); opacity: 0; }
          12% { opacity: .8; }
          88% { opacity: .3; }
          100% { transform: translateY(-320px) scale(1.1); opacity: 0; }
        }
        .particle { position:absolute; border-radius:50%; opacity:0; animation: rise linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .particle { display:none; }
        }
      `}</style>
    </header>
  );
}

function Sparkle({ style, ...rest }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="absolute h-1 w-1 animate-[twinkle_2.4s_ease-in-out_infinite] rounded-full"
      style={{
        background: "var(--gold-bright)",
        boxShadow: "0 0 8px 2px rgba(232,199,102,.8)",
        ...style,
      }}
      {...rest}
    />
  );
}

function GirihPattern() {
  return (
    <svg className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-25" aria-hidden>
      <defs>
        <pattern id="girihM" width="130" height="130" patternUnits="userSpaceOnUse">
          <path
            d="M65 12 L86 33 L118 33 L97 54 L118 75 L86 75 L65 96 L44 75 L12 75 L33 54 L12 33 L44 33 Z"
            stroke="#e8c766"
            strokeWidth="1"
            fill="none"
            opacity="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#girihM)" />
    </svg>
  );
}

function Charminar() {
  return (
    <div
      className="pointer-events-none absolute bottom-[-2%] left-1/2 z-[1] -translate-x-1/2 opacity-95"
      style={{ width: "min(1300px, 180vw)" }}
      aria-hidden
    >
      <svg viewBox="0 0 600 380" className="h-auto w-full">
        <defs>
          <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c766" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7a611c" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        <g stroke="url(#towerGrad)" strokeWidth="1.6" fill="none" opacity="0.85">
          <rect x="30" y="352" width="540" height="10" fill="rgba(232,199,102,.12)" />
          <rect x="10" y="362" width="580" height="8" fill="rgba(232,199,102,.08)" />
          {[70, 228, 372, 530].map((x, i) => {
            const outer = i === 0 || i === 3;
            const top = outer ? 130 : 96;
            const domeY = outer ? 118 : 82;
            const domeR = outer ? 15 : 17;
            return (
              <g key={x} transform={`translate(${x},0)`}>
                <path
                  d={`M${outer ? -14 : -15} 350 L${outer ? -9 : -10} ${top} L${outer ? 9 : 10} ${top} L${outer ? 14 : 15} 350 Z`}
                  fill="rgba(232,199,102,.05)"
                />
                <line x1={outer ? -11 : -12} y1={outer ? 205 : 185} x2={outer ? 11 : 12} y2={outer ? 205 : 185} />
                <line x1={outer ? -9 : -10} y1={outer ? 165 : 135} x2={outer ? 9 : 10} y2={outer ? 165 : 135} />
                <ellipse cy={domeY} rx={domeR} ry={domeR * 0.73} />
                <line y1={domeY - 12} y2={domeY - 33} />
                <circle cy={domeY - 36} r="2.6" fill="#e8c766" />
              </g>
            );
          })}
          <rect x="190" y="150" width="220" height="4" fill="rgba(232,199,102,.3)" />
          <path d="M255 352 L255 250 Q255 195 300 178 Q345 195 345 250 L345 352" fill="rgba(20,10,20,.55)" />
          <path d="M204 352 L204 270 Q204 235 228 222 Q252 235 252 270 L252 352" fill="rgba(20,10,20,.4)" />
          <path d="M348 352 L348 270 Q348 235 372 222 Q396 235 396 270 L396 352" fill="rgba(20,10,20,.4)" />
        </g>
        <circle className="animate-[flicker_3.4s_ease-in-out_infinite]" cx="228" cy="250" r="4" fill="#ffb84d" />
        <circle
          className="animate-[flicker_3.4s_ease-in-out_infinite]"
          style={{ animationDelay: ".6s" }}
          cx="372"
          cy="250"
          r="4"
          fill="#ffb84d"
        />
        <circle
          className="animate-[flicker_3.4s_ease-in-out_infinite]"
          style={{ animationDelay: "1.3s" }}
          cx="300"
          cy="230"
          r="5"
          fill="#ff8f5c"
        />
        <circle
          className="animate-[flicker_3.4s_ease-in-out_infinite]"
          style={{ animationDelay: "2s" }}
          cx="300"
          cy="290"
          r="4"
          fill="#ffb84d"
        />
      </svg>
      <style>{`@keyframes flicker { 0%,100% { opacity:.35; } 50% { opacity:1; } }`}</style>
    </div>
  );
}
