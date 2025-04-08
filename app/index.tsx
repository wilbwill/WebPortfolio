import { Image, StyleSheet, Text, View } from "react-native";
// import  ParticleText  from "@/app/components/ParticleText";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1D3D47",
        padding: 16,
      }}
    >
      <canvas id="c" style={{ width: "100%", height: "100%" }}></canvas>
    </View>
  );
}

const _C = document.getElementById("c") as HTMLCanvasElement,
    ctx = _C.getContext("2d");
let TEXTBOX = { 'str': "WILBUR!", 'x':0, 'y':0, 'w': 0, 'h': 0 };
const PALETTE = [
    "ffad70",
    "f7d297",
    "edb9a1",
    "e697ac",
    "b38dca",
    "9c76db",
    "705cb5",
    "43428e",
    "2c2142",
  ],
  POINTER: { clientX?: string; clientY?: string, h?: string, w?: string } = {},
  DIR: (keyof typeof POINTER)[] = ['clientX', 'clientY'],
  PARTICLES: Particle[] = [],
  N = PALETTE.length - 1;

let rid: number | null = null;

function rand(max = 1, min = 0, dec = 0) {
  return +(min + Math.random() * (max - min)).toFixed(dec);
}

class Particle {
  ox: number;
  oy: number;
  cx: number;
  cy: number;
  or: number;
  cr: number;
  pv: number;
  ov: number;
  f: number;
  rgb: [number, number, number];

  constructor(
    x: number,
    y: number,
    rgb: [number, number, number] = [rand(128), rand(128), rand(128)]
  ) {
    /* original/ initial position */
    this.ox = x;
    this.oy = y;
    /* current position */
    this.cx = this.ox;
    this.cy = this.oy;
    /* original/ intial particle radius */
    this.or = rand(1, 5);
    this.cr = this.or;
    this.pv = 0;
    this.ov = 0;
    this.f = rand(95, 65);
    /* particle RGB */
    this.rgb = rgb.map((c) => Math.max(0, c + rand(-13, 13))) as [
      number,
      number,
      number
    ];
  }

  draw() {
    /* only drawing on canvas stuff */
    if (ctx !== null) {
      ctx.fillStyle = `rgb(${this.rgb})`;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.cr, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
    }
    
  }

  move() {
    /* only particle motion stuff */
    if (POINTER.clientX && POINTER.clientY) {
      let pdx = this.cx - Number(POINTER.clientX),
        pdy = this.cy - Number(POINTER.clientY || 0),
        /* distance from pointer to particle */
        pd = Math.hypot(pdx, pdy),
        /* angle from pointer to particle */
        pa = Math.atan2(pdy, pdx),
        /* distance from original to current position */
        odx = this.ox - this.cx,
        /* angle from original to current position */
        ody = this.oy - this.cy,
        /* distance from original to current position */
        od = Math.hypot(odx, ody),
        /* angle from original to current position */
        oa = Math.atan2(ody, odx);

      /* oversimplified version where velocity is 
       * inversely proportional to distance squared */
      this.pv = this.f * Math.max(1, 1 / Math.pow(pd, 1));
      this.ov = od ? this.f * Math.max(1, 1 / Math.pow(od, 1)) : 0;

      this.cx += Math.round(
        this.pv * Math.cos(pa) + this.ov * Math.cos(oa)
      );
      this.cy += Math.round(
        this.pv * Math.sin(pa) + this.ov * Math.sin(oa)
      );
    }

    this.draw();
  }
}

function dottify() {
  if (ctx === null) return;
  let data = ctx.getImageData(TEXTBOX.x, TEXTBOX.y, TEXTBOX.w, TEXTBOX.h).data,
      pixa = data.reduce((a: { x: number; y: number; rgb: number[] }[], c, i, o) => {
        if (i % 4 === 0) a.push({ x: (i / 4) % TEXTBOX.w, y: ~~(i / 4 / TEXTBOX.w), rgb: Array.from(o.slice(i, i + 4)) });
        return a;
      }, []).filter(c => c.rgb[3] && !(c.x % 4) && !(c.y % 4));
  
  ctx.clearRect(0, 0, _C.width, _C.height);
  pixa.forEach((c, i) => {
    PARTICLES[i] = new Particle(
      TEXTBOX.x + c.x,
      TEXTBOX.y + c.y,
      [c.rgb[0] || 0, c.rgb[1] || 0, c.rgb[2] || 0] as [number, number, number]
    );
    PARTICLES[i].draw()
  });
  PARTICLES.splice(pixa.length, 99999)
}

function write() {
  if (ctx === null) return;
  ctx.font = `900 ${TEXTBOX.h}px verdana, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.letterSpacing = '8px';
  
  TEXTBOX.w = Math.round(ctx.measureText(TEXTBOX.str).width);
  TEXTBOX.x = .5*(_C.width - TEXTBOX.w);
  TEXTBOX.y = .5*(_C.height - TEXTBOX.h);
  
  let grd = ctx.createLinearGradient(TEXTBOX.x, TEXTBOX.y, TEXTBOX.x + TEXTBOX.w, TEXTBOX.y + TEXTBOX.h);
  PALETTE.forEach((c, i) => grd.addColorStop(i/N, `#${c}`));
  ctx.fillStyle = grd;
  
  ctx.fillText(TEXTBOX.str, .5*_C.width, .5*_C.height);
  
  dottify()
}

function animate() {
  if (ctx === null) return;
  ctx.clearRect(0, 0, _C.width, _C.height);
  
  PARTICLES.forEach(c => c.move());
  
  rid = requestAnimationFrame(animate)
}

/* size canvas so it covers current window size */
function size() {
  if (ctx === null) return;
  if(rid) {
    for(let i = 0; i < PARTICLES.length; i++) PARTICLES.pop()
    cancelAnimationFrame(rid)
    rid = null
  }
  
  ctx.clearRect(0, 0, _C.width, _C.height);
  _C.width = +getComputedStyle(_C).width.slice(0, -2);
  _C.height = +getComputedStyle(_C).height.slice(0, -2);
  TEXTBOX.h = ~~(_C.width/TEXTBOX.str.length);
  
  write()
}

addEventListener('resize', size);
addEventListener('pointermove', ev => {
  DIR.forEach(c => {
    const value = ev[c as keyof PointerEvent];
    POINTER[c] = value !== null ? String(value) : undefined;
  });
  if(!rid) animate()
});

(_ => { size() })();


