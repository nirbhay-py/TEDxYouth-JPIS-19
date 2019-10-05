
const random = (min, max) => {
  return (max === undefined) ? ((min === undefined) ? Math.random() : Math.random() * min) : Math.random() * (max - min) + min;
};

// -1.0 ~ 1.0
const randomf = () => {
  return Math.random() * 2.0 - 1.0;
};

// is value inside range?
const inRange = (v, min, max) => {
  return (v >= min) && (v <= max);
};

// min <= v <= max
var clamp = (v, min, max) => {
  return Math.max(Math.min(v, max), min);
};

// Color Utils
//------------------------------
// in : 0 <=  r, g, b  <= 255
// out: 0 <= [h, s, b] <= 255
const rgbToHsb = (r, g, b) => {
  let max = r;
  if(g > max) max = g;
  if(b > max) max = b;

  let min = r;
  if(g < min) min = g;
  if(b < min) min = b;

  // gray
  if(max === min) return [0, 0, max];

  let h6th;
  if(r === max) {
    h6th = (g - b) / (max - min);
    if(h6th < 0) h6th += 6;
  }
  else if(g === max) {
    h6th = 2 + (b - r) / (max - min);
  }
  else {
    h6th = 4 + (r - g) / (max - min);
  }
  return [255 * h6th / 6, 255 * (max - min) / max, max];
};

// in : 0 <=  h, s, b  <= 255
// out: 0 <= [r, g, b] <= 255
const hsbToRgb = (h, s, b) => {
  s = clamp(s, 0, 255);
  b = clamp(b, 0, 255);
  if(b == 0) { // black
    return [0, 0, 0];
  }
  else if(s == 0) { // grays
    return [b, b, b];
  }
  else {
    const h6 = h * 6 / 255;
    const sNrm = s / 255;
    const h6Cat = parseInt(h6);
    const h6Rem = h6 - h6Cat;
    const pv = ((1 - sNrm) * b);
    const qv = ((1 - sNrm * h6Rem) * b);
    const tv = ((1 - sNrm * (1 - h6Rem)) * b);
    switch(h6Cat) {
      case 0: case 6: // r
        return [b, tv, pv];
      case 1: // g
        return [qv, b, pv];
      case 2:
        return [pv, b, tv];
      case 3: // b
        return [pv, qv, b];
      case 4:
        return [tv, pv, b];
      case 5: // back to r
        return [b, pv, qv];
    }
  }
};

// resolution
//------------------------------
const res = {
  w: 0,
  h: 0
};

//------------------------------
class Particle {
  constructor(x, y, r, rgba) {
    this.x = x;
    this.y = y;
    const dirAngle = randomf() * Math.PI;
    const strength = random(2, 4.0);
    this.vx = Math.cos(dirAngle) * strength;
    this.vy = Math.sin(dirAngle) * strength;
    this.r = r;
    this.angle = 10;
    this.anglePlus = randomf() * Math.PI * 0.01;
    this.rgba = [...rgba];// 元の色を操作しないためにコピーを代入
    this.dead = false;
  }

  update(sec) {
    this.vy -= 0.1;
    this.vy *= 1.01;

    this.x += this.vx;
    this.y += this.vy;

    this.angle += this.anglePlus;
    const isInside = inRange(this.x, -this.r, res.w + this.r) && inRange(this.y, -this.r, res.h + this.r);
    if(!isInside) {
      this.dead = true;
      return;
    }

    if(this.r > 0.5) {
      this.r -= this.r * 0.025;
    }
    else {
      this.r = 0;
      this.dead = true;
    }
  }

  draw(ctx) {
    ctx.save();
    {
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);

      ctx.fillStyle = `rgba(${ this.rgba.toString() })`;

      ctx.beginPath();
      ctx.arc(0, 0, this.r, 0, Math.PI * 2, false);
      ctx.fill();
    }
    ctx.restore();
  }
};

//------------------------------
class Particles {
  constructor(rgb) {
    this.arr = [];
    this._rgb = rgb;
  }

  set rgb(rgb) {
    this._rgb = rgb;
  }

