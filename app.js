'use strict';
var WEDDING_DATE = new Date('2026-11-22T10:50:00+05:30');

// ── ENVELOPE — tap the wax seal to open ──
var envSealWrap = document.getElementById('envSealWrap');
var waxSealFront = document.getElementById('waxSealFront');
var tapHint     = document.getElementById('tapHint');
var envWrap     = document.getElementById('envelopeWrap');
var envOverlay  = document.getElementById('envelope-overlay');
var mainWeb     = document.getElementById('main-website');
var sealOpened  = false;

function crackAndOpen() {
  if (sealOpened) return;
  sealOpened = true;

  // 1. Crack animation on the seal
  if (envSealWrap)  envSealWrap.classList.add('cracking');
  if (waxSealFront) waxSealFront.classList.add('cracking');

  // 2. Flap opens after crack finishes (~550ms)
  setTimeout(function() {
    if (envWrap) envWrap.classList.add('opening');
  }, 500);

  // 3. Overlay slides up
  setTimeout(function() {
    if (envOverlay) {
      envOverlay.style.transform  = 'translateY(-100%)';
      envOverlay.style.transition = 'transform .9s cubic-bezier(.4,0,.2,1)';
    }
  }, 1050);

  // 4. Show main website
  setTimeout(function() {
    if (mainWeb) {
      mainWeb.style.display = 'block';
      requestAnimationFrame(function() {
        mainWeb.classList.add('visible');
        initReveal();
        startSparkles();
        startParallax();
      });
    }
    document.body.style.overflow = 'auto';
  }, 1150);

  // 5. Remove overlay from DOM
  setTimeout(function() {
    if (envOverlay) envOverlay.style.display = 'none';
  }, 2100);

  // 6. Start typewriter
  setTimeout(function() {
    typeHeroQuote();
  }, 1900);
}

// Click or keyboard on the seal wrap
if (envSealWrap) {
  envSealWrap.addEventListener('click', crackAndOpen);
  envSealWrap.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); crackAndOpen(); }
  });
}

// ── TYPEWRITER HERO QUOTE ──
var heroQuoteEl = document.getElementById('heroQuote');
var quoteText   = '"Two Hearts. One Beautiful Journey."';
var qtIndex     = 0;
function typeHeroQuote() {
  if (!heroQuoteEl) return;
  var textSpan = heroQuoteEl.querySelector('.hero-quote-text') || heroQuoteEl;
  var cursor = heroQuoteEl.querySelector('.hero-quote-cursor');
  if (qtIndex <= quoteText.length) {
    textSpan.textContent = quoteText.slice(0, qtIndex);
    qtIndex++;
    setTimeout(typeHeroQuote, 42);
  } else if (cursor) {
    cursor.classList.add('cursor-idle');
  }
}

// ── COUNTDOWN ──
var elDays    = document.getElementById('cdDays');
var elHours   = document.getElementById('cdHours');
var elMinutes = document.getElementById('cdMinutes');
var elSeconds = document.getElementById('cdSeconds');
var cdWrap    = document.getElementById('countdownWrap');
var celebMsg  = document.getElementById('celebrationMsg');

function pad(n){ return String(n).padStart(2,'0'); }
function flip(el, val){
  var s = pad(val);
  if(el && el.textContent !== s){
    el.classList.remove('flip');
    void el.offsetWidth;
    el.classList.add('flip');
    el.textContent = s;
  }
}
function updateCountdown(){
  var diff = WEDDING_DATE - new Date();
  if(diff <= 0){
    if(cdWrap)   cdWrap.style.display   = 'none';
    if(celebMsg) celebMsg.style.display = 'block';
    return;
  }
  var t = Math.floor(diff/1000);
  flip(elDays,    Math.floor(t/86400));
  flip(elHours,   Math.floor((t%86400)/3600));
  flip(elMinutes, Math.floor((t%3600)/60));
  flip(elSeconds, t%60);
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── SCROLL REVEAL ──
function initReveal(){
  var items = document.querySelectorAll('.js-reveal, .reveal-left, .reveal-right');
  if(!items.length) return;
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('revealed');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin:'0px 0px -25px 0px' });

  items.forEach(function(el){
    var r = el.getBoundingClientRect();
    if(r.top < window.innerHeight && r.bottom > 0){
      el.classList.add('revealed');
    } else {
      obs.observe(el);
    }
  });
}

// ── SCROLL INDICATOR ──
var scrollInd = document.getElementById('scrollIndicator');
window.addEventListener('scroll', function(){
  if(scrollInd){
    if(window.scrollY > 70){ scrollInd.classList.add('hidden'); }
    else { scrollInd.classList.remove('hidden'); }
  }
}, { passive:true });

