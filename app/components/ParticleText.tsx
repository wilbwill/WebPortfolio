// const _C = document.getElementById('c'), 
// 			CT = _C.getContext('2d'), 
// 			DIR = ['x', 'y'], 
// 			TEXTBOX = { str: 'HOVER!' }, 
// 			PALETTE = ['ffad70', 'f7d297', 'edb9a1', 'e697ac', 'b38dca',
// 								 '9c76db', '705cb5', '43428e', '2c2142'], 
// 			POINTER = {},
// 			PARTICLES = [], 
// 			N = PALETTE.length - 1;

// let rid = null;

// function rand(max = 1, min = 0, dec = 0) {
// 	return +(min + Math.random()*(max - min)).toFixed(dec)
// }

// class Particle {
// 	constructor(x, y, rgb = [rand(128), rand(128), rand(128)]) {
// 		/* original/ initial position */
// 		this.ox = x;
// 		this.oy = y;
// 		/* current position */
// 		this.cx = this.ox;
// 		this.cy = this.oy;
// 		/* original/ intial particle radius */
// 		this.or = rand(1, 5);
// 		this.cr = this.or;
// 		this.pv = 0;
// 		this.ov = 0;
// 		this.f = rand(95, 65);
// 		/* particle RGB */
// 		this.rgb = rgb.map(c => Math.max(0, c + rand(-13, 13)));
// 	}
	
// 	draw() {
// 		/* only drawing on canvas stuff */
// 		CT.fillStyle = `rgb(${this.rgb})`
// 		CT.beginPath();
// 		CT.arc(this.cx, this.cy, this.cr, 0, 2*Math.PI);
// 		CT.closePath();
// 		CT.fill()
// 	}
	
// 	move() {
// 		/* only particle motion stuff */
// 		if(POINTER.x && POINTER.y) {
// 			let pdx = this.cx - POINTER.x, 
// 					pdy = this.cy - POINTER.y, 
// 					pd = Math.hypot(pdx, pdy), 
// 					pa = Math.atan2(pdy, pdx), 
// 					odx = this.ox - this.cx, 
// 					ody = this.oy - this.cy, 
// 					od = Math.hypot(odx, ody), 
// 					oa = Math.atan2(ody, odx);
			
// 			/* oversimplified version where velocity is 
// 			 * inversely proportional to distance squared */
// 			this.pv = this.f*Math.max(1, 1/Math.pow(pd, 1));
// 			this.ov = od ? this.f*Math.max(1, 1/Math.pow(od, 1)) : 0;
			
// 			this.cx += Math.round(this.pv*Math.cos(pa) + this.ov*Math.cos(oa));
// 			this.cy += Math.round(this.pv*Math.sin(pa) + this.ov*Math.sin(oa));
// 		}
		
// 		this.draw()
// 	}
// }

// function dottify() {	
// 	let data = CT.getImageData(TEXTBOX.x, TEXTBOX.y, TEXTBOX.w, TEXTBOX.h).data,
// 			pixa = data.reduce((a, c, i, o) => {
// 				if(i%4 === 0) a.push({ x: (i/4)%TEXTBOX.w, y: ~~(i/4/TEXTBOX.w), rgb: o.slice(i, i + 4) });
// 				return a
// 			}, []).filter(c => c.rgb[3] && !(c.x%4) && !(c.y%4));
	
// 	CT.clearRect(0, 0, _C.width, _C.height);
// 	pixa.forEach((c, i) => {
// 		PARTICLES[i] = new Particle(TEXTBOX.x + c.x, TEXTBOX.y + c.y, c.rgb.slice(0, -1));
// 		PARTICLES[i].draw()
// 	});
// 	PARTICLES.splice(pixa.length, 99999)
// }

// function write() {
// 	CT.font = `900 ${TEXTBOX.h}px verdana, sans-serif`;
// 	CT.textAlign = 'center';
// 	CT.textBaseline = 'middle';
// 	CT.letterSpacing = '8px';
	
// 	TEXTBOX.w = Math.round(CT.measureText(TEXTBOX.str).width);
// 	TEXTBOX.x = .5*(_C.width - TEXTBOX.w);
// 	TEXTBOX.y = .5*(_C.height - TEXTBOX.h);
	
// 	let grd = CT.createLinearGradient(TEXTBOX.x, TEXTBOX.y, TEXTBOX.x + TEXTBOX.w, TEXTBOX.y + TEXTBOX.h);
// 	PALETTE.forEach((c, i) => grd.addColorStop(i/N, `#${c}`));
// 	CT.fillStyle = grd;
	
// 	CT.fillText(TEXTBOX.str, .5*_C.width, .5*_C.height);
	
// 	dottify()
// }

// function animate() {
// 	CT.clearRect(0, 0, _C.width, _C.height);
	
// 	PARTICLES.forEach(c => c.move());
	
// 	rid = requestAnimationFrame(animate)
// }

// /* size canvas so it covers current window size */
// function size() {
// 	if(rid) {
// 		for(let i = 0; i < PARTICLES.length; i++) PARTICLES.pop()
// 		cancelAnimationFrame(rid)
// 		rid = null
// 	}
	
// 	CT.clearRect(0, 0, _C.width, _C.height);
// 	['width', 'height'].forEach(c => _C[c] = +getComputedStyle(_C)[c].slice(0, -2));
// 	TEXTBOX.h = ~~(_C.width/TEXTBOX.str.length);
	
// 	write()
// }

// addEventListener('resize', size);

// addEventListener('pointermove', e => {
// 	DIR.forEach(c => POINTER[c] = e[c]);
// 	if(!rid) animate()
// });

// (_ => { size() })();