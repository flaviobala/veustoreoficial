// app/(admin)/layout.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Componente NavItem (mantido aqui para simplicidade, mas pode ser movido para _components)
  function NavItem({ href, label, emoji, active = false }: { href: string; label: string; emoji: string; active?: boolean }) {
    return (
      <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
          active
            ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
        }`}
      >
        <span className="text-lg">{emoji}</span>
        {label}
      </Link>
    );
  }

  return (
    <div className="flex bg-gradient-to-br from-rose-50 via-pink-50 via-purple-50 to-indigo-100 min-h-screen relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-pink-300/20 to-rose-300/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-60 right-40 w-40 h-40 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-2xl animate-pulse delay-200"></div>
        <div className="absolute bottom-20 left-80 w-24 h-24 bg-gradient-to-r from-indigo-300/20 to-blue-300/20 rounded-full blur-2xl animate-pulse delay-400"></div>
      </div>

      {/* Botão para abrir/fechar menu em mobile */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-pink-500 text-white rounded-full shadow-lg"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white/80 backdrop-blur-xl shadow-xl rounded-r-3xl p-6 flex flex-col z-40 transition-transform duration-300 ease-in-out
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="text-center mb-10 mt-4">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            VeuStore
          </h2>
          <p className="text-xs text-gray-500 mt-1">Painel Administrativo</p>
        </div>

        <nav className="flex-1 space-y-3">
          <NavItem href="/dashboard" label="Visão Geral" emoji="📊" active={true} /> {/* Marque o dashboard como ativo */}
          <NavItem href="/dashboard/estoque" label="Estoque" emoji="📦" />
          <NavItem href="/dashboard/caixa" label="Caixa" emoji="💰" />
          <NavItem href="/dashboard/vendas" label="Vendas" emoji="🛍️" />
          <NavItem href="/dashboard/relatorios" label="Relatórios" emoji="📈" />
          <NavItem href="/dashboard/configuracoes" label="Configurações" emoji="⚙️" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <NavItem href="/dashboard/logout" label="Sair" emoji="🚪" />
        </div>
      </aside>

      {/* Conteúdo principal */}
      <div className="flex-1 ml-0 lg:ml-72 flex flex-col">
        {/* Header do Conteúdo Principal */}
        <header className="p-6 bg-white/50 backdrop-blur-md border-b border-pink-100 flex justify-between items-center z-20">
          <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button className="bg-pink-100 text-pink-500 p-2 rounded-xl">🔔</button>
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs px-1 rounded-full animate-pulse">3</span>
            </div>
            <div className="flex items-center gap-2 bg-pink-200 rounded-xl p-2 border border-pink-100 shadow-sm">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full flex items-center justify-center">👤</div>
              <div>
                <p className="text-sm font-medium text-gray-700">Verônica Basilio</p>
                <p className="text-xs text-gray-400">Administradora</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8 relative">
          <div className="relative z-10">
            {children} {/* <-- Este é o ponto crucial! O conteúdo da página atual será renderizado aqui. */}
          </div>
        </main>
      </div>
    </div>
  );
}