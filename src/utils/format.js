// src/utils/format.js
export const esc = str => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
export const initials = name => String(name).split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';
export const formatRupiah = num => 'Rp ' + Number(num || 0).toLocaleString('id-ID');
export const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 4);
