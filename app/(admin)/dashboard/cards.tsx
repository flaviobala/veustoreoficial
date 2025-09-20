"use client";
//app/admin/dashboard/cards.tsx
import { useEffect, useState } from "react";

type Produto = {
  quantidade: number;
  alertaEstoque?: boolean;
};

type Venda = {
  preco: number;
};

type CaixaData = {
  saldoAtual: number;
  totalEntradas: number;
  totalSaidas: number;
};

export default function DashboardCards() {
  const [totalEstoque, setTotalEstoque] = useState(0);
  const [produtosAlerta, setProdutosAlerta] = useState(0);
  const [totalVendas, setTotalVendas] = useState(0);
  const [saldoCaixa, setSaldoCaixa] = useState(0);

  useEffect(() => {
    // Buscar dados de produtos
    fetch("/api/produtos")
      .then((res) => res.json())
      .then((produtos: Produto[]) => {
        const total = produtos.reduce((acc, p) => acc + p.quantidade, 0);
        const alertas = produtos.filter(p => p.alertaEstoque).length;
        setTotalEstoque(total);
        setProdutosAlerta(alertas);
      });

    // Buscar dados de vendas
    fetch("/api/vendas")
      .then((res) => res.json())
      .then((vendas: Venda[]) => {
        const total = vendas.reduce((acc, v) => acc + Number(v.preco), 0);
        setTotalVendas(total);
      });

    // Buscar dados de caixa
    fetch("/api/caixa")
      .then((res) => res.json())
      .then((data: CaixaData) => {
        setSaldoCaixa(data.saldoAtual);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Card Vendas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total de Vendas</p>
            <p className="text-2xl font-bold text-gray-900">
              R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Estoque */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total em Estoque</p>
            <p className="text-2xl font-bold text-gray-900">{totalEstoque} itens</p>
            {produtosAlerta > 0 && (
              <p className="text-red-500 text-xs mt-1">{produtosAlerta} produtos com estoque baixo</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${produtosAlerta > 0 ? 'bg-red-100' : 'bg-blue-100'}`}>
            <svg className={`w-6 h-6 ${produtosAlerta > 0 ? 'text-red-600' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Caixa */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Saldo em Caixa</p>
            <p className={`text-2xl font-bold ${saldoCaixa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {saldoCaixa.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={`p-3 rounded-full ${saldoCaixa >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
            <svg className={`w-6 h-6 ${saldoCaixa >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Card Status Geral */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Status Geral</p>
            <p className="text-2xl font-bold text-gray-900">Painel atualizado</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-full">
            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";
// //app/admin/dashboard/cards.tsx
// import { useEffect, useState } from "react";

// type Produto = {
//   quantidade: number;
// };

// type Venda = {
//   preco: number;
// };

// export default function DashboardCards() {
//   const [totalEstoque, setTotalEstoque] = useState(0);
//   const [totalVendas, setTotalVendas] = useState(0);

//   useEffect(() => {
//     fetch("/api/produtos")
//       .then((res) => res.json())
//       .then((produtos: Produto[]) => {
//         const total = produtos.reduce((acc, p) => acc + p.quantidade, 0);
//         setTotalEstoque(total);
//       });

//     fetch("/api/vendas")
//       .then((res) => res.json())
//       .then((vendas: Venda[]) => {
//         const total = vendas.reduce((acc, v) => acc + Number(v.preco), 0);
//         setTotalVendas(total);
//       });
//   }, []);

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 text-gray-700 pr-4">
//       <div className="bg-white shadow-lg rounded-2xl p-5 border-l-4 border-pink-400">
//         <h3 className="text-sm font-semibold text-pink-600">Total de Vendas</h3>
//         <p className="text-2xl font-bold text-pink-800 mt-1">
//           R$ {totalVendas.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
//         </p>
//       </div>

//       <div className="bg-white shadow-lg rounded-2xl p-5 border-l-4 border-yellow-400">
//         <h3 className="text-sm font-semibold text-yellow-600">Total em Estoque</h3>
//         <p className="text-2xl font-bold text-yellow-800 mt-1">{totalEstoque} itens</p>
//       </div>

//       {/* Terceiro card opcional */}
//       <div className="bg-white shadow-lg rounded-2xl p-5 border-l-4 border-gray-400">
//         <h3 className="text-sm font-semibold text-gray-600">Status Geral</h3>
//         <p className="text-base mt-1 text-gray-700">Painel atualizado</p>
//       </div>
//     </div>
//   );
// }
