import { formatRupiah } from './format.js';
import { AppState } from '../components/AppState.js';

let printCharacteristic = null;

// ESC/POS Commands
const CMD = {
    INIT: [0x1B, 0x40],
    ALIGN_LEFT: [0x1B, 0x61, 0x00],
    ALIGN_CENTER: [0x1B, 0x61, 0x01],
    ALIGN_RIGHT: [0x1B, 0x61, 0x02],
    BOLD_ON: [0x1B, 0x45, 0x01],
    BOLD_OFF: [0x1B, 0x45, 0x00],
    LF: [0x0A],
    CUT_FULL: [0x1D, 0x56, 0x00],
    CUT_PARTIAL: [0x1D, 0x56, 0x01]
};

function encodeText(text) {
    // Basic ASCII encoding. For robust Indonesian/special characters, we'd need a codepage mapping.
    const arr = [];
    for (let i = 0; i < text.length; i++) {
        arr.push(text.charCodeAt(i));
    }
    return arr;
}

function buildReceiptData(tx) {
    let bytes = [];
    const push = (...arrs) => arrs.forEach(a => bytes.push(...a));
    const text = (t) => push(encodeText(t));
    const line = (t) => push(encodeText(t), CMD.LF);
    const divider = () => line('--------------------------------');

    push(CMD.INIT);
    
    // Header
    push(CMD.ALIGN_CENTER, CMD.BOLD_ON);
    line(AppState.storeInfo.name || 'KasirKu');
    push(CMD.BOLD_OFF);
    if (AppState.storeInfo.address) line(AppState.storeInfo.address);
    if (AppState.storeInfo.phone) line(AppState.storeInfo.phone);
    line('');

    // Transaction Info
    push(CMD.ALIGN_LEFT);
    line(`No    : ${tx.id}`);
    const d = new Date(tx.date);
    line(`Waktu : ${d.toLocaleDateString('id-ID')} ${d.toLocaleTimeString('id-ID')}`);
    line(`Kasir : Admin`);
    divider();

    // Items (assuming 32 chars width)
    // Format: Name (max 16) | Qty x Price (right align)
    for (const item of tx.items) {
        const title = item.variant ? `${item.name} (${item.variant})` : item.name;
        line(title);
        
        const qtyPrice = `${item.qty} x ${formatRupiah(item.price)}`;
        const subtotal = formatRupiah(item.qty * item.price);
        
        // Pad spaces between qtyPrice and subtotal
        const spaces = Math.max(1, 32 - qtyPrice.length - subtotal.length);
        line(qtyPrice + ' '.repeat(spaces) + subtotal);
    }
    divider();

    // Summary
    const totalLine = `TOTAL`;
    const totalVal = formatRupiah(tx.total);
    line(totalLine + ' '.repeat(32 - totalLine.length - totalVal.length) + totalVal);
    
    const methodLine = `METODE`;
    const methodVal = tx.method.toUpperCase();
    line(methodLine + ' '.repeat(32 - methodLine.length - methodVal.length) + methodVal);

    if (tx.received) {
        const recLine = `BAYAR`;
        const recVal = formatRupiah(tx.received);
        line(recLine + ' '.repeat(32 - recLine.length - recVal.length) + recVal);

        const chgLine = `KEMBALI`;
        const chgVal = formatRupiah(tx.received - tx.total);
        line(chgLine + ' '.repeat(32 - chgLine.length - chgVal.length) + chgVal);
    }

    // Footer
    line('');
    push(CMD.ALIGN_CENTER);
    line('Terima Kasih');
    line('Atas Kunjungan Anda');
    line('');
    line('');
    line('');
    
    return new Uint8Array(bytes);
}

export const Printer = {
    async connect() {
        if (!navigator.bluetooth) {
            throw new Error('Web Bluetooth API tidak didukung di browser/konteks ini (butuh HTTPS/localhost).');
        }
        
        try {
            const device = await navigator.bluetooth.requestDevice({
                filters: [{ services: ['000018f0-0000-1000-8000-00805f9b34fb'] }],
                optionalServices: ['e7810a71-73ae-499d-8c15-faa9aef0c3f2']
            }).catch(() => {
                // Fallback to accepting all devices if specific ESC/POS UUID is not advertised
                return navigator.bluetooth.requestDevice({
                    acceptAllDevices: true,
                    optionalServices: ['000018f0-0000-1000-8000-00805f9b34fb', 'e7810a71-73ae-499d-8c15-faa9aef0c3f2']
                });
            });

            const server = await device.gatt.connect();
            
            // Try standard ESC/POS services
            let service;
            try { service = await server.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb'); } 
            catch(e) { service = await server.getPrimaryService('e7810a71-73ae-499d-8c15-faa9aef0c3f2'); }

            const characteristics = await service.getCharacteristics();
            // Usually the first writable characteristic is the right one
            printCharacteristic = characteristics.find(c => c.properties.write || c.properties.writeWithoutResponse);

            if (!printCharacteristic) throw new Error('Karakteristik Bluetooth untuk penulisan tidak ditemukan');
            
            return true;
        } catch (err) {
            console.error('Bluetooth Connect Error:', err);
            throw new Error(err.message || 'Gagal menyambungkan ke printer');
        }
    },

    async printReceipt(tx) {
        if (!printCharacteristic) {
            await this.connect();
        }

        if (!printCharacteristic) throw new Error('Printer tidak tersambung');

        try {
            const data = buildReceiptData(tx);
            // Bluetooth MTU is usually small, chunk the writes
            const CHUNK_SIZE = 100;
            for (let i = 0; i < data.length; i += CHUNK_SIZE) {
                const chunk = data.slice(i, i + CHUNK_SIZE);
                await printCharacteristic.writeValue(chunk);
            }
        } catch (err) {
            console.error('Bluetooth Write Error:', err);
            // If disconnected, clear ref
            printCharacteristic = null;
            throw new Error('Gagal mengirim data ke printer. Pastikan printer menyala.');
        }
    }
};
