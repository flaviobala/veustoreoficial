"use client";
import { useEffect, useState } from "react";
import NoSSRWrapper from "@/app/(admin)/components/NoSSRWrapper"; // Ajuste o caminho conforme necessário

type TipoRelatorio = "geral" | "vendas" | "estoque" | "caixa" | "financeiro";

type RelatorioData = {
  tipo: string;
  periodo?: {
    dataInicio: string | null;
    dataFim: string | null;
  };
  resumo?: any;
  resumoGeral?: any;
  // Adicione as propriedades que estão faltando:
  vendas?: any[];
  produtos?: any[];
  movimentos?: any[];
  produtosMaisVendidos?: any[];
  [key: string]: any; // Permite qualquer propriedade adicional
};

export default function RelatoriosPage() {
  const [relatorioData, setRelatorioData] = useState<RelatorioData | null>(null);
  const [loading, setLoading] = useState(false);
  const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("geral");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [mounted, setMounted] = useState(false);

  // Previne hidratação mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchRelatorio = async (tipo: TipoRelatorio, inicio?: string, fim?: string) => {
    setLoading(true);
    try {
      let url = `/api/relatorios`;
      const params = new URLSearchParams();
      
      if (tipo !== "geral") {
        params.append("tipo", tipo);
      }
      if (inicio) params.append("dataInicio", inicio);
      if (fim) params.append("dataFim", fim);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      
      console.log("Dados recebidos da API:", data);
      
      setRelatorioData(data);
    } catch (error) {
      console.error("Erro ao carregar relatório:", error);
      alert("Erro ao carregar relatório");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mounted) {
      fetchRelatorio("geral");
    }
  }, [mounted]);

  const handleFiltroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRelatorio(tipoRelatorio, dataInicio, dataFim);
  };

  const formatCurrency = (value: number | string | null | undefined): string => {
    const numericValue = typeof value === 'string' 
      ? parseFloat(value) 
      : Number(value);
    
    if (isNaN(numericValue) || value === null || value === undefined) {
      return 'R$ 0,00';
    }
    
    return numericValue.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString || !mounted) return 'Data inválida';
    try {
      return new Date(dateString).toLocaleDateString("pt-BR");
    } catch {
      return 'Data inválida';
    }
  };

  // Não renderizar nada até estar montado no cliente
  if (!mounted) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
        </div>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  const renderResumoGeral = () => {
    if (!relatorioData?.resumoGeral) return null;

    const { resumoGeral } = relatorioData;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Total de Vendas</h3>
          <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.vendas?.faturamentoTotal || 0)}</p>
          <p className="text-sm opacity-75">Período selecionado</p>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Saldo Caixa</h3>
          <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.caixa?.saldoPeriodo || 0)}</p>
          <p className="text-sm opacity-75">Entradas - Saídas</p>
        </div>
        
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Produtos Vendidos</h3>
          <p className="text-3xl font-bold">{resumoGeral?.vendas?.quantidadeTotalVendida || 0}</p>
          <p className="text-sm opacity-75">Unidades</p>
        </div>
        
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
          <h3 className="text-sm font-medium opacity-90">Valor em Estoque</h3>
          <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.estoque?.valorTotalEstoque || 0)}</p>
          <p className="text-sm opacity-75">Produtos: {resumoGeral?.estoque?.totalProdutos || 0}</p>
        </div>
      </div>
    );
  };

  const renderRelatorioVendas = () => {
    const { vendas = [], resumo = {}, produtosMaisVendidos = [] } = relatorioData || {};

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Total de Vendas</h3>
            <p className="text-3xl font-bold text-blue-600">{resumo?.totalVendas || 0}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Faturamento</h3>
            <p className="text-3xl font-bold text-green-600">{formatCurrency(resumo?.faturamentoTotal || 0)}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Quantidade Vendida</h3>
            <p className="text-3xl font-bold text-purple-600">{resumo?.quantidadeTotalVendida || 0}</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800 mb-2">Ticket Médio</h3>
            <p className="text-3xl font-bold text-orange-600">{formatCurrency(resumo?.ticketMedio || 0)}</p>
          </div>
        </div>

        {produtosMaisVendidos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd Vendida</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faturamento</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Vendas</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {produtosMaisVendidos.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.produto || 'Produto não identificado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.quantidadeVendida || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(item.faturamento)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.numeroVendas || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vendas.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Detalhes das Vendas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vendas.map((venda: any, index: number) => (
                    <tr key={venda.id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <NoSSRWrapper>
                          {formatDate(venda.dataVenda || venda.criadoEm)}
                        </NoSSRWrapper>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venda.cliente || 'Cliente não informado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venda.produto?.nome || 'Produto não identificado'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {venda.quantidade || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(venda.preco)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          venda.status === 'Concluída' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {venda.status || 'Pendente'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderConteudo = () => {
    if (loading) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600 mt-4">Carregando relatório...</p>
        </div>
      );
    }

    if (!relatorioData) {
      return (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">Nenhum dado encontrado para exibir.</p>
        </div>
      );
    }

    switch (tipoRelatorio) {
      case "geral":
        return (
          <div>
            {renderResumoGeral()}
            <div className="bg-white rounded-lg shadow-md p-6 text-gray-700">
              <h3 className="text-lg font-semibold mb-4">Resumo do Período</h3>
              <p className="text-gray-600">
                {relatorioData.periodo?.dataInicio && relatorioData.periodo?.dataFim 
                  ? `Período: ${formatDate(relatorioData.periodo.dataInicio)} até ${formatDate(relatorioData.periodo.dataFim)}`
                  : "Dados gerais do sistema"
                }
              </p>
            </div>
          </div>
        );
      case "vendas":
        return renderRelatorioVendas();
      default:
        return <div className="text-center p-8">Tipo de relatório não implementado ainda.</div>;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-700">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form onSubmit={handleFiltroSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Tipo de Relatório
            </label>
            <select
              value={tipoRelatorio}
              onChange={(e) => setTipoRelatorio(e.target.value as TipoRelatorio)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="geral">Resumo Geral</option>
              <option value="vendas">Vendas</option>
              <option value="estoque">Estoque</option>
              <option value="caixa">Caixa</option>
              <option value="financeiro">Financeiro</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Data Início
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Data Fim
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Carregando..." : "Gerar Relatório"}
            </button>
          </div>
        </form>
      </div>

      {renderConteudo()}
    </div>
  );
}

// "use client";
// //app/admin/relatorios/page.tsx
// import { useEffect, useState } from "react";

// type TipoRelatorio = "geral" | "vendas" | "estoque" | "caixa" | "financeiro";

// type RelatorioData = {
//   tipo: string;
//   periodo?: {
//     dataInicio: string | null;
//     dataFim: string | null;
//   };
//   resumo?: any;
//   resumoGeral?: any;
//   [key: string]: any;
// };

// export default function RelatoriosPage() {
//   const [relatorioData, setRelatorioData] = useState<RelatorioData | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [tipoRelatorio, setTipoRelatorio] = useState<TipoRelatorio>("geral");
//   const [dataInicio, setDataInicio] = useState("");
//   const [dataFim, setDataFim] = useState("");

//   const fetchRelatorio = async (tipo: TipoRelatorio, inicio?: string, fim?: string) => {
//     setLoading(true);
//     try {
//       let url = `/api/relatorios`;
//       const params = new URLSearchParams();
      
//       if (tipo !== "geral") {
//         params.append("tipo", tipo);
//       }
//       if (inicio) params.append("dataInicio", inicio);
//       if (fim) params.append("dataFim", fim);
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       const response = await fetch(url);
//       const data = await response.json();
      
//       // Debug - log dos dados recebidos
//       console.log("Dados recebidos da API:", data);
      
//       setRelatorioData(data);
//     } catch (error) {
//       console.error("Erro ao carregar relatório:", error);
//       alert("Erro ao carregar relatório");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRelatorio("geral");
//   }, []);

//   const handleFiltroSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     fetchRelatorio(tipoRelatorio, dataInicio, dataFim);
//   };

//   // FUNÇÃO CORRIGIDA - agora trata valores undefined/null
//   const formatCurrency = (value: number | string | null | undefined): string => {
//     // Converte para número e trata valores inválidos
//     const numericValue = typeof value === 'string' 
//       ? parseFloat(value) 
//       : Number(value);
    
//     // Se não for um número válido, retorna R$ 0,00
//     if (isNaN(numericValue) || value === null || value === undefined) {
//       return 'R$ 0,00';
//     }
    
//     return numericValue.toLocaleString('pt-BR', {
//       style: 'currency',
//       currency: 'BRL',
//     });
//   };

//   const formatDate = (dateString: string | null | undefined) => {
//     if (!dateString) return 'Data inválida';
//     try {
//       return new Date(dateString).toLocaleDateString("pt-BR");
//     } catch {
//       return 'Data inválida';
//     }
//   };

//   const renderResumoGeral = () => {
//     if (!relatorioData?.resumoGeral) return null;

//     const { resumoGeral } = relatorioData;
    
//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
//           <h3 className="text-sm font-medium opacity-90">Total de Vendas</h3>
//           <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.vendas?.faturamentoTotal || 0)}</p>
//           <p className="text-sm opacity-75">Período selecionado</p>
//         </div>
        
//         <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
//           <h3 className="text-sm font-medium opacity-90">Saldo Caixa</h3>
//           <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.caixa?.saldoPeriodo || 0)}</p>
//           <p className="text-sm opacity-75">Entradas - Saídas</p>
//         </div>
        
//         <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
//           <h3 className="text-sm font-medium opacity-90">Produtos Vendidos</h3>
//           <p className="text-3xl font-bold">{resumoGeral?.vendas?.quantidadeTotalVendida || 0}</p>
//           <p className="text-sm opacity-75">Unidades</p>
//         </div>
        
//         <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
//           <h3 className="text-sm font-medium opacity-90">Valor em Estoque</h3>
//           <p className="text-3xl font-bold">{formatCurrency(resumoGeral?.estoque?.valorTotalEstoque || 0)}</p>
//           <p className="text-sm opacity-75">Produtos: {resumoGeral?.estoque?.totalProdutos || 0}</p>
//         </div>
//       </div>
//     );
//   };

//   const renderRelatorioVendas = () => {
//     const { vendas = [], resumo = {}, produtosMaisVendidos = [] } = relatorioData || {};

//     return (
//       <div className="space-y-6">
//         {/* Cards de Resumo */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
//             <h3 className="text-lg font-semibold text-blue-800 mb-2">Total de Vendas</h3>
//             <p className="text-3xl font-bold text-blue-600">{resumo?.totalVendas || 0}</p>
//           </div>
//           <div className="bg-green-50 rounded-lg p-6 border border-green-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-2">Faturamento</h3>
//             <p className="text-3xl font-bold text-green-600">{formatCurrency(resumo?.faturamentoTotal || 0)}</p>
//           </div>
//           <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
//             <h3 className="text-lg font-semibold text-purple-800 mb-2">Quantidade Vendida</h3>
//             <p className="text-3xl font-bold text-purple-600">{resumo?.quantidadeTotalVendida || 0}</p>
//           </div>
//           <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
//             <h3 className="text-lg font-semibold text-orange-800 mb-2">Ticket Médio</h3>
//             <p className="text-3xl font-bold text-orange-600">{formatCurrency(resumo?.ticketMedio || 0)}</p>
//           </div>
//         </div>

//         {/* Top Produtos Mais Vendidos */}
//         {produtosMaisVendidos.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">Produtos Mais Vendidos</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qtd Vendida</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faturamento</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nº Vendas</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {produtosMaisVendidos.map((item: any, index: number) => (
//                     <tr key={index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.produto || 'Produto não identificado'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.quantidadeVendida || 0}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatCurrency(item.faturamento)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.numeroVendas || 0}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Tabela de Vendas */}
//         {vendas.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">Detalhes das Vendas</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {vendas.map((venda: any, index: number) => (
//                     <tr key={venda.id || index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatDate(venda.dataVenda || venda.criadoEm)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {venda.cliente || 'Cliente não informado'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {venda.produto?.nome || 'Produto não identificado'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {venda.quantidade || 0}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {formatCurrency(venda.preco)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           venda.status === 'Concluída' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-yellow-100 text-yellow-800'
//                         }`}>
//                           {venda.status || 'Pendente'}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderRelatorioEstoque = () => {
//     const { produtos = [], resumo = {} } = relatorioData || {};

//     return (
//       <div className="space-y-6">
//         {/* Cards de Resumo */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-indigo-50 rounded-lg p-6 border border-indigo-200">
//             <h3 className="text-lg font-semibold text-indigo-800 mb-2">Total de Produtos</h3>
//             <p className="text-3xl font-bold text-indigo-600">{resumo?.totalProdutos || 0}</p>
//           </div>
//           <div className="bg-yellow-50 rounded-lg p-6 border border-yellow-200">
//             <h3 className="text-lg font-semibold text-yellow-800 mb-2">Valor do Estoque</h3>
//             <p className="text-3xl font-bold text-yellow-600">{formatCurrency(resumo?.valorTotalEstoque || 0)}</p>
//           </div>
//           <div className="bg-orange-50 rounded-lg p-6 border border-orange-200">
//             <h3 className="text-lg font-semibold text-orange-800 mb-2">Estoque Baixo</h3>
//             <p className="text-3xl font-bold text-orange-600">{resumo?.produtosComEstoqueBaixo || 0}</p>
//           </div>
//           <div className="bg-red-50 rounded-lg p-6 border border-red-200">
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Sem Estoque</h3>
//             <p className="text-3xl font-bold text-red-600">{resumo?.produtosSemEstoque || 0}</p>
//           </div>
//         </div>

//         {/* Tabela de Estoque */}
//         {produtos.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">Produtos em Estoque</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantidade</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço Unit.</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor Total</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {produtos.map((item: any, index: number) => (
//                     <tr key={item.id || index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.nome || 'Produto sem nome'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {item.quantidade || 0}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatCurrency(item.preco)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatCurrency(item.valorTotal)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           item.semEstoque || item.quantidade === 0
//                             ? 'bg-red-100 text-red-800' 
//                             : item.alertaEstoque || item.quantidade <= 5
//                             ? 'bg-yellow-100 text-yellow-800'
//                             : 'bg-green-100 text-green-800'
//                         }`}>
//                           {item.semEstoque || item.quantidade === 0
//                             ? 'Sem Estoque' 
//                             : item.alertaEstoque || item.quantidade <= 5
//                             ? 'Estoque Baixo'
//                             : 'Normal'
//                           }
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderRelatorioCaixa = () => {
//     const { movimentos = [], resumo = {} } = relatorioData || {};

//     return (
//       <div className="space-y-6">
//         {/* Cards de Resumo */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-green-50 rounded-lg p-6 border border-green-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-2">Entradas</h3>
//             <p className="text-3xl font-bold text-green-600">{formatCurrency(resumo?.totalEntradas || 0)}</p>
//           </div>
//           <div className="bg-red-50 rounded-lg p-6 border border-red-200">
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Saídas</h3>
//             <p className="text-3xl font-bold text-red-600">{formatCurrency(resumo?.totalSaidas || 0)}</p>
//           </div>
//           <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
//             <h3 className="text-lg font-semibold text-blue-800 mb-2">Saldo</h3>
//             <p className="text-3xl font-bold text-blue-600">{formatCurrency(resumo?.saldoPeriodo || 0)}</p>
//           </div>
//           <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
//             <h3 className="text-lg font-semibold text-purple-800 mb-2">Movimentações</h3>
//             <p className="text-3xl font-bold text-purple-600">{resumo?.totalMovimentos || 0}</p>
//           </div>
//         </div>

//         {/* Tabela de Movimentações */}
//         {movimentos.length > 0 && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="px-6 py-4 border-b border-gray-200">
//               <h3 className="text-lg font-semibold text-gray-900">Movimentações do Caixa</h3>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="w-full">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {movimentos.map((mov: any, index: number) => (
//                     <tr key={mov.id || index} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatDate(mov.criadoEm)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           mov.tipo === 'ENTRADA' 
//                             ? 'bg-green-100 text-green-800' 
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                           {mov.tipo === 'ENTRADA' ? 'Entrada' : 'Saída'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {mov.descricao || 'Sem descrição'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <span className={mov.tipo === 'ENTRADA' ? 'text-green-600' : 'text-red-600'}>
//                           {mov.tipo === 'ENTRADA' ? '+' : '-'}{formatCurrency(Math.abs(Number(mov.valor) || 0))}
//                         </span>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   const renderRelatorioFinanceiro = () => {
//     const { resumo = {} } = relatorioData || {};

//     return (
//       <div className="space-y-6">
//         {/* Cards de Resumo */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <div className="bg-green-50 rounded-lg p-6 border border-green-200">
//             <h3 className="text-lg font-semibold text-green-800 mb-2">Faturamento Bruto</h3>
//             <p className="text-3xl font-bold text-green-600">{formatCurrency(resumo?.faturamentoBruto || 0)}</p>
//           </div>
//           <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
//             <h3 className="text-lg font-semibold text-blue-800 mb-2">Entradas Caixa</h3>
//             <p className="text-3xl font-bold text-blue-600">{formatCurrency(resumo?.entradasCaixa || 0)}</p>
//           </div>
//           <div className="bg-red-50 rounded-lg p-6 border border-red-200">
//             <h3 className="text-lg font-semibold text-red-800 mb-2">Saídas Caixa</h3>
//             <p className="text-3xl font-bold text-red-600">{formatCurrency(resumo?.saidasCaixa || 0)}</p>
//           </div>
//           <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
//             <h3 className="text-lg font-semibold text-purple-800 mb-2">Saldo Líquido</h3>
//             <p className="text-3xl font-bold text-purple-600">{formatCurrency(resumo?.saldoLiquido || 0)}</p>
//           </div>
//         </div>
        
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4">Resumo Financeiro</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-600">Total de Vendas</p>
//               <p className="text-xl font-semibold">{resumo?.totalVendas || 0}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Movimentações Caixa</p>
//               <p className="text-xl font-semibold">{resumo?.totalMovimentosCaixa || 0}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   const renderConteudo = () => {
//     if (loading) {
//       return (
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="text-gray-600 mt-4">Carregando relatório...</p>
//         </div>
//       );
//     }

//     if (!relatorioData) {
//       return (
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           <p className="text-gray-600">Nenhum dado encontrado para exibir.</p>
//         </div>
//       );
//     }

//     switch (tipoRelatorio) {
//       case "geral":
//         return (
//           <div>
//             {renderResumoGeral()}
//             <div className="bg-white rounded-lg shadow-md p-6 text-gray-700">
//               <h3 className="text-lg font-semibold mb-4">Resumo do Período</h3>
//               <p className="text-gray-600">
//                 {relatorioData.periodo?.dataInicio && relatorioData.periodo?.dataFim 
//                   ? `Período: ${formatDate(relatorioData.periodo.dataInicio)} até ${formatDate(relatorioData.periodo.dataFim)}`
//                   : "Dados gerais do sistema"
//                 }
//               </p>
//             </div>
//           </div>
//         );
//       case "vendas":
//         return renderRelatorioVendas();
//       case "estoque":
//         return renderRelatorioEstoque();
//       case "caixa":
//         return renderRelatorioCaixa();
//       case "financeiro":
//         return renderRelatorioFinanceiro();
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
//       </div>

//       {/* Formulário de Filtros */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-6 text-gray-700">
//         <h2 className="text-lg font-semibold mb-4">Filtros</h2>
//         <form onSubmit={handleFiltroSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Tipo de Relatório
//             </label>
//             <select
//               value={tipoRelatorio}
//               onChange={(e) => setTipoRelatorio(e.target.value as TipoRelatorio)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             >
//               <option value="geral">Resumo Geral</option>
//               <option value="vendas">Vendas</option>
//               <option value="estoque">Estoque</option>
//               <option value="caixa">Caixa</option>
//               <option value="financeiro">Financeiro</option>
//             </select>
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Data Início
//             </label>
//             <input
//               type="date"
//               value={dataInicio}
//               onChange={(e) => setDataInicio(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">
//               Data Fim
//             </label>
//             <input
//               type="date"
//               value={dataFim}
//               onChange={(e) => setDataFim(e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50"
//             >
//               {loading ? "Carregando..." : "Gerar Relatório"}
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* Conteúdo do Relatório */}
//       {renderConteudo()}
//     </div>
//   );
// }