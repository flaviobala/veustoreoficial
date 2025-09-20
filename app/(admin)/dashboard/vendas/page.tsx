'use client';

// import { useEffect, useState } from "react";
// import { DollarSign, ShoppingCart, Users, Pencil, Trash, Plus, Save, X } from "lucide-react"; // Importando ícones relevantes para vendas
// import { ToastContainer, toast } from "react-toastify"; // Importando Toastify
// import "react-toastify/dist/ReactToastify.css"; // Importe o CSS do Toastify

// // Definição do tipo para um Produto, necessário para a lógica de vendas
// type Produto = {
//   id: number;
//   nome: string;
//   quantidade: number; // Quantidade em estoque
//   preco: number; // Preço unitário do produto
// };

// // Definição do tipo para uma Venda. Ajuste conforme sua estrutura de dados real no DB.
// // Este tipo de Venda inclui as informações do produto associado.
// type Venda = {
//   id: number;
//   cliente: string;
//   produtoId: number; // ID do produto vendido
//   produto?: Produto; // Informações do produto (opcional, pode ser carregado separadamente ou unido)
//   quantidade: number; // Quantidade de itens do produto vendidos nesta venda
//   precoTotal: number; // Preço total da venda (quantidade * preco_unitario do produto na venda)
//   dataVenda: string; // Formato de data, e.g., 'YYYY-MM-DD'
//   status: 'Concluída' | 'Pendente' | 'Cancelada';
//   criadoEm?: string; // Adicionado para compatibilidade com o seu código anterior de vendas
// };

// export default function VendasPage() {
//   const [vendas, setVendas] = useState<Venda[]>([]);
//   const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar produtos do estoque
//   const [loading, setLoading] = useState(true);
//   const [editandoVenda, setEditandoVenda] = useState<Venda | null>(null);

//   // Estados para o formulário de nova/edição de venda
//   const [cliente, setCliente] = useState("");
//   const [produtoId, setProdutoId] = useState<number | string>(""); // Agora armazena o ID do produto
//   const [quantidadeVendida, setQuantidadeVendida] = useState<number>(1);
//   const [precoTotalVenda, setPrecoTotalVenda] = useState<number>(0); // Preço total calculado da venda
//   const [dataVenda, setDataVenda] = useState("");
//   const [status, setStatus] = useState<Venda['status']>('Concluída');

//   // NOVO ESTADO: Para controlar se estamos no lado do cliente
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     carregarDados();
//     // TESTE IMPORTANTE: Este toast DEVE aparecer quando a página carrega
//     toast.success("Página de vendas carregada!"); 
//     setIsClient(true); // Definindo isClient para true apenas no lado do cliente
//   }, []);

//   async function carregarDados() {
//     try {
//       setLoading(true);
//       // Carregar produtos (necessário para o dropdown e validação de estoque)
//       const resProdutos = await fetch("/api/produtos");
//       const dataProdutos = await resProdutos.json();
//       // Explicitamente converte 'preco' e 'quantidade' para Number
//       const parsedProdutos: Produto[] = dataProdutos.map((p: any) => ({
//         ...p,
//         quantidade: Number(p.quantidade), // Garante que quantidade é um número
//         preco: Number(p.preco),           // Garante que preco é um número
//       }));
//       setProdutos(parsedProdutos || []);

//       // Carregar vendas
//       const resVendas = await fetch("/api/vendas");
//       const dataVendas = await resVendas.json();
//       // Explicitamente converte 'preco' (da API) para 'precoTotal' (do nosso tipo Venda) e 'quantidade' para Number
//       const vendasComProduto: Venda[] = dataVendas.map((v: any) => {
//         const produtoAssociado = parsedProdutos.find((p: Produto) => p.id === v.produtoId);
//         // Formata dataVenda para o formato "YYYY-MM-DD" esperado pelo input type="date"
//         const formattedDataVenda = v.criadoEm ? new Date(v.criadoEm).toISOString().split('T')[0] : '';

//         return {
//           ...v,
//           // Mapeia 'preco' da API para 'precoTotal' no tipo do frontend e converte para número
//           precoTotal: Number(v.preco),
//           quantidade: Number(v.quantidade), // Garante que quantidade da venda é um número
//           produto: produtoAssociado, // Garante que o produto associado é anexado
          
//           // Adiciona valores padrão para campos ausentes da API:
//           cliente: v.cliente || 'Cliente Não Informado', // Padrão se 'cliente' não vier da API
//           status: v.status || 'Concluída', // Padrão 'Concluída' se 'status' não vier da API
//           dataVenda: v.dataVenda || formattedDataVenda, // Padrão do 'criadoEm' formatado se 'dataVenda' não vier
//         };
//       });
//       setVendas(vendasComProduto || []);

//     } catch (error) {
//       console.error("Erro ao carregar dados:", error);
//       setProdutos([]);
//       setVendas([]);
//       toast.error("Erro ao carregar dados. Tente novamente.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Efeito para calcular o preço total da venda quando produtoId ou quantidadeVendida muda
//   useEffect(() => {
//     const produtoSelecionado = produtos.find(p => p.id === Number(produtoId));
//     if (produtoSelecionado && quantidadeVendida > 0) {
//       setPrecoTotalVenda(produtoSelecionado.preco * quantidadeVendida);
//     } else {
//       setPrecoTotalVenda(0);
//     }
//   }, [produtoId, quantidadeVendida, produtos]);


//   function handleEditar(v: Venda) {
//     setEditandoVenda(v);
//     setCliente(v.cliente);
//     setProdutoId(v.produtoId);
//     setQuantidadeVendida(v.quantidade);
//     setPrecoTotalVenda(v.precoTotal);
//     setDataVenda(v.dataVenda);
//     setStatus(v.status);
//   }

//   function cancelarEdicao() {
//     setEditandoVenda(null);
//     setCliente("");
//     setProdutoId("");
//     setQuantidadeVendida(1);
//     setPrecoTotalVenda(0);
//     setDataVenda("");
//     setStatus('Concluída');
//   }

//   async function handleSalvar() {
//   if (!cliente.trim() || !produtoId || quantidadeVendida <= 0 || !dataVenda.trim()) {
//     toast.error("Preencha todos os campos obrigatórios.");
//     return;
//   }

//   const produtoAtualNoEstoque = produtos.find(p => p.id === Number(produtoId));
//   if (!produtoAtualNoEstoque) {
//     toast.error("Produto selecionado não encontrado no estoque.");
//     return;
//   }

//   // Validação de estoque antes de salvar/atualizar
//   if (quantidadeVendida > produtoAtualNoEstoque.quantidade) {
//     toast.error(`Estoque insuficiente! Disponível: ${produtoAtualNoEstoque.quantidade}`);
//     return;
//   }

//   const dadosParaEnvio = {
//     cliente: cliente.trim(),
//     produtoId: Number(produtoId),
//     quantidade: quantidadeVendida,
//     precoTotal: precoTotalVenda, // Usar o valor calculado
//     dataVenda: dataVenda,
//     status: status,
//   };

//   try {
//     let res;
//     let vendaProcessada;

//     if (editandoVenda) {
//       res = await fetch(`/api/vendas/${editandoVenda.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dadosParaEnvio),
//       });

//       if (res.ok) {
//         vendaProcessada = await res.json();
//         // Atualiza a lista com o produto anexado para exibição
//         const atualizadaComProduto = { ...vendaProcessada, produto: produtoAtualNoEstoque };
//         setVendas(vendas.map(v => v.id === atualizadaComProduto.id ? atualizadaComProduto : v));
//         toast.success("Venda atualizada com sucesso!");

//         // --- LÓGICA E DEBUG DE ALERTA DE ESTOQUE BAIXO (EDIÇÃO) ---
//         // Verificamos o estoque teórico após a edição
//         const estoqueAposEdicaoTeorica = produtoAtualNoEstoque.quantidade - quantidadeVendida;
//         console.log("--- Debug de Estoque Baixo (APÓS EDIÇÃO BEM-SUCEDIDA) ---");
//         console.log("Estoque do Produto (antes da edição):", produtoAtualNoEstoque.quantidade);
//         console.log("Quantidade Editada/Vendida:", quantidadeVendida);
//         console.log("Estoque Teórico Final:", estoqueAposEdicaoTeorica);
//         console.log("Condição (Estoque Teórico Final <= 5):", estoqueAposEdicaoTeorica <= 5);

//         if (estoqueAposEdicaoTeorica <= 5) {
//           toast.warning("⚠ Estoque baixo! Reponha o produto após esta edição de venda.");
//         }

//       } else {
//         toast.error("Erro ao atualizar venda.");
//       }
//     } else { // Nova Venda (POST)
//       res = await fetch("/api/vendas", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dadosParaEnvio),
//       });

