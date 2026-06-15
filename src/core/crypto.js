const enc = new TextEncoder();
const dec = new TextDecoder();

export async function hashPassword(str) {
    const buffer = await crypto.subtle.digest('SHA-256', enc.encode('kasirku::' + str));
    return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function deriveKey(password, saltBuffer) {
    const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits', 'deriveKey']);
    return await crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: saltBuffer, iterations: 100000, hash: 'SHA-256' },
        keyMaterial,
        { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
}

function toBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
}

function fromBase64(b64) {
    const binaryString = atob(b64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
}

export async function encryptBackup(jsonStr, password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(password, salt);
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(jsonStr));
    const bundle = new Uint8Array(16 + 12 + encrypted.byteLength);
    bundle.set(salt, 0); bundle.set(iv, 16); bundle.set(new Uint8Array(encrypted), 28);
    return toBase64(bundle);
}

export async function decryptBackup(b64, password) {
    const bundle = fromBase64(b64);
    const salt = bundle.slice(0, 16);
    const iv = bundle.slice(16, 28);
    const encrypted = bundle.slice(28);
    const key = await deriveKey(password, salt);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted);
    return dec.decode(decrypted);
}

export const Crypto = { hashPassword, encryptBackup, decryptBackup };
