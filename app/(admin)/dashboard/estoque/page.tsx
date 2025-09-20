"use client";
//app/admin/dashboard/estoque/page.tsx
import { useEffect, useState } from "react";
import { Pencil, Trash, Package, Plus, Save, X } from "lucide-react";

type Produto = {
  id: number;
  nome: string;
  quantidade: number;
  preco: number | string;
};

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<Produto | null>(null);

  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState(0);
  const [preco, setPreco] = useState(0);

  useEffect(() => {
    carregarProdutos();
  }, []);

  async function carregarProdutos() {
    try {
      const res = await fetch("/api/produtos");
      const data = await res.json();
      setProdutos(data || []);
    } catch (error) {
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }

  function handleEditar(p: Produto) {
    setEditando(p);
    setNome(p.nome);
    setQuantidade(Number(p.quantidade));
    setPreco(Number(p.preco));
  }

  function cancelarEdicao() {
    setEditando(null);
    setNome("");
    setQuantidade(0);
    setPreco(0);
  }

  async function handleSalvar() {
    if (!nome.trim()) {
      alert("Nome é obrigatório");
      return;
    }

    const dados = {
      nome: nome.trim(),
      quantidade,
      preco,
    };

    try {
      if (editando) {
        const res = await fetch(`/api/produtos/${editando.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
        
        if (res.ok) {
          const atualizado = await res.json();
          setProdutos(produtos.map(p => p.id === atualizado.id ? atualizado : p));
          cancelarEdicao();
        } else {
          alert("Erro ao atualizar produto");
        }
      } else {
        const res = await fetch("/api/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
        
        if (res.ok) {
          const criado = await res.json();
          setProdutos([...produtos, criado]);
          setNome("");
          setQuantidade(0);
          setPreco(0);
        } else {
          alert("Erro ao adicionar produto");
        }
      }
    } catch (error) {
      alert("Erro na operação");
    }
  }

  async function handleExcluir(id: number) {
    if (!confirm("Confirma exclusão?")) return;
    
    try {
      const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProdutos(produtos.filter(p => p.id !== id));
        if (editando?.id === id) cancelarEdicao();
      } else {
        alert("Erro ao excluir produto");
      }
    } catch (error) {
      alert("Erro ao excluir produto");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3 bg-white rounded-xl p-6 shadow-lg border border-pink-200">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
          <span className="text-pink-700 font-medium">Carregando produtos...</span>
        </div>
      </div>
    );
  }

  const totalProdutos = produtos.length;
  const valorTotal = produtos.reduce((acc, p) => acc + (Number(p.preco) * Number(p.quantidade)), 0);

  return (
    <div className="p-6 bg-gradient-to-br from-pink-50 to-purple-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-pink-200 mb-4">
            <Package className="text-pink-600" size={28} />
            <h1 className="text-2xl font-bold text-pink-700">Controle de Estoque</h1>
          </div>
          <p className="text-gray-600">
            {editando ? "Editando produto selecionado" : "Gerencie seus produtos"}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-pink-200">
            <div className="flex items-center gap-3">
              <div className="bg-pink-500 p-2 rounded-lg">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Produtos</p>
                <p className="text-xl font-bold text-pink-700">{totalProdutos}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-purple-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 p-2 rounded-lg">
                <span className="text-white font-bold">R$</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-xl font-bold text-purple-700">R$ {valorTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-rose-200">
            <div className="flex items-center gap-3">
              <div className="bg-rose-500 p-2 rounded-lg">
                {editando ? <Pencil className="text-white" size={20} /> : <Plus className="text-white" size={20} />}
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-xl font-bold text-rose-700">{editando ? "Editando" : "Pronto"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Formulário */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-pink-200 sticky top-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-2 rounded-lg">
                  {editando ? <Pencil className="text-white" size={18} /> : <Plus className="text-white" size={18} />}
                </div>
                <h2 className="font-bold text-pink-700">
                  {editando ? "Editar" : "Novo Produto"}
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-1">Nome</label>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Nome do produto"
                    className="w-full border-2 border-pink-200 rounded-lg px-3 py-2 bg-pink-50/50 text-pink-900 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-1">Quantidade</label>
                  <input
                    type="number"
                    min="0"
                    value={quantidade}
                    onChange={(e) => setQuantidade(Number(e.target.value))}
                    className="w-full border-2 border-pink-200 rounded-lg px-3 py-2 bg-pink-50/50 text-pink-900 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-pink-700 mb-1">Preço (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={preco}
                    onChange={(e) => setPreco(Number(e.target.value))}
                    className="w-full border-2 border-pink-200 rounded-lg px-3 py-2 bg-pink-50/50 text-pink-900 focus:outline-none focus:border-pink-400 transition-colors"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSalvar}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all flex items-center justify-center gap-2"
                  >
                    {editando ? <Save size={16} /> : <Plus size={16} />}
                    {editando ? "Salvar" : "Adicionar"}
                  </button>

                  {editando && (
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

          {/* Lista */}
          <div className="lg:col-span-3">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-pink-200 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-4">
                <h2 className="font-bold text-white flex items-center gap-2">
                  <Package size={20} />
                  Produtos Cadastrados ({totalProdutos})
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-pink-100">
                    <tr>
                      <th className="p-3 text-left font-medium text-pink-800">Produto</th>
                      <th className="p-3 text-left font-medium text-pink-800">Qtd</th>
                      <th className="p-3 text-left font-medium text-pink-800">Preço</th>
                      <th className="p-3 text-center font-medium text-pink-800">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produtos.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="text-center p-8">
                          <div className="flex flex-col items-center gap-3">
                            <Package className="text-pink-300" size={40} />
                            <p className="text-pink-600 font-medium">Nenhum produto cadastrado</p>
                            <p className="text-pink-400 text-sm">Use o formulário ao lado para adicionar</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      produtos.map((produto, index) => (
                        <tr
                          key={produto.id}
                          className={`border-t border-pink-200 hover:bg-pink-50 transition-colors ${
                            editando?.id === produto.id ? 'bg-yellow-50' : ''
                          }`}
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <div className="bg-gradient-to-r from-pink-400 to-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                {index + 1}
                              </div>
                              <span className="font-medium text-pink-900">{produto.nome}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${
                              Number(produto.quantidade) > 10 
                                ? 'bg-green-100 text-green-800' 
                                : Number(produto.quantidade) > 5 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {produto.quantidade}
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-pink-900">
                            R$ {Number(produto.preco).toFixed(2)}
                          </td>
                          <td className="p-3">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEditar(produto)}
                                className="bg-blue-100 text-blue-600 p-2 rounded hover:bg-blue-200 transition-colors"
                                title="Editar"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleExcluir(produto.id)}
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

// "use client"; versao 2.0

// import { useEffect, useState } from "react";
// import { Pencil, Trash } from "lucide-react";

// type Produto = {
//   id: number;
//   nome: string;
//   quantidade: number;
//   preco: number | string;
// };

// export default function EstoquePage() {
//   const [produtos, setProdutos] = useState<Produto[] | null>(null);
//   const [editando, setEditando] = useState<Produto | null>(null);

//   const [nome, setNome] = useState("");
//   const [quantidade, setQuantidade] = useState(0);
//   const [preco, setPreco] = useState(0);

//   useEffect(() => {
//     fetch("/api/produtos")
//       .then((res) => res.json())
//       .then((data) => setProdutos(data))
//       .catch(() => setProdutos([]));
//   }, []);

//   function handleEditar(p: Produto) {
//     setEditando(p);
//     setNome(p.nome);
//     setQuantidade(Number(p.quantidade));
//     setPreco(Number(p.preco));
//   }

//   function cancelarEdicao() {
//     setEditando(null);
//     setNome("");
//     setQuantidade(0);
//     setPreco(0);
//   }

//   async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault();

//     if (!nome.trim()) {
//       alert("Nome é obrigatório");
//       return;
//     }

//     const dados = {
//       nome: nome.trim(),
//       quantidade,
//       preco,
//     };

//     if (editando) {
//       const res = await fetch(`/api/produtos/${editando.id}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dados),
//       });
//       if (res.ok) {
//         const atualizado = await res.json();
//         setProdutos((old) =>
//           old ? old.map((p) => (p.id === atualizado.id ? atualizado : p)) : [atualizado]
//         );
//         cancelarEdicao();
//       } else {
//         alert("Erro ao atualizar");
//       }
//     } else {
//       const res = await fetch("/api/produtos", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(dados),
//       });
//       if (res.ok) {
//         const criado = await res.json();
//         setProdutos((old) => (old ? [...old, criado] : [criado]));
//         setNome("");
//         setQuantidade(0);
//         setPreco(0);
//       } else {
//         alert("Erro ao adicionar");
//       }
//     }
//   }

//   async function handleExcluir(id: number) {
//     if (!confirm("Confirma exclusão?")) return;
//     const res = await fetch(`/api/produtos/${id}`, { method: "DELETE" });
//     if (res.ok) {
//       setProdutos((old) => (old ? old.filter((p) => p.id !== id) : []));
//       if (editando?.id === id) cancelarEdicao();
//     } else {
//       alert("Erro ao excluir");
//     }
//   }

//   if (produtos === null) {
//     return <p className="p-4 text-center text-gray-600">Carregando...</p>;
//   }

//   return (
//     <div className="max-w-3xl mx-auto p-4">
//       <h1 className="text-2xl font-bold text-pink-700 mb-4">Controle de Estoque</h1>
//       <p className="text-gray-700 mb-6">{editando ? "Editando produto" : "Gerencie os produtos abaixo"}</p>

//       <form onSubmit={handleSubmit} className="mb-8 space-y-4">
//         <div>
//           <label className="block text-sm text-pink-700 mb-1">Nome</label>
//           <input
//             name="nome"
//             value={nome}
//             onChange={(e) => setNome(e.target.value)}
//             required
//             autoComplete="off"
//             className="w-full border border-pink-300 rounded px-3 py-2 bg-pink-50 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm text-pink-700 mb-1">Quantidade</label>
//             <input
//               name="quantidade"
//               type="number"
//               min={0}
//               value={quantidade}
//               onChange={(e) => setQuantidade(Number(e.target.value))}
//               required
//               className="w-full border border-pink-300 rounded px-3 py-2 bg-pink-50 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-pink-700 mb-1">Preço (R$)</label>
//             <input
//               name="preco"
//               type="number"
//               step="0.01"
//               min={0}
//               value={preco}
//               onChange={(e) => setPreco(Number(e.target.value))}
//               required
//               className="w-full border border-pink-300 rounded px-3 py-2 bg-pink-50 text-pink-900 focus:outline-none focus:ring-2 focus:ring-pink-400"
//             />
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             className="bg-pink-400 text-pink-900 px-4 py-2 rounded hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
//           >
//             {editando ? "Salvar Alterações" : "Adicionar Produto"}
//           </button>

//           {editando && (
//             <button
//               type="button"
//               onClick={cancelarEdicao}
//               className="bg-pink-100 text-pink-700 px-4 py-2 rounded hover:bg-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-300"
//             >
//               Cancelar
//             </button>
//           )}
//         </div>
//       </form>

//       <div className="overflow-auto border border-pink-300 rounded bg-pink-50">
//         <table className="min-w-full">
//           <thead className="bg-pink-200 text-pink-800">
//             <tr>
//               <th className="p-2 text-left">Produto</th>
//               <th className="p-2 text-left">Quantidade</th>
//               <th className="p-2 text-left">Preço (R$)</th>
//               <th className="p-2 text-center">Ações</th>
//             </tr>
//           </thead>

//           <tbody>
//             {produtos.length === 0 ? (
//               <tr>
//                 <td colSpan={4} className="text-center p-4 text-pink-700">
//                   Nenhum produto cadastrado.
//                 </td>
//               </tr>
//             ) : (
//               produtos.map((p) => (
//                 <tr key={p.id} className="border-t border-pink-300 bg-pink-50 text-pink-900">
//                   <td className="p-2">{p.nome}</td>
//                   <td className="p-2">{p.quantidade}</td>
//                   <td className="p-2">{Number(p.preco).toFixed(2)}</td>
//                   <td className="p-2 text-center flex justify-center gap-2">
//                     <button
//                       title="Editar"
//                       onClick={() => handleEditar(p)}
//                       className="text-pink-600 hover:text-pink-800"
//                       type="button"
//                     >
//                       <Pencil size={18} />
//                     </button>

//                     <button
//                       title="Excluir"
//                       onClick={() => handleExcluir(p.id)}
//                       className="text-red-600 hover:text-red-800"
//                       type="button"
//                     >
//                       <Trash size={18} />
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }
