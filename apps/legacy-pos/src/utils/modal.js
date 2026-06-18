// src/utils/modal.js
const openModal = id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('sheet--closing');
    el.hidden = false;
};

const closeModal = id => {
    const el = document.getElementById(id);
    if (!el || el.hidden) return;
    if (el.classList.contains('sheet')) {
        const p = el.querySelector('.sheet__panel');
        if (p) { p.style.transition = ''; p.style.transform = ''; }
        el.classList.add('sheet--closing');
        setTimeout(() => { el.classList.remove('sheet--closing'); el.hidden = true; }, 210);
    } else {
        el.hidden = true;
    }
};

function initDataCloseButtons() {
    document.querySelectorAll('[data-close]').forEach(el => {
        el.addEventListener('click', () => closeModal(el.getAttribute('data-close')));
    });
}

function initSwipeToClose() {
    document.querySelectorAll('.sheet').forEach(sheet => {
        const panel = sheet.querySelector('.sheet__panel');
        const head  = sheet.querySelector('.sheet__head');
        const grip  = sheet.querySelector('.sheet__grip');
        if (!panel) return;
        let startY = 0, currentY = 0, isDragging = false;
        const onStart = e => { startY = e.touches[0].clientY; isDragging = true; panel.style.transition = 'none'; };
        if (head) head.addEventListener('touchstart', onStart, { passive: true });
        if (grip) grip.addEventListener('touchstart', onStart, { passive: true });
        panel.addEventListener('touchmove', e => {
            if (!isDragging) return;
            e.preventDefault();
            currentY = Math.max(0, e.touches[0].clientY - startY);
            if (currentY > 0) panel.style.transform = `translateY(${currentY}px)`;
        }, { passive: false });
        panel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            panel.style.transition = 'transform 0.22s ease-out';
            if (currentY > 70) closeModal(sheet.id);
            else panel.style.transform = '';
            currentY = 0;
        });
    });
}

export const Modal = { openModal, closeModal, initDataCloseButtons, initSwipeToClose };
export { openModal, closeModal };