// ── PARALLAX HERO ──
function startParallax(){
  var heroPhoto   = document.getElementById('heroPhoto');
  var heroContent = document.querySelector('.hero-content');
  var florals     = document.querySelectorAll('.corner-floral');
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', function(){
    var sy = window.scrollY;
    if(heroPhoto && sy < window.innerHeight){
      heroPhoto.style.transform = 'translateY(' + (sy * 0.22) + 'px)';
    }
  }, { passive:true });

  var heroSection = document.getElementById('hero');
  if(heroSection && window.innerWidth > 768){
    heroSection.addEventListener('mousemove', function(e){
      var rect = heroSection.getBoundingClientRect();
      var xRel = (e.clientX - rect.left) / rect.width - 0.5;
      var yRel = (e.clientY - rect.top) / rect.height - 0.5;
      if(heroContent){
        heroContent.style.transform = 'translate3d(' + (xRel * -10) + 'px, ' + (yRel * -8) + 'px, 0)';
      }
      florals.forEach(function(fl, idx){
        var f = (idx % 2 === 0 ? 1 : -1) * 6;
        fl.style.transform = 'translate3d(' + (xRel * f) + 'px, ' + (yRel * f) + 'px, 0)';
      });
    }, { passive:true });

    heroSection.addEventListener('mouseleave', function(){
      if(heroContent) heroContent.style.transform = '';
      florals.forEach(function(fl){ fl.style.transform = ''; });
    });
  }
}

// ── SACRED ELEMENT ENGINE: DIYAS, JASMINE, MARIGOLD & LOTUS ──
var canvas    = document.getElementById('sparkleCanvas');
var ctx       = canvas ? canvas.getContext('2d') : null;
var sparks    = [];
var marigolds = [];
var jasmines  = [];
var lotuses   = [];
var confetti  = [];
var rafId     = null;
var isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var lastPointerSpark = 0;
var lastPointerJasmine = 0;