  get rgb() {
    return this._rgb;
  }

  get length() {
    return this.arr.length;
  }

  add(x, y) {
    const radius = random(5, 40);
    const hsb = rgbToHsb(...this._rgb);
    const hue = (hsb[0] + random(10)) % 255;
    const rgb = hsbToRgb(hue, hsb[1], hsb[2]);
    const rgba = [...rgb, 1];
    this.arr.push(new Particle(x, y, radius, rgba));
  }

  update(sec) {
    for(let i = this.arr.length - 1; i >= 0; --i) {
      this.arr[i].update(sec);
      if(this.arr[i].dead) this.arr.splice(i, 1);
    }
  }

  draw(ctx) {
    for(const p of this.arr) p.draw(ctx);
  }
};

//------------------------------
class Button {
  constructor(btnId, blurRadius) {
    this.element = document.getElementById(btnId);
    this.rect = this.element.getBoundingClientRect();
    this.r = this.rect.width / 2;
    this.rgba = getComputedStyle(this.element)['background-color'];
    this.offsetRadius = -blurRadius;
    this.isHover = true;

    this.element.addEventListener('mouseenter', _ => this.mouseEnter());
    this.element.addEventListener('mouseleave', _ => this.mouseLeave());
  }

  get rgb() {
    return this.rgba.match(/\d+/g).slice(0, 3).map(v => parseInt(v));
  }

  update(sec) {
    this.rect = this.element.getBoundingClientRect();
    this.r = this.rect.width / 2;
    this.rgba = getComputedStyle(this.element)['background-color'];
  }

  draw(ctx) {
    ctx.save();
    {
      ctx.fillStyle = `rgb(${ this.rgb.toString() })`;
      ctx.beginPath();
      ctx.arc(this.rect.left + this.r, this.rect.top + this.r, this.r + this.offsetRadius, 0, Math.PI * 2, false);
      ctx.fill();
    }
    ctx.restore();
  }
};

//------------------------------
class Canvas {
  constructor(canvasId) {
    this.eCanvas = document.getElementById(canvasId);
    this.ctx = this.eCanvas.getContext('2d');

    this.resize();

    // フィルターのブラー半径を取得
    const eFilter = document.getElementById('metaball');
    const eBlur = eFilter.querySelector('feGaussianBlur');
    const blurAmt = parseInt(eBlur.getAttribute('stdDeviation'));

    this.btn = new Button('btn-circle', blurAmt);
    this.particles = new Particles(this.btn.rgb);

    this.frame = 0;
    this.isSleeping = false;
    this.draw(this.ctx);// start animation
  }

  update(sec) {
    this.btn.update(sec);

    if(this.particles.rgb.toString() != this.btn.rgb.toString()) {
      this.particles.rgb = this.btn.rgb;
      this.frame = 0;// force re-draw
    }

    if(this.btn.isHover) this.particles.add(res.w / 2, res.h / 2);
    this.particles.update(sec);
    this.isSleeping = (this.frame > 0) && (this.particles.length === 0);
  }

  draw(ctx) {
    this.update(performance.now() / 1000);
    this.frame = window.requestAnimationFrame(_ => this.draw(ctx));

    // 動いていないときは再描画しない
    if(this.isSleeping) return;

    ctx.clearRect(0, 0, res.w, res.h);

    ctx.save();
    {
      ctx.globalCompositeOperation = 'screen';

      this.btn.draw(ctx);
      this.particles.draw(ctx);
    }
    ctx.restore();
  }

  resize() {
    this.eCanvas.width = res.w;
    this.eCanvas.height = res.h;
    this.frame = 0;// force re-draw
  }
};

//------------------------------
class Page {
  constructor() {
    this.resize();

    const canvas = new Canvas('canvas');

    window.addEventListener('resize', e => {
      this.resize();
      canvas.resize();
    });
  }

  resize() {
    res.w = window.innerWidth;
    res.h = window.innerHeight;
  }
};

//------------------------------
window.addEventListener('DOMContentLoaded', () => {
  const page = new Page();
});
