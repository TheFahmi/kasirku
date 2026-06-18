export const esc = (str: string | undefined | null) => String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as Record<string, string>)[m]);

export const initials = (name: string | undefined | null) => String(name || '').split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase() || '?';

export const formatRupiah = (num: number | string | undefined | null) => 'Rp ' + Number(num || 0).toLocaleString('id-ID');

export const uid = () => Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
