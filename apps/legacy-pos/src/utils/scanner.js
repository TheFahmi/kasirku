import { Events } from '../core/events.js';

let barcodeBuffer = '';
let lastKeyTime = 0;

// Maximum time in ms between keystrokes to be considered a scanner
const SCANNER_TIMEOUT = 50; 

function onKeyDown(e) {
    // Ignore events if user is actively typing in an input field, EXCEPT if they are just focused on the main search bar where scanning might also be useful.
    // Actually, scanners work best when they override or work regardless of focus, but we don't want to capture normal typing.
    const active = document.activeElement;
    const isInput = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA');

    const now = Date.now();
    
    // If it's been too long since the last keypress, reset buffer
    if (now - lastKeyTime > SCANNER_TIMEOUT) {
        barcodeBuffer = '';
    }
    
    lastKeyTime = now;

    if (e.key === 'Enter') {
        if (barcodeBuffer.length >= 3) { // Arbitrary minimum length for a barcode
            // If we successfully caught a barcode, prevent default form submissions
            if (isInput) {
                // If it's a search input, we might want to let it happen, but it's better to process it as a scan globally
                e.preventDefault();
                active.blur(); // Blur to stop mobile keyboard from popping up continuously
            }
            
            const scannedCode = barcodeBuffer;
            barcodeBuffer = '';
            
            // Emit the event
            Events.emit('scanner:read', { code: scannedCode });
        }
        return;
    }

    // Accumulate printable characters
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        barcodeBuffer += e.key;
    }
}

export const Scanner = {
    init() {
        document.addEventListener('keydown', onKeyDown, true);
    },
    destroy() {
        document.removeEventListener('keydown', onKeyDown, true);
    }
};