//       if (res.ok) {
//         vendaProcessada = await res.json();
//         // Adiciona à lista com o produto anexado para exibição
//         const criadaComProduto = { ...vendaProcessada, produto: produtoAtualNoEstoque };
//         setVendas((prev) => [criadaComProduto, ...prev]);
//         toast.success("Venda registrada com sucesso!");

//         // --- LÓGICA E DEBUG DE ALERTA DE ESTOQUE BAIXO (NOVA VENDA) ---
//         // Verificamos o estoque teórico após a venda
//         const estoqueAposVendaTeorica = produtoAtualNoEstoque.quantidade - quantidadeVendida;
//         console.log("--- Debug de Estoque Baixo (APÓS NOVA VENDA BEM-SUCEDIDA) ---");
//         console.log("Estoque do Produto (antes da venda):", produtoAtualNoEstoque.quantidade);
//         console.log("Quantidade Vendida:", quantidadeVendida);
//         console.log("Estoque Teórico Final:", estoqueAposVendaTeorica);
//         console.log("Condição (Estoque Teórico Final <= 5):", estoqueAposVendaTeorica <= 5);

//         if (estoqueAposVendaTeorica <= 5) {
//           toast.warning("⚠ Estoque baixo! Reponha o produto após esta venda.");
//         }
//       } else {
//         toast.error("Erro ao adicionar venda.");
//       }
//     }
//     cancelarEdicao(); // Limpa formulário após sucesso

//     // Recarregar produtos para refletir a mudança de estoque
//     carregarDados();

//   } catch (error) {
//     console.error("Erro na operação de vendas (bloco catch):", error); // Renomeei para maior clareza
//     toast.error("Erro na operação de vendas. Verifique sua conexão.");
//   }
// }

//   async function handleExcluir(id: number) {
//     if (!confirm("Confirma exclusão desta venda?")) return;
    
//     try {
//       const res = await fetch(`/api/vendas/${id}`, { method: "DELETE" });
//       if (res.ok) {
//         setVendas(vendas.filter(v => v.id !== id));
//         if (editandoVenda?.id === id) cancelarEdicao();
//         toast.success("Venda excluída com sucesso!");
//         // Recarregar produtos para refletir o estoque, se a exclusão devolver ao estoque
//         carregarDados(); 
//       } else {
//         toast.error("Erro ao excluir venda.");
//       }
//     } catch (error) {
//       console.error("Erro ao excluir venda:", error);
//       toast.error("Erro ao excluir venda. Verifique sua conexão.");
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center p-8">
//         <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-purple-200">
//           <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
//           <span className="text-purple-700 font-medium">Carregando dados...</span>
//         </div>
//       </div>
//     );
//   }

//   // Estatísticas de vendas
//   const totalVendasConcluidas = vendas.filter(v => v.status === 'Concluída').length;
//   const faturamentoTotal = vendas.reduce((acc, v) => acc + (Number(v.precoTotal)), 0);
//   const mediaPorVenda = totalVendasConcluidas > 0 ? faturamentoTotal / totalVendasConcluidas : 0;
//   const vendasPendentes = vendas.filter(v => v.status === 'Pendente').length;

//   return (
//     <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
//       {isClient && ( // Condição para renderizar o conteúdo apenas no lado do cliente
//         <>
//           {/* ATENÇÃO AQUI: autoClose está definido como false para o teste */}
//           <ToastContainer position="top-right" autoClose={false} /> 
//           <div className="max-w-7xl mx-auto space-y-6">
            
//             {/* Header da Página de Vendas */}
//             <div className="text-center">
//               <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-purple-200 mb-4">
//                 <ShoppingCart className="text-purple-600" size={28} />
//                 <h1 className="text-2xl font-bold text-purple-700">Controle de Vendas</h1>
//               </div>
//               <p className="text-gray-600">
//                 {editandoVenda ? "Editando registro de venda" : "Gerencie e registre suas vendas aqui"}
//               </p>
//             </div>

