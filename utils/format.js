'use strict';
const Format = (() => {
    const esc = str => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
    const initials = name => String(name).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
    const formatRupiah = num => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
    const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 4);

    return { esc, initials, formatRupiah, uid };
})();
