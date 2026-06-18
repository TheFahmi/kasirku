import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-accent selection:text-white font-sans overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Merdu <span className="text-white/50 font-normal">Omni</span></span>
          </div>
          <div className="hidden md:flex space-x-8 text-sm font-medium text-white/70">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="hover:text-white transition-colors">Solutions</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex space-x-4">
            <Link href="/register" className="px-5 py-2 text-sm font-medium bg-white text-black rounded-full hover:bg-white/90 transition-all hover:scale-105 active:scale-95">
              Buka Toko Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8 backdrop-blur-sm animate-fade-in">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-medium text-white/80 uppercase tracking-wider">Merdu POS V2 is Live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] animate-slide-up">
            Operasional Bisnis <br className="hidden md:block"/>
            <span className="text-white">Yang Lebih Merdu</span>
          </h1>
          
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Satu sistem kasir pintar untuk semua jenis bisnis. Dari manajemen kuota Laundry hingga integrasi Kitchen Display Restoran yang real-time.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/register" className="w-full sm:w-auto px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all hover:scale-105 active:scale-95">
              Coba Gratis Sekarang
            </Link>
            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white font-semibold rounded-full border border-white/10 hover:bg-white/10 transition-all">
              Pelajari Fitur
            </a>
          </div>

          {/* Hero Image Mockup */}
          <div className="mt-20 relative mx-auto w-full max-w-5xl animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="relative aspect-[16/9] w-full">
              {/* Inner container with overflow-hidden */}
              <div className="absolute inset-0 rounded-2xl border border-white/10 bg-[#111] shadow-2xl overflow-hidden flex flex-col">
                {/* App Header Bar */}
                <div className="h-10 border-b border-white/10 flex items-center px-4 space-x-2 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  <div className="ml-4 text-xs text-white/40 font-mono">merdu.id/pos</div>
                </div>
                {/* App Content */}
                <div className="flex-1 flex p-6 gap-6 relative">
                   <div className="w-2/3 space-y-4">
                     <div className="h-12 w-1/3 bg-white/10 rounded-lg"></div>
                     <div className="grid grid-cols-3 gap-4">
                       {[1,2,3,4,5,6].map(i => (
                         <div key={i} className="aspect-square bg-white/5 rounded-xl border border-white/5 flex flex-col items-center justify-center p-4">
                           <div className="w-12 h-12 bg-white/10 rounded-full mb-2"></div>
                           <div className="w-3/4 h-3 bg-white/20 rounded"></div>
                         </div>
                       ))}
                     </div>
                   </div>
                   <div className="w-1/3 bg-white/5 rounded-xl border border-white/10 p-4 flex flex-col">
                     <div className="h-8 w-1/2 bg-white/10 rounded-md mb-4"></div>
                     <div className="flex-1 space-y-2">
                       <div className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4"><div className="w-1/2 h-3 bg-white/20 rounded"></div></div>
                       <div className="h-12 w-full bg-white/5 rounded-lg flex items-center px-4"><div className="w-1/3 h-3 bg-white/20 rounded"></div></div>
                     </div>
                     <div className="h-12 w-full bg-white text-black font-bold flex items-center justify-center rounded-lg mt-auto">Bayar</div>
                   </div>
                </div>
              </div>
              
              {/* Floating Badges OUTSIDE overflow-hidden */}
              <div className="absolute top-10 -right-6 px-4 py-2 bg-green-500 text-white font-semibold rounded-xl shadow-xl rotate-3 z-20">
                Transaksi Sukses!
              </div>
              <div className="absolute bottom-20 -left-6 px-4 py-2 bg-blue-500 text-white font-semibold rounded-xl shadow-xl -rotate-6 z-20">
                Kitchen Ready
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 border-t border-white/10 bg-black/20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Tanpa Tanding</h2>
              <p className="text-white/60">Didesain khusus untuk memenuhi kebutuhan bisnis multi-cabang.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">QR Menu Resto</h3>
                <p className="text-white/60">Pelanggan memesan langsung dari meja menggunakan QR. Terintegrasi langsung ke layar dapur (KDS) dan layar antrean.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-purple-500/20 text-purple-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Laundry Portal</h3>
                <p className="text-white/60">Cek kuota kiloan, status cucian, dan piutang pelanggan dalam satu portal pintar. Mendukung order *pickup* ke rumah.</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group">
                <div className="w-12 h-12 bg-green-500/20 text-green-400 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">SaaS Multi-Tenant</h3>
                <p className="text-white/60">Arsitektur multi-tenant yang memungkinkan Anda menjadi penyedia POS bagi ribuan toko lain di bawah sistem Anda.</p>
              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Mulai Tanpa Risiko</h2>
              <p className="text-white/60">Pilih paket yang sesuai dengan skala bisnis Anda.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              
              {/* Free Plan */}
              <div className="bg-white/5 border border-white/10 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-400 to-gray-600"></div>
                <h3 className="text-2xl font-bold mb-2">Basic</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold">Gratis</span>
                  <span className="text-white/50 ml-2">selamanya</span>
                </div>
                <p className="text-white/60 mb-8">Sempurna untuk UMKM yang baru mulai go-digital.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> 1 Cabang (Free Unlimited)</li>
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Transaksi Tanpa Batas</li>
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Fitur Kasir (POS) Standar</li>
                </ul>
                <Link href="/register" className="block w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-center rounded-xl font-semibold transition-colors">
                  Coba Gratis Sekarang
                </Link>
              </div>

              {/* Pro Plan */}
              <div className="bg-accent/10 border border-accent/30 p-8 rounded-3xl relative overflow-hidden transform md:-translate-y-4 shadow-2xl shadow-accent/20">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-purple-500"></div>
                <div className="absolute top-4 right-4 bg-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Paling Laris</div>
                <h3 className="text-2xl font-bold mb-2">Pro Omni</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-400">Rp 99.000</span>
                  <span className="text-white/50 ml-2">/bulan/cabang</span>
                </div>
                <p className="text-white/60 mb-8">Sistem lengkap ala restoran raksasa untuk UMKM.</p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Semua Fitur Basic</li>
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> QR Menu Interaktif (Self-Order)</li>
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Kitchen Display System (KDS)</li>
                  <li className="flex items-center text-white/80"><svg className="w-5 h-5 text-accent mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg> Layar Antrean Pelanggan</li>
                </ul>
                <Link href="/register" className="block w-full py-3 px-4 bg-accent hover:bg-blue-600 text-white text-center rounded-xl font-semibold transition-colors shadow-lg shadow-accent/30">
                  Daftar Paket Pro
                </Link>
              </div>

            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-12 text-center text-white/40">
          <p>&copy; {new Date().getFullYear()} KasirKu Omni. All rights reserved.</p>
        </footer>
      </main>

    </div>
  );
}
