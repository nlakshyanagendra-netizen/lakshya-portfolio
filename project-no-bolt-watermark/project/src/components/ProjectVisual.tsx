import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks';
import type { Project } from '@/config/site';

/**
 * Original SVG/Canvas illustrations per project visualKind.
 * Generated — clearly not photographs. Each is a small animated scene.
 */
export default function ProjectVisual({ project, className }: { project: Project; className?: string }) {
  const reduced = usePrefersReducedMotion();
  switch (project.visualKind) {
    case 'tesla': return <Tesla reduced={reduced} className={className} />;
    case 'electrostatic': return <Electrostatic reduced={reduced} className={className} />;
    case 'ultrasonic': return <Ultrasonic reduced={reduced} className={className} />;
    case 'pipeline': return <Pipeline reduced={reduced} className={className} />;
    case 'hand': return <Hand reduced={reduced} className={className} />;
    case 'faces': return <Faces reduced={reduced} className={className} />;
    case 'maze': return <Maze reduced={reduced} className={className} />;
    default: return null;
  }
}

function Frame({ children, label, className }: { children: React.ReactNode; label: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-deep border border-line ${className ?? ''}`}>
      <div className="absolute inset-0 grid-bg opacity-30" />
      {children}
      <span className="absolute top-2 left-3 mono text-[0.6rem] tracking-[0.2em] text-fg-dim z-10">
        {label}
      </span>
    </div>
  );
}

function Tesla({ reduced, className }: { reduced: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf = 0, t = 0;
    const dpr = Math.min(2, devicePixelRatio || 1);
    const resize = () => {
      c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize(); window.addEventListener('resize', resize);
    const draw = () => {
      t++;
      const w = c.clientWidth, h = c.clientHeight;
      ctx.clearRect(0,0,w,h);
      const cx = w/2, cy = h/2 + 10;
      // coil tower
      ctx.fillStyle = 'rgba(30,40,60,0.6)';
      ctx.fillRect(cx-10, cy-50, 20, 90);
      for (let i=0;i<14;i++){
        ctx.strokeStyle = 'rgba(67,230,255,0.25)';
        ctx.beginPath(); ctx.moveTo(cx-10, cy-48+i*6); ctx.lineTo(cx+10, cy-48+i*6); ctx.stroke();
      }
      // top sphere
      ctx.beginPath(); ctx.arc(cx, cy-58, 14, 0, Math.PI*2);
      ctx.fillStyle = 'rgba(120,180,255,0.3)'; ctx.fill();
      // discharges
      if (!reduced && t % 14 === 0) {
        for (let d=0; d<3; d++){
          const ang = Math.random()*Math.PI*2;
          ctx.beginPath();
          ctx.moveTo(cx, cy-58);
          let px = cx, py = cy-58;
          const steps = 6, len = 60 + Math.random()*60;
          for (let s=1;s<=steps;s++){
            px = cx + Math.cos(ang)*(len/steps*s) + (Math.random()-0.5)*16;
            py = cy-58 + Math.sin(ang)*(len/steps*s) + (Math.random()-0.5)*16;
            ctx.lineTo(px, py);
          }
          ctx.strokeStyle = 'rgba(180,230,255,0.8)'; ctx.lineWidth = 1.4;
          ctx.shadowColor = '#43e6ff'; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
        }
      }
      raf = requestAnimationFrame(draw);
    };
    if (!reduced) draw(); else { resize(); draw(); }
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, [reduced]);
  return <Frame label="ILLUSTRATION · TESLA COIL" className={className}><canvas ref={ref} className="w-full h-full min-h-[200px]"/></Frame>;
}

function Electrostatic({ reduced, className }: { reduced: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf=0, t=0;
    const dpr = Math.min(2, devicePixelRatio||1);
    const resize=()=>{c.width=c.clientWidth*dpr;c.height=c.clientHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
    resize(); window.addEventListener('resize', resize);
    const draw=()=>{
      t++;
      const w=c.clientWidth,h=c.clientHeight;
      ctx.clearRect(0,0,w,h);
      // two electrodes
      const lx = w*0.25, rx = w*0.75, cy = h/2;
      ctx.fillStyle='rgba(67,230,255,0.5)';
      ctx.beginPath(); ctx.arc(lx,cy,18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='rgba(255,180,84,0.5)';
      ctx.beginPath(); ctx.arc(rx,cy,18,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#fff'; ctx.font='14px monospace';
      ctx.fillText('+',lx-4,cy+4); ctx.fillText('−',rx-4,cy+4);
      // field lines
      for (let i=0;i<7;i++){
        ctx.strokeStyle=`rgba(67,230,255,${0.1+0.05*Math.sin(t*0.05+i)})`;
        ctx.beginPath();
        const yo = (i-3)*14;
        ctx.moveTo(lx+18, cy+yo);
        ctx.bezierCurveTo(w*0.4, cy+yo*1.6, w*0.6, cy+yo*1.6, rx-18, cy+yo);
        ctx.stroke();
      }
      // levitating particle
      const py = cy - 40 + (reduced?0:Math.sin(t*0.05)*8);
      ctx.beginPath(); ctx.arc(w/2, py, 5, 0, Math.PI*2);
      ctx.fillStyle='#8bf1ff'; ctx.shadowColor='#43e6ff'; ctx.shadowBlur=14; ctx.fill(); ctx.shadowBlur=0;
      // gravity arrow
      ctx.strokeStyle='rgba(255,180,84,0.6)'; ctx.beginPath();
      ctx.moveTo(w/2, py+10); ctx.lineTo(w/2, py+30);
      ctx.stroke();
      raf=requestAnimationFrame(draw);
    };
    if(!reduced) draw(); else {resize(); draw();}
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener('resize', resize);};
  },[reduced]);
  return <Frame label="ILLUSTRATION · ELECTROSTATIC LEVITATION" className={className}><canvas ref={ref} className="w-full h-full min-h-[200px]"/></Frame>;
}

function Ultrasonic({ reduced, className }: { reduced: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf=0,t=0;
    const dpr=Math.min(2,devicePixelRatio||1);
    const resize=()=>{c.width=c.clientWidth*dpr;c.height=c.clientHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
    resize(); window.addEventListener('resize',resize);
    const draw=()=>{
      t++;
      const w=c.clientWidth,h=c.clientHeight;
      ctx.clearRect(0,0,w,h);
      const topY=24, botY=h-24, cx=w/2;
      // transducers
      ctx.fillStyle='rgba(120,140,180,0.6)';
      ctx.fillRect(cx-60,topY-10,120,10);
      ctx.fillRect(cx-60,botY,120,10);
      // wavefronts
      for (let i=0;i<8;i++){
        const phase = reduced ? 0 : (t*0.04 + i*0.4) % 1;
        const yT = topY + phase*(h-48);
        const yB = botY - phase*(h-48);
        ctx.strokeStyle=`rgba(67,230,255,${0.25*(1-phase)})`;
        ctx.beginPath(); ctx.moveTo(cx-70,yT); ctx.lineTo(cx+70,yT); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx-70,yB); ctx.lineTo(cx+70,yB); ctx.stroke();
      }
      // node particle
      ctx.beginPath(); ctx.arc(cx, h/2, 6, 0, Math.PI*2);
      ctx.fillStyle='#8bf1ff'; ctx.shadowColor='#43e6ff'; ctx.shadowBlur=16; ctx.fill(); ctx.shadowBlur=0;
      // labels
      ctx.fillStyle='rgba(138,148,173,0.7)'; ctx.font='10px monospace';
      ctx.fillText('TRANSDUCER', cx-30, topY-14);
      ctx.fillText('TRANSDUCER', cx-30, botY+18);
      raf=requestAnimationFrame(draw);
    };
    if(!reduced) draw(); else {resize(); draw();}
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener('resize',resize);};
  },[reduced]);
  return <Frame label="ILLUSTRATION · ACOUSTIC LEVITATION" className={className}><canvas ref={ref} className="w-full h-full min-h-[200px]"/></Frame>;
}

function Pipeline({ reduced, className }: { reduced: boolean; className?: string }) {
  const steps = ['Fetch', 'Hash', 'Compare', 'Notify'];
  return (
    <Frame label="ILLUSTRATION · DATA PIPELINE" className={className}>
      <div className="absolute inset-0 flex items-center justify-center gap-2 px-6 py-10">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`panel px-3 py-3 text-center ${reduced?'':'animate-fade-up'}`} style={{animationDelay:`${0.1+i*0.15}s`}}>
              <div className="mono text-xs text-cyan">{s}</div>
            </div>
            {i < steps.length-1 && <div className="w-6 h-px bg-cyan/40 relative">
              {!reduced && <span className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-soft" style={{animationDelay:`${0.3+i*0.15}s`}} />}
            </div>}
          </div>
        ))}
      </div>
    </Frame>
  );
}

function Hand({ reduced, className }: { reduced: boolean; className?: string }) {
  return (
    <Frame label="ILLUSTRATION · HAND GESTURE" className={className}>
      <svg viewBox="0 0 200 140" className="w-full h-full">
        <g stroke="#43e6ff" strokeWidth="1.5" fill="none" strokeLinecap="round">
          <path d="M70 120 L70 90 L60 60 L70 58 L80 78 M80 78 L80 50 L92 48 L92 76 M92 76 L92 44 L104 42 L104 74 M104 74 L104 48 L116 46 L116 72" />
          <path d="M70 90 L116 72" />
          <circle cx="60" cy="58" r="2.5" fill="#43e6ff" />
          <circle cx="80" cy="50" r="2.5" fill="#43e6ff" />
          <circle cx="92" cy="44" r="2.5" fill="#43e6ff" />
          <circle cx="104" cy="42" r="2.5" fill="#43e6ff" />
          <circle cx="116" cy="46" r="2.5" fill="#43e6ff" />
        </g>
        {!reduced && <circle cx="92" cy="44" r="10" fill="none" stroke="#43e6ff" opacity="0.5" className="animate-pulse-soft" />}
        <text x="140" y="70" fontFamily="monospace" fontSize="10" fill="#8a94ad">FINGERS=2</text>
        <text x="140" y="84" fontFamily="monospace" fontSize="10" fill="#43e6ff">→ TASK[1]</text>
      </svg>
    </Frame>
  );
}

function Faces({ reduced, className }: { reduced: boolean; className?: string }) {
  return (
    <Frame label="ILLUSTRATION · FACE DETECTION" className={className}>
      <svg viewBox="0 0 220 140" className="w-full h-full">
        <g fill="none" strokeWidth="1.5">
          <rect x="30" y="30" width="60" height="70" stroke="#43e6ff" rx="6">
            {!reduced && <animate attributeName="stroke-opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite" />}
          </rect>
          <rect x="120" y="40" width="60" height="60" stroke="#ffb454" rx="6">
            {!reduced && <animate attributeName="stroke-opacity" values="0.9;0.4;0.9" dur="2s" begin="0.6s" repeatCount="indefinite" />}
          </rect>
          <text x="30" y="24" fontFamily="monospace" fontSize="9" fill="#43e6ff">FACE 1</text>
          <text x="120" y="34" fontFamily="monospace" fontSize="9" fill="#ffb454">FACE 2</text>
        </g>
        <g transform="translate(20 110)">
          <rect width="180" height="20" rx="4" fill="rgba(120,140,180,0.2)" stroke="rgba(140,170,220,0.3)" />
          <rect width="58" height="20" rx="4" fill="rgba(67,230,255,0.25)" />
          <text x="6" y="14" fontFamily="monospace" fontSize="9" fill="#d8e0f0">TAB A</text>
          <text x="66" y="14" fontFamily="monospace" fontSize="9" fill="#8a94ad">TAB B</text>
          <text x="126" y="14" fontFamily="monospace" fontSize="9" fill="#8a94ad">TAB C</text>
        </g>
      </svg>
    </Frame>
  );
}

function Maze({ reduced, className }: { reduced: boolean; className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf=0, t=0;
    const dpr=Math.min(2,devicePixelRatio||1);
    const cells = [
      "1111111111",
      "1000000001",
      "1011101101",
      "1010001001",
      "1010111101",
      "1010000001",
      "1011111101",
      "1000000001",
      "1011111101",
      "1111111111",
    ];
    const path = [[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7],[1,8],[2,8],[3,8],[3,7],[3,6],[5,6],[5,7],[5,8],[7,8],[8,8]];
    const resize=()=>{c.width=c.clientWidth*dpr;c.height=c.clientHeight*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);};
    resize(); window.addEventListener('resize',resize);
    const draw=()=>{
      t++;
      const w=c.clientWidth,h=c.clientHeight;
      ctx.clearRect(0,0,w,h);
      const cs = Math.min(w/10, h/10);
      const ox = (w - cs*10)/2, oy=(h-cs*10)/2;
      // walls
      for (let y=0;y<10;y++) for (let x=0;x<10;x++){
        if (cells[y][x]==='1'){
          ctx.fillStyle='rgba(120,140,180,0.18)';
          ctx.fillRect(ox+x*cs, oy+y*cs, cs, cs);
        }
      }
      // planned path
      ctx.strokeStyle='rgba(67,230,255,0.35)';
      ctx.lineWidth=2; ctx.beginPath();
      path.forEach((p,i)=>{
        const px = ox+p[0]*cs+cs/2, py=oy+p[1]*cs+cs/2;
        if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
      });
      ctx.stroke();
      // robot moving along path
      const idx = reduced ? 0 : Math.floor((t*0.03) % path.length);
      const [rx,ry] = path[idx];
      const rpx = ox+rx*cs+cs/2, rpy=oy+ry*cs+cs/2;
      ctx.beginPath(); ctx.arc(rpx, rpy, cs*0.28, 0, Math.PI*2);
      ctx.fillStyle='#43e6ff'; ctx.shadowColor='#43e6ff'; ctx.shadowBlur=12; ctx.fill(); ctx.shadowBlur=0;
      // trail
      for (let i=1;i<5;i++){
        const pi = (idx - i + path.length) % path.length;
        const [px,py] = path[pi];
        ctx.beginPath();
        ctx.arc(ox+px*cs+cs/2, oy+py*cs+cs/2, cs*0.1, 0, Math.PI*2);
        ctx.fillStyle=`rgba(67,230,255,${0.3-i*0.06})`; ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    };
    if(!reduced) draw(); else {resize(); draw();}
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener('resize',resize);};
  },[reduced]);
  return <Frame label="VISUALIZATION · SIMULATED MAZE PATH" className={className}><canvas ref={ref} className="w-full h-full min-h-[200px]"/></Frame>;
}
