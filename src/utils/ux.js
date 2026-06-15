'use strict';

const haptic = (ms = 15) => {
    if (navigator.vibrate) navigator.vibrate(ms);
};

const playSound = (type) => {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === 'suspended') ctx.resume();
        const t = ctx.currentTime;
        const playTone = (freq, ty, start, dur, vol = 0.1) => {
            const osc  = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = ty;
            osc.frequency.value = freq;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0, start);
            gain.gain.linearRampToValueAtTime(vol, start + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
            osc.start(start);
            osc.stop(start + dur);
        };
        if (type === 'pop') {
            playTone(800, 'sine', t, 0.1, 0.15);
        } else if (type === 'success') {
            playTone(523.25,  'sine', t,       0.2, 0.1);
            playTone(659.25,  'sine', t + 0.1, 0.4, 0.15);
            playTone(1046.50, 'sine', t + 0.2, 0.6, 0.1);
        }
    } catch (e) { /* silently fail */ }
};

const popCartBar = () => {
    const cb = document.getElementById('cartBar');
    if (!cb) return;
    cb.classList.remove('cartbar--pop');
    void cb.offsetWidth; // reflow trick
    cb.classList.add('cartbar--pop');
};

const fireConfetti = () => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    for (let i = 0; i < 60; i++) {
        const conf = document.createElement('div');
        const size = Math.random() * 8 + 4;
        Object.assign(conf.style, {
            position:        'fixed',
            width:           size + 'px',
            height:          size + 'px',
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
            left:            '50%',
            top:             '50%',
            zIndex:          '9999',
            pointerEvents:   'none',
            borderRadius:    Math.random() > 0.5 ? '50%' : '2px',
        });
        document.body.appendChild(conf);
        const angle    = Math.random() * Math.PI * 2;
        const velocity = 15 + Math.random() * 25;
        const tx = Math.cos(angle) * velocity * 15;
        const ty = Math.sin(angle) * velocity * 15 - 150;
        const anim = conf.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) rotate(${Math.random()*720}deg) scale(${Math.random()+0.5})`, opacity: 0 },
        ], { duration: 1200 + Math.random() * 800, easing: 'cubic-bezier(.2,.8,.2,1)' });
        anim.onfinish = () => conf.remove();
    }
};

let _toastTimer;
const toast = (msg) => {
    let el = document.getElementById('toast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'toast';
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.add('toast--show');
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => el.classList.remove('toast--show'), 1700);
};

export const UX = { haptic, playSound, popCartBar, fireConfetti, toast };