//             {/* Cards de Estatísticas de Vendas */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//               <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-purple-500 p-2 rounded-lg">
//                     <ShoppingCart className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Total Vendas Concluídas</p>
//                     <p className="text-xl font-bold text-purple-700">{totalVendasConcluidas}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-pink-500 p-2 rounded-lg">
//                     <DollarSign className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Faturamento Total</p>
//                     <p className="text-xl font-bold text-pink-700">R$ {faturamentoTotal.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-indigo-500 p-2 rounded-lg">
//                     <DollarSign className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Média por Venda</p>
//                     <p className="text-xl font-bold text-indigo-700">R$ {mediaPorVenda.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-rose-200">
//                 <div className="flex items-center gap-3">
//                   <div className="bg-rose-500 p-2 rounded-lg">
//                     <Users className="text-white" size={20} />
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Vendas Pendentes</p>
//                     <p className="text-xl font-bold text-rose-700">{vendasPendentes}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
//               {/* Formulário de Nova/Edição de Venda */}
//               <div className="lg:col-span-1">
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200 sticky top-6">
//                   <div className="flex items-center gap-3 mb-4">
//                     <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
//                       {editandoVenda ? <Pencil className="text-white" size={18} /> : <Plus className="text-white" size={18} />}
//                     </div>
//                     <h2 className="font-bold text-purple-700">
//                       {editandoVenda ? "Editar Venda" : "Nova Venda"}
//                     </h2>
//                   </div>

//                   <div className="space-y-4">
//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Cliente</label>
//                       <input
//                         value={cliente}
//                         onChange={(e) => setCliente(e.target.value)}
//                         placeholder="Nome do cliente"
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Produto</label>
//                       <select
//                         value={produtoId}
//                         onChange={(e) => setProdutoId(e.target.value)}
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       >
//                         <option value="">Selecione um produto</option>
//                         {produtos.map((p) => (
//                           <option key={p.id} value={p.id}>
//                             {p.nome} (Estoque: {p.quantidade})
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Quantidade</label>
//                       <input
//                         type="number"
//                         min="1"
//                         value={quantidadeVendida}
//                         onChange={(e) => setQuantidadeVendida(Number(e.target.value))}
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Preço Total (R$)</label>
//                       <input
//                         type="text" // Alterado para text pois é apenas exibição
//                         readOnly
//                         value={`R$ ${precoTotalVenda.toFixed(2)}`}
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Data da Venda</label>
//                       <input
//                         type="date"
//                         value={dataVenda}
//                         onChange={(e) => setDataVenda(e.target.value)}
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-purple-700 mb-1">Status</label>
//                       <select
//                         value={status}
//                         onChange={(e) => setStatus(e.target.value as Venda['status'])}
//                         className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
//                       >
//                         <option value="Concluída">Concluída</option>
//                         <option value="Pendente">Pendente</option>
//                         <option value="Cancelada">Cancelada</option>
//                       </select>
//                     </div>


//                     <div className="flex gap-2">
//                       <button
//                         onClick={handleSalvar}
//                         className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
//                       >
//                         {editandoVenda ? <Save size={16} /> : <Plus size={16} />}
//                         {editandoVenda ? "Salvar" : "Adicionar"}
//                       </button>

//                       {editandoVenda && (
//                         <button
//                           onClick={cancelarEdicao}
//                           className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors flex items-center gap-2"
//                         >
//                           <X size={16} />
//                           Cancelar
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Lista de Vendas */}
//               <div className="lg:col-span-3">
//                 <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 overflow-hidden">
//                   <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
//                     <h2 className="font-bold text-white flex items-center gap-2">
//                       <ShoppingCart size={20} />
//                       Vendas Registradas ({vendas.length})
//                     </h2>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="bg-purple-100">
//                         <tr>
//                           <th className="p-3 text-left font-medium text-purple-800">Cliente</th>
//                           <th className="p-3 text-left font-medium text-purple-800">Produto</th>
//                           <th className="p-3 text-left font-medium text-purple-800">Qtd Vendida</th>
//                           <th className="p-3 text-left font-medium text-purple-800">Preço Total</th>
//                           <th className="p-3 text-left font-medium text-purple-800">Data</th>
//                           <th className="p-3 text-left font-medium text-purple-800">Status</th>
//                           <th className="p-3 text-center font-medium text-purple-800">Ações</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {vendas.length === 0 ? (
//                           <tr>
//                             <td colSpan={7} className="text-center p-8">
//                               <div className="flex flex-col items-center gap-3">
//                                 <ShoppingCart className="text-purple-300" size={40} />
//                                 <p className="text-purple-600 font-medium">Nenhuma venda registrada ainda</p>
//                                 <p className="text-purple-400 text-sm">Use o formulário ao lado para adicionar uma nova venda</p>
//                               </div>
//                             </td>
//                           </tr>
//                         ) : (
//                           vendas.map((venda, index) => (
//                             <tr
//                               key={venda.id}
//                               className={`border-t border-purple-200 hover:bg-purple-50 transition-colors ${
//                                 editandoVenda?.id === venda.id ? 'bg-yellow-50' : ''
//                               }`}
//                             >
//                               <td className="p-3 font-medium text-purple-900">{venda.cliente}</td>
//                               <td className="p-3 text-purple-800">{venda.produto?.nome || "Produto Não Encontrado"}</td>
//                               <td className="p-3 text-purple-800">{venda.quantidade}</td>
//                               <td className="p-3 font-semibold text-purple-900">
//                                 R$ {Number(venda.precoTotal).toFixed(2)}
//                               </td>
//                               <td className="p-3 text-sm text-gray-700">{venda.dataVenda}</td>
//                               <td className="p-3">
//                                 <span className={`px-2 py-1 rounded text-xs font-semibold ${
//                                   venda.status === 'Concluída' ? 'bg-green-100 text-green-800' :
//                                   venda.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
//                                   'bg-red-100 text-red-800'
//                                 }`}>
//                                   {venda.status}
//                                 </span>
//                               </td>
//                               <td className="p-3">
//                                 <div className="flex justify-center gap-2">
//                                   <button
//                                     onClick={() => handleEditar(venda)}
//                                     className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors"
//                                     title="Editar"
//                                   >
//                                     <Pencil size={14} />
//                                   </button>
//                                   <button
//                                     onClick={() => handleExcluir(venda.id)}
//                                     className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition-colors"
//                                     title="Excluir"
//                                   >
//                                     <Trash size={14} />
//                                   </button>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))
//                         )}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }


