export const CSV = {
    exportData(products) {
        if (!products || !products.length) return;
        
        // CSV Header
        const headers = ['id', 'sku', 'name', 'category', 'price', 'stock', 'pinned'];
        const rows = [headers.join(',')];
        
        for (const p of products) {
            const row = [
                `"${(p.id || '').replace(/"/g, '""')}"`,
                `"${(p.sku || '').replace(/"/g, '""')}"`,
                `"${(p.name || '').replace(/"/g, '""')}"`,
                `"${(p.category || '').replace(/"/g, '""')}"`,
                p.price || 0,
                p.stock || 0,
                p.pinned ? 'true' : 'false'
            ];
            rows.push(row.join(','));
        }
        
        const csvContent = rows.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `kasirku-products-${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },

    importData(file, onComplete, onError) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target.result;
                const lines = text.split('\n').filter(l => l.trim().length > 0);
                if (lines.length <= 1) throw new Error('File CSV kosong atau tidak valid');
                
                // Parse headers
                const rawHeaders = lines[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
                
                const products = [];
                // Simple parsing (does not handle newlines inside quotes perfectly, but sufficient for simple data)
                for (let i = 1; i < lines.length; i++) {
                    // Split by comma ignoring commas inside quotes
                    const row = lines[i].match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || lines[i].split(',');
                    const p = {};
                    for (let j = 0; j < rawHeaders.length; j++) {
                        let val = row[j] ? row[j].replace(/^"|"$/g, '').replace(/""/g, '"').trim() : '';
                        p[rawHeaders[j]] = val;
                    }
                    if (p.name) {
                        products.push({
                            id: p.id || null, // Will be generated if null
                            sku: p.sku || '',
                            name: p.name,
                            category: p.category || 'Lainnya',
                            price: Math.max(0, parseInt(p.price) || 0),
                            stock: Math.max(0, parseInt(p.stock) || 0),
                            pinned: p.pinned === 'true'
                        });
                    }
                }
                onComplete(products);
            } catch (err) {
                if (onError) onError(err);
            }
        };
        reader.onerror = () => {
            if (onError) onError(new Error('Gagal membaca file'));
        };
        reader.readAsText(file);
    }
};