function resizeCanvas(){
  if(!canvas) canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  if(!ctx) ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

// 1. Ambient Sacred Golden Embers & Stardust
function SacredSpark(x, y, isPointer){
  this.isPointer = !!isPointer;
  this.x     = x !== undefined ? x : Math.random() * window.innerWidth;
  this.y     = y !== undefined ? y : Math.random() * window.innerHeight;
  this.size  = this.isPointer ? (Math.random() * 2.2 + 1) : (Math.random() * 2.5 + .8);
  this.vx    = this.isPointer ? ((Math.random() - .5) * 2.4) : ((Math.random() - .5) * .6);
  this.vy    = this.isPointer ? ((Math.random() - .5) * 2.4) : (-(Math.random() * 1.1 + .35));
  this.alpha = 1;
  this.decay = this.isPointer ? (Math.random() * .035 + .02) : (Math.random() * .01 + .004);
  var goldPalette = ['#ffd700', '#c9a84c', '#ffb142', '#f0dfa0', '#fff8e7', '#ffeaa7'];
  this.color = goldPalette[Math.floor(Math.random() * goldPalette.length)];
  this.twinkleSpeed = Math.random() * .08 + .03;
  this.twinklePhase = Math.random() * Math.PI * 2;
}
SacredSpark.prototype.update = function(){
  this.x += this.vx;
  this.y += this.vy;
  this.alpha -= this.decay;
  this.twinklePhase += this.twinkleSpeed;
};
SacredSpark.prototype.draw = function(){
  if(!ctx) return;
  var currentAlpha = Math.max(0, this.alpha * (0.65 + 0.35 * Math.sin(this.twinklePhase)));
  ctx.save();
  ctx.globalAlpha = currentAlpha;
  ctx.fillStyle   = this.color;
  ctx.shadowBlur  = this.isPointer ? 8 : 6;
  ctx.shadowColor = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// 2. Auspicious Marigold Petal (Chendumalli - Golden/Saffron)
function MarigoldPetal(x, y){
  this.x        = x !== undefined ? x : Math.random() * window.innerWidth;
  this.y        = y !== undefined ? y : (Math.random() * -60 - 20);
  this.size     = Math.random() * 7 + 7;
  this.vy       = Math.random() * 1.1 + 0.8;
  this.vx       = (Math.random() - 0.5) * 0.7;
  this.angle    = Math.random() * Math.PI * 2;
  this.angleSpd = (Math.random() - 0.5) * 0.03;
  this.flip     = Math.random() * Math.PI;
  this.flipSpd  = Math.random() * 0.045 + 0.02;
  this.alpha    = Math.random() * 0.35 + 0.55;
  var marigoldColors = ['#ff9f1a', '#ffa502', '#ff793f', '#e67e22', '#f39c12'];
  this.color    = marigoldColors[Math.floor(Math.random() * marigoldColors.length)];
}
MarigoldPetal.prototype.update = function(){
  this.y += this.vy;
  this.x += this.vx + Math.sin(this.angle) * 0.6;
  this.angle += this.angleSpd;
  this.flip  += this.flipSpd;
};
MarigoldPetal.prototype.draw = function(){
  if(!ctx) return;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.scale(1, Math.cos(this.flip));
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle   = this.color;
  ctx.shadowBlur  = 4;
  ctx.shadowColor = 'rgba(255, 159, 26, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, this.size * 0.48, this.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// 3. Sacred White Jasmine Blossom (Mulla / Pichakam)
function JasmineBlossom(x, y, isSmall){
  this.x        = x !== undefined ? x : Math.random() * window.innerWidth;
  this.y        = y !== undefined ? y : (Math.random() * -60 - 20);
  this.size     = isSmall ? (Math.random() * 3 + 4) : (Math.random() * 4 + 6);
  this.vy       = Math.random() * 1.0 + 0.65;
  this.vx       = (Math.random() - 0.5) * 0.6;
  this.angle    = Math.random() * Math.PI * 2;
  this.rotSpd   = (Math.random() - 0.5) * 0.025;
  this.flip     = Math.random() * Math.PI;
  this.flipSpd  = Math.random() * 0.035 + 0.015;
  this.alpha    = Math.random() * 0.3 + 0.65;
}
JasmineBlossom.prototype.update = function(){
  this.y += this.vy;
  this.x += this.vx + Math.sin(this.angle) * 0.5;
  this.angle += this.rotSpd;
  this.flip  += this.flipSpd;
};
JasmineBlossom.prototype.draw = function(){
  if(!ctx) return;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.scale(Math.cos(this.flip), 1);
  ctx.globalAlpha = this.alpha;
  ctx.shadowBlur  = 5;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.7)';
  // 5 pristine white petals
  ctx.fillStyle   = '#ffffff';
  for(var i = 0; i < 5; i++){
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -this.size, this.size * 0.38, this.size * 0.75, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // Golden yellow stamen center
  ctx.beginPath();
  ctx.arc(0, 0, this.size * 0.28, 0, Math.PI * 2);
  ctx.fillStyle = '#ffd32a';
  ctx.fill();
  ctx.restore();
};

// 4. Sacred Lotus Petal (Thamara - Blush Pink)
function LotusPetal(x, y){
  this.x        = x !== undefined ? x : Math.random() * window.innerWidth;
  this.y        = y !== undefined ? y : (Math.random() * -60 - 20);
  this.size     = Math.random() * 8 + 7;
  this.vy       = Math.random() * 1.1 + 0.7;
  this.vx       = (Math.random() - 0.5) * 0.7;
  this.angle    = Math.random() * Math.PI * 2;
  this.angleSpd = (Math.random() - 0.5) * 0.025;
  this.flip     = Math.random() * Math.PI;
  this.flipSpd  = Math.random() * 0.038 + 0.018;
  this.alpha    = Math.random() * 0.3 + 0.5;
  var lotusColors = ['#f8a5c2', '#ff9ebb', '#f4c0b8', '#f78fb3'];
  this.color    = lotusColors[Math.floor(Math.random() * lotusColors.length)];
}
LotusPetal.prototype.update = function(){
  this.y += this.vy;
  this.x += this.vx + Math.sin(this.angle) * 0.5;
  this.angle += this.angleSpd;
  this.flip  += this.flipSpd;
};
LotusPetal.prototype.draw = function(){
  if(!ctx) return;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);
  ctx.scale(1, Math.cos(this.flip));
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle   = this.color;
  ctx.shadowBlur  = 4;
  ctx.shadowColor = 'rgba(248, 165, 194, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 0, this.size * 0.55, this.size * 0.95, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

// 5. Celebration Pushpa Vrishti (Flower Shower Confetti)
function Confetti(x, y){
  this.x       = x;
  this.y       = y;
  var speed    = Math.random() * 10 + 4;
  var angle    = Math.random() * Math.PI * 2;
  this.vx      = Math.cos(angle) * speed;
  this.vy      = Math.sin(angle) * speed - 3;
  this.gravity = 0.26;
  this.drag    = 0.96;
  this.size    = Math.random() * 7 + 4;
  this.alpha   = 1;
  this.decay   = Math.random() * 0.015 + 0.008;
  this.rot     = Math.random() * 360;
  this.rotSpd  = (Math.random() - 0.5) * 12;
  var palette  = ['#ffd700', '#ff9f1a', '#ffffff', '#f8a5c2', '#c9a84c', '#ffa502'];
  this.color   = palette[Math.floor(Math.random() * palette.length)];
  this.isCircle= Math.random() > 0.4;
}
Confetti.prototype.update = function(){
  this.vx *= this.drag;
  this.vy = this.vy * this.drag + this.gravity;
  this.x += this.vx;
  this.y += this.vy;
  this.rot += this.rotSpd;
  this.alpha -= this.decay;
};
Confetti.prototype.draw = function(){
  if(!ctx) return;
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate((this.rot * Math.PI) / 180);
  ctx.globalAlpha = Math.max(0, this.alpha);
  ctx.fillStyle   = this.color;
  if(this.isCircle){
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(-this.size/2, -this.size/3, this.size, this.size * 0.66);
  }
  ctx.restore();
};

function celebrateConfetti(x, y){
  if(isReducedMotion) return;
  var cx = (x !== undefined) ? x : (window.innerWidth / 2);
  var cy = (y !== undefined) ? y : (window.innerHeight / 2);
  // Explode with gold stars, marigolds, and jasmines!
  for(var i = 0; i < 50; i++){
    confetti.push(new Confetti(cx, cy));
  }
  for(var m = 0; m < 15; m++){
    marigolds.push(new MarigoldPetal(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40));
  }
  for(var j = 0; j < 15; j++){
    jasmines.push(new JasmineBlossom(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40, true));
  }
}

function sparkLoop(){
  if(!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(!isReducedMotion){
    // Ambient golden embers / temple sparks
    if(sparks.length < 30 && Math.random() < 0.28){
      sparks.push(new SacredSpark());
    }
    // Ambient Marigold petals (golden-saffron)
    if(marigolds.length < 8 && Math.random() < 0.05){
      marigolds.push(new MarigoldPetal());
    }
    // Ambient Jasmine blossoms (pristine white & gold)
    if(jasmines.length < 7 && Math.random() < 0.045){
      jasmines.push(new JasmineBlossom());
    }
    // Ambient Lotus petals (sacred blush-pink)
    if(lotuses.length < 5 && Math.random() < 0.025){
      lotuses.push(new LotusPetal());
    }
  }

  // Update & draw all sacred elements
  sparks = sparks.filter(function(s){
    s.update();
    s.draw();
    return s.alpha > 0 && s.y > -20 && s.y < canvas.height + 20;
  });

  marigolds = marigolds.filter(function(m){
    m.update();
    m.draw();
    return m.y < canvas.height + 40;
  });

  jasmines = jasmines.filter(function(j){
    j.update();
    j.draw();
    return j.y < canvas.height + 40;
  });

  lotuses = lotuses.filter(function(l){
    l.update();
    l.draw();
    return l.y < canvas.height + 40;
  });

  confetti = confetti.filter(function(c){
    c.update();
    c.draw();
    return c.alpha > 0 && c.y < canvas.height + 50;
  });

  rafId = requestAnimationFrame(sparkLoop);
}

function startSparkles(){
  if(!canvas) canvas = document.getElementById('sparkleCanvas');
  if(!canvas) return;
  ctx = canvas.getContext('2d');
  resizeCanvas();
  canvas.classList.add('active');
  if(!rafId) sparkLoop();

  window.addEventListener('resize', resizeCanvas, { passive:true });

  // Interactive subtle fairy-dust pointer trail (golden ember + occasional jasmine)
  function addPointerSpark(e){
    if(isReducedMotion) return;
    var now = performance.now();
    if(now - lastPointerSpark < 40) return;
    lastPointerSpark = now;
    var x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
    var y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);
    if(x != null && y != null && sparks.length < 55){
      sparks.push(new SacredSpark(x, y, true));
      // Occasionally drop a tiny jasmine blossom from pointer
      if(now - lastPointerJasmine > 180 && jasmines.length < 16){
        lastPointerJasmine = now;
        jasmines.push(new JasmineBlossom(x, y, true));
      }
    }
  }
  window.addEventListener('mousemove', addPointerSpark, { passive:true });
  window.addEventListener('touchmove', addPointerSpark, { passive:true });

  // Pause when tab is backgrounded to save CPU/battery
  document.addEventListener('visibilitychange', function(){
    if(document.hidden){
      if(rafId){ cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if(!rafId) sparkLoop();
    }
  });
}

// ── RIPPLE EFFECT ON BUTTONS ──
document.addEventListener('click', function(e){
  var btn = e.target.closest('.ripple-btn');
  if(!btn) return;
  var rect   = btn.getBoundingClientRect();
  var ripple = document.createElement('span');
  ripple.className = 'ripple-effect';
  var size = Math.max(rect.width, rect.height) * 2;
  ripple.style.cssText = 'width:'+size+'px;height:'+size+'px;left:'+(e.clientX-rect.left-size/2)+'px;top:'+(e.clientY-rect.top-size/2)+'px';
  btn.appendChild(ripple);
  setTimeout(function(){ ripple.remove(); }, 650);
});

// ── BACK TO TOP BUTTON ──
var backToTop = document.getElementById('backToTop');
if(backToTop){
  window.addEventListener('scroll', function(){
    if(window.scrollY > 380){
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, { passive:true });

  backToTop.addEventListener('click', function(){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ── SAVE THE DATE ─.ICS ──
function downloadCalendar(e){
  // Celebratory confetti burst!
  if(e && typeof celebrateConfetti === 'function'){
    var target = e.currentTarget || e.target;
    var r = target && target.getBoundingClientRect ? target.getBoundingClientRect() : null;
    var cx = r ? (r.left + r.width / 2) : (window.innerWidth / 2);
    var cy = r ? (r.top + r.height / 2) : (window.innerHeight / 2);
    celebrateConfetti(cx, cy);
  }

  var ics = [
    'BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Akshara Athul Wedding//EN',
    'CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',
    'UID:akshara-athul-wedding-2026@invitation',
    'DTSTAMP:'+fmtICS(new Date()),
    'DTSTART;TZID=Asia/Kolkata:20261122T105000',
    'DTEND;TZID=Asia/Kolkata:20261122T115000',
    'SUMMARY:Wedding of Akshara Sivadas & Athul Krishna',
    'DESCRIPTION:You are cordially invited to the wedding of Akshara Sivadas and Athul Krishna. Muhurtham: 10:50 AM to 11:50 AM IST.',
    'LOCATION:R.K. Mahal\\, Annur Road\\, Boothimedu\\, Mettupalayam\\, Coimbatore\\, Tamil Nadu',
    'STATUS:CONFIRMED','TRANSP:OPAQUE',
    'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY',
    'DESCRIPTION:Wedding of Akshara & Athul is tomorrow!','END:VALARM',
    'BEGIN:VALARM','TRIGGER:-PT2H','ACTION:DISPLAY',
    'DESCRIPTION:Wedding of Akshara & Athul starts in 2 hours!','END:VALARM',
    'END:VEVENT','END:VCALENDAR'
  ].join('\r\n');
  var blob = new Blob([ics], { type:'text/calendar;charset=utf-8' });
  var url  = URL.createObjectURL(blob);
  var a    = document.createElement('a');
  a.href   = url;
  a.download = 'Akshara_Athul_Wedding_22Nov2026.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  var btn = document.getElementById('saveDateBtn');
  if(btn){
    var orig = btn.innerHTML;
    btn.innerHTML = '&#10003; Downloaded!';
    btn.style.background = 'linear-gradient(135deg,#2d7a4f,#3a9e68)';
    setTimeout(function(){ btn.innerHTML = orig; btn.style.background = ''; }, 3000);
  }
}
function fmtICS(d){
  function p(n){ return String(n).padStart(2,'0'); }
  return d.getUTCFullYear()+p(d.getUTCMonth()+1)+p(d.getUTCDate())+'T'+p(d.getUTCHours())+p(d.getUTCMinutes())+p(d.getUTCSeconds())+'Z';
}

// ── WHATSAPP ──
function shareWhatsApp(){
  var msg = encodeURIComponent(
    'With immense joy, we invite you to celebrate the wedding of\n\n' +
    '*Akshara Sivadas* and *Athul Krishna*\n\n' +
    '📅 Sunday, 22 November 2026\n' +
    '🕙 10:50 AM – 11:50 AM IST\n' +
    '📍 R.K. Mahal, Annur Road, Boothimedu, Mettupalayam, Coimbatore\n\n' +
    'Your presence and blessings would mean the world to us.\n\n' +
    '💛 ' + window.location.href
  );
  window.open('https://wa.me/?text='+msg,'_blank','noopener,noreferrer');
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', function(){
  document.body.style.overflow = 'hidden';
});

window.downloadCalendar  = downloadCalendar;
window.shareWhatsApp     = shareWhatsApp;
window.celebrateConfetti = celebrateConfetti;