// 'use client';
//app/admin/dashboard/vendas/page.tsx
import { useEffect, useState } from "react";
import { DollarSign, ShoppingCart, Users, Pencil, Trash, Plus, Save, X } from "lucide-react"; // Importando ícones relevantes para vendas
import { ToastContainer, toast } from "react-toastify"; // Importando Toastify
import "react-toastify/dist/ReactToastify.css"; // Importe o CSS do Toastify

// Definição do tipo para um Produto, necessário para a lógica de vendas
type Produto = {
  id: number;
  nome: string;
  quantidade: number; // Quantidade em estoque
  preco: number; // Preço unitário do produto
};

// Definição do tipo para uma Venda. Ajuste conforme sua estrutura de dados real no DB.
// Este tipo de Venda inclui as informações do produto associado.
type Venda = {
  id: number;
  cliente: string;
  produtoId: number; // ID do produto vendido
  produto?: Produto; // Informações do produto (opcional, pode ser carregado separadamente ou unido)
  quantidade: number; // Quantidade de itens do produto vendidos nesta venda
  precoTotal: number; // Preço total da venda (quantidade * preco_unitario do produto na venda)
  dataVenda: string; // Formato de data, e.g., 'YYYY-MM-DD'
  status: 'Concluída' | 'Pendente' | 'Cancelada';
  criadoEm?: string; // Adicionado para compatibilidade com o seu código anterior de vendas
};

export default function VendasPage() {
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]); // Estado para armazenar produtos do estoque
  const [loading, setLoading] = useState(true);
  const [editandoVenda, setEditandoVenda] = useState<Venda | null>(null);

  // Estados para o formulário de nova/edição de venda
  const [cliente, setCliente] = useState("");
  const [produtoId, setProdutoId] = useState<number | string>(""); // Agora armazena o ID do produto
  const [quantidadeVendida, setQuantidadeVendida] = useState<number>(1);
  const [precoTotalVenda, setPrecoTotalVenda] = useState<number>(0); // Preço total calculado da venda
  const [dataVenda, setDataVenda] = useState("");
  const [status, setStatus] = useState<Venda['status']>('Concluída');

  useEffect(() => {
    carregarDados();
    // TESTE IMPORTANTE: Este toast DEVE aparecer quando a página carrega
    toast.success("Página de vendas carregada!"); 
  }, []);

  async function carregarDados() {
    try {
      setLoading(true);
      // Carregar produtos (necessário para o dropdown e validação de estoque)
      const resProdutos = await fetch("/api/produtos");
      const dataProdutos = await resProdutos.json();
      // Explicitamente converte 'preco' e 'quantidade' para Number
      const parsedProdutos: Produto[] = dataProdutos.map((p: any) => ({
        ...p,
        quantidade: Number(p.quantidade), // Garante que quantidade é um número
        preco: Number(p.preco),           // Garante que preco é um número
      }));
      setProdutos(parsedProdutos || []);

      // Carregar vendas
      const resVendas = await fetch("/api/vendas");
      const dataVendas = await resVendas.json();
      // Explicitamente converte 'preco' (da API) para 'precoTotal' (do nosso tipo Venda) e 'quantidade' para Number
      const vendasComProduto: Venda[] = dataVendas.map((v: any) => {
        const produtoAssociado = parsedProdutos.find((p: Produto) => p.id === v.produtoId);
        // Formata dataVenda para o formato "YYYY-MM-DD" esperado pelo input type="date"
        const formattedDataVenda = v.criadoEm ? new Date(v.criadoEm).toISOString().split('T')[0] : '';

        return {
          ...v,
          // Mapeia 'preco' da API para 'precoTotal' no tipo do frontend e converte para número
          precoTotal: Number(v.preco),
          quantidade: Number(v.quantidade), // Garante que quantidade da venda é um número
          produto: produtoAssociado, // Garante que o produto associado é anexado
          
          // Adiciona valores padrão para campos ausentes da API:
          cliente: v.cliente || 'Cliente Não Informado', // Padrão se 'cliente' não vier da API
          status: v.status || 'Concluída', // Padrão 'Concluída' se 'status' não vier da API
          dataVenda: v.dataVenda || formattedDataVenda, // Padrão do 'criadoEm' formatado se 'dataVenda' não vier
        };
      });
      setVendas(vendasComProduto || []);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setProdutos([]);
      setVendas([]);
      toast.error("Erro ao carregar dados. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  // Efeito para calcular o preço total da venda quando produtoId ou quantidadeVendida muda
  useEffect(() => {
    const produtoSelecionado = produtos.find(p => p.id === Number(produtoId));
    if (produtoSelecionado && quantidadeVendida > 0) {
      setPrecoTotalVenda(produtoSelecionado.preco * quantidadeVendida);
    } else {
      setPrecoTotalVenda(0);
    }
  }, [produtoId, quantidadeVendida, produtos]);


  function handleEditar(v: Venda) {
    setEditandoVenda(v);
    setCliente(v.cliente);
    setProdutoId(v.produtoId);
    setQuantidadeVendida(v.quantidade);
    setPrecoTotalVenda(v.precoTotal);
    setDataVenda(v.dataVenda);
    setStatus(v.status);
  }

  function cancelarEdicao() {
    setEditandoVenda(null);
    setCliente("");
    setProdutoId("");
    setQuantidadeVendida(1);
    setPrecoTotalVenda(0);
    setDataVenda("");
    setStatus('Concluída');
  }

  async function handleSalvar() {
  if (!cliente.trim() || !produtoId || quantidadeVendida <= 0 || !dataVenda.trim()) {
    toast.error("Preencha todos os campos obrigatórios.");
    return;
  }

  const produtoAtualNoEstoque = produtos.find(p => p.id === Number(produtoId));
  if (!produtoAtualNoEstoque) {
    toast.error("Produto selecionado não encontrado no estoque.");
    return;
  }

  // Validação de estoque antes de salvar/atualizar
  if (quantidadeVendida > produtoAtualNoEstoque.quantidade) {
    toast.error(`Estoque insuficiente! Disponível: ${produtoAtualNoEstoque.quantidade}`);
    return;
  }

  const dadosParaEnvio = {
    cliente: cliente.trim(),
    produtoId: Number(produtoId),
    quantidade: quantidadeVendida,
    precoTotal: precoTotalVenda, // Usar o valor calculado
    dataVenda: dataVenda,
    status: status,
  };

  try {
    let res;
    let vendaProcessada;

    if (editandoVenda) {
      res = await fetch(`/api/vendas/${editandoVenda.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnvio),
      });

      if (res.ok) {
        vendaProcessada = await res.json();
        // Atualiza a lista com o produto anexado para exibição
        const atualizadaComProduto = { ...vendaProcessada, produto: produtoAtualNoEstoque };
        setVendas(vendas.map(v => v.id === atualizadaComProduto.id ? atualizadaComProduto : v));
        toast.success("Venda atualizada com sucesso!");

        // --- LÓGICA E DEBUG DE ALERTA DE ESTOQUE BAIXO (EDIÇÃO) ---
        // Verificamos o estoque teórico após a edição
        const estoqueAposEdicaoTeorica = produtoAtualNoEstoque.quantidade - quantidadeVendida;
        console.log("--- Debug de Estoque Baixo (APÓS EDIÇÃO BEM-SUCEDIDA) ---");
        console.log("Estoque do Produto (antes da edição):", produtoAtualNoEstoque.quantidade);
        console.log("Quantidade Editada/Vendida:", quantidadeVendida);
        console.log("Estoque Teórico Final:", estoqueAposEdicaoTeorica);
        console.log("Condição (Estoque Teórico Final <= 5):", estoqueAposEdicaoTeorica <= 5);

        if (estoqueAposEdicaoTeorica <= 5) {
          toast.warning("⚠ Estoque baixo! Reponha o produto após esta edição de venda.");
        }

      } else {
        toast.error("Erro ao atualizar venda.");
      }
    } else { // Nova Venda (POST)
      res = await fetch("/api/vendas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dadosParaEnvio),
      });

      if (res.ok) {
        vendaProcessada = await res.json();
        // Adiciona à lista com o produto anexado para exibição
        const criadaComProduto = { ...vendaProcessada, produto: produtoAtualNoEstoque };
        setVendas((prev) => [criadaComProduto, ...prev]);
        toast.success("Venda registrada com sucesso!");

        // --- LÓGICA E DEBUG DE ALERTA DE ESTOQUE BAIXO (NOVA VENDA) ---
        // Verificamos o estoque teórico após a venda
        const estoqueAposVendaTeorica = produtoAtualNoEstoque.quantidade - quantidadeVendida;
        console.log("--- Debug de Estoque Baixo (APÓS NOVA VENDA BEM-SUCEDIDA) ---");
        console.log("Estoque do Produto (antes da venda):", produtoAtualNoEstoque.quantidade);
        console.log("Quantidade Vendida:", quantidadeVendida);
        console.log("Estoque Teórico Final:", estoqueAposVendaTeorica);
        console.log("Condição (Estoque Teórico Final <= 5):", estoqueAposVendaTeorica <= 5);

        if (estoqueAposVendaTeorica <= 5) {
          toast.warning("⚠ Estoque baixo! Reponha o produto após esta venda.");
        }
      } else {
        toast.error("Erro ao adicionar venda.");
      }
    }
    cancelarEdicao(); // Limpa formulário após sucesso

    // Recarregar produtos para refletir a mudança de estoque
    carregarDados();

  } catch (error) {
    console.error("Erro na operação de vendas (bloco catch):", error); // Renomeei para maior clareza
    toast.error("Erro na operação de vendas. Verifique sua conexão.");
  }
}

  async function handleExcluir(id: number) {
    if (!confirm("Confirma exclusão desta venda?")) return;
    
    try {
      const res = await fetch(`/api/vendas/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVendas(vendas.filter(v => v.id !== id));
        if (editandoVenda?.id === id) cancelarEdicao();
        toast.success("Venda excluída com sucesso!");
        // Recarregar produtos para refletir o estoque, se a exclusão devolver ao estoque
        carregarDados(); 
      } else {
        toast.error("Erro ao excluir venda.");
      }
    } catch (error) {
      console.error("Erro ao excluir venda:", error);
      toast.error("Erro ao excluir venda. Verifique sua conexão.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-purple-200">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
          <span className="text-purple-700 font-medium">Carregando dados...</span>
        </div>
      </div>
    );
  }

  // Estatísticas de vendas
  const totalVendasConcluidas = vendas.filter(v => v.status === 'Concluída').length;
  const faturamentoTotal = vendas.reduce((acc, v) => acc + (Number(v.precoTotal)), 0);
  const mediaPorVenda = totalVendasConcluidas > 0 ? faturamentoTotal / totalVendasConcluidas : 0;
  const vendasPendentes = vendas.filter(v => v.status === 'Pendente').length;

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      {/* ATENÇÃO AQUI: autoClose está definido como false para o teste */}
      <ToastContainer position="top-right" autoClose={false} /> 
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header da Página de Vendas */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-purple-200 mb-4">
            <ShoppingCart className="text-purple-600" size={28} />
            <h1 className="text-2xl font-bold text-purple-700">Controle de Vendas</h1>
          </div>
          <p className="text-gray-600">
            {editandoVenda ? "Editando registro de venda" : "Gerencie e registre suas vendas aqui"}
          </p>
        </div>

        {/* Cards de Estatísticas de Vendas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <ShoppingCart className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Vendas Concluídas</p>
                <p className="text-xl font-bold text-purple-700">{totalVendasConcluidas}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-200">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500 p-2 rounded-lg">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Faturamento Total</p>
                <p className="text-xl font-bold text-pink-700">R$ {faturamentoTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-indigo-200">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-500 p-2 rounded-lg">
                <DollarSign className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Média por Venda</p>
                <p className="text-xl font-bold text-indigo-700">R$ {mediaPorVenda.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-rose-200">
            <div className="flex items-center gap-3">
              <div className="bg-rose-500 p-2 rounded-lg">
                <Users className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vendas Pendentes</p>
                <p className="text-xl font-bold text-rose-700">{vendasPendentes}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Formulário de Nova/Edição de Venda */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple-200 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 rounded-lg">
                  {editandoVenda ? <Pencil className="text-white" size={18} /> : <Plus className="text-white" size={18} />}
                </div>
                <h2 className="font-bold text-purple-700">
                  {editandoVenda ? "Editar Venda" : "Nova Venda"}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Cliente</label>
                  <input
                    value={cliente}
                    onChange={(e) => setCliente(e.target.value)}
                    placeholder="Nome do cliente"
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Produto</label>
                  <select
                    value={produtoId}
                    onChange={(e) => setProdutoId(e.target.value)}
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="">Selecione um produto</option>
                    {produtos.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nome} (Estoque: {p.quantidade})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="1"
                    value={quantidadeVendida}
                    onChange={(e) => setQuantidadeVendida(Number(e.target.value))}
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Preço Total (R$)</label>
                  <input
                    type="text" // Alterado para text pois é apenas exibição
                    readOnly
                    value={`R$ ${precoTotalVenda.toFixed(2)}`}
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Data da Venda</label>
                  <input
                    type="date"
                    value={dataVenda}
                    onChange={(e) => setDataVenda(e.target.value)}
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Venda['status'])}
                    className="w-full border-2 border-purple-200 rounded-lg px-3 py-2 bg-purple-50/50 text-purple-900 focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="Concluída">Concluída</option>
                    <option value="Pendente">Pendente</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                </div>


                <div className="flex gap-2">
                  <button
                    onClick={handleSalvar}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 transition-all flex items-center justify-center gap-2"
                  >
                    {editandoVenda ? <Save size={16} /> : <Plus size={16} />}
                    {editandoVenda ? "Salvar" : "Adicionar"}
                  </button>

                  {editandoVenda && (
                    <button
                      onClick={cancelarEdicao}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors flex items-center gap-2"
                    >
                      <X size={16} />
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Vendas */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-purple-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <ShoppingCart size={20} />
                  Vendas Registradas ({vendas.length})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-purple-100">
                    <tr>
                      <th className="p-3 text-left font-medium text-purple-800">Cliente</th>
                      <th className="p-3 text-left font-medium text-purple-800">Produto</th>
                      <th className="p-3 text-left font-medium text-purple-800">Qtd Vendida</th>
                      <th className="p-3 text-left font-medium text-purple-800">Preço Total</th>
                      <th className="p-3 text-left font-medium text-purple-800">Data</th>
                      <th className="p-3 text-left font-medium text-purple-800">Status</th>
                      <th className="p-3 text-center font-medium text-purple-800">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendas.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <ShoppingCart className="text-purple-300" size={40} />
                            <p className="text-purple-600 font-medium">Nenhuma venda registrada ainda</p>
                            <p className="text-purple-400 text-sm">Use o formulário ao lado para adicionar uma nova venda</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      vendas.map((venda, index) => (
                        <tr
                          key={venda.id}
                          className={`border-t border-purple-200 hover:bg-purple-50 transition-colors ${
                            editandoVenda?.id === venda.id ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <td className="p-3 font-medium text-purple-900">{venda.cliente}</td>
                          <td className="p-3 text-purple-800">{venda.produto?.nome || "Produto Não Encontrado"}</td>
                          <td className="p-3 text-purple-800">{venda.quantidade}</td>
                          <td className="p-3 font-semibold text-purple-900">
                            R$ {Number(venda.precoTotal).toFixed(2)}
                          </td>
                          <td className="p-3 text-sm text-gray-700">{venda.dataVenda}</td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${
                              venda.status === 'Concluída' ? 'bg-green-100 text-green-800' :
                              venda.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {venda.status}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditar(venda)}
                                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors"
                                title="Editar"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleExcluir(venda.id)}
                                className="bg-red-100 text-red-600 p-2 rounded hover:bg-red-200 transition-colors"
                                title="Excluir"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}