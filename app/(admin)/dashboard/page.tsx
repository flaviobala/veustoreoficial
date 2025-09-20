// app/(admin)/dashboard/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import DashboardCards from '../../(admin)/dashboard/cards';

// Defina os tipos de dados para os dados fictícios que ainda não têm API
type DailySalesData = {
  day: string;
  vendas: number;
  meta: number;
};

type CategoryData = {
  name: string;
  value: number;
  color: string;
};

type TopProduct = {
  name: string;
  sales: number;
  image: string;
  trend: string;
  color: string;
};

// Componente separado para o relógio em tempo real
function RealTimeClock() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setCurrentTime(new Date());
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  if (!mounted || !currentTime) {
    return (
      <div className="text-gray-500">
        Carregando data...
      </div>
    );
  }

  return (
    <div className="text-gray-500" suppressHydrationWarning={true}>
      {currentTime.toLocaleDateString('pt-BR')} - {currentTime.toLocaleTimeString('pt-BR')}
    </div>
  );
}

export default function DashboardPage() {
  // Dados mockados (fictícios) para os gráficos.
  const salesData: DailySalesData[] = [
    { day: 'Seg', vendas: 2400, meta: 3000 },
    { day: 'Ter', vendas: 1398, meta: 3000 },
    { day: 'Qua', vendas: 9800, meta: 3000 },
    { day: 'Qui', vendas: 3908, meta: 3000 },
    { day: 'Sex', vendas: 4800, meta: 3000 },
    { day: 'Sáb', vendas: 3800, meta: 3000 },
    { day: 'Dom', vendas: 4300, meta: 3000 },
  ];

  const categoryData: CategoryData[] = [
    { name: 'Vestidos', value: 400, color: '#ec4899' },
    { name: 'Blusas', value: 300, color: '#f97316' },
    { name: 'Calças', value: 200, color: '#8b5cf6' },
    { name: 'Acessórios', value: 100, color: '#06b6d4' },
  ];

  const topProducts: TopProduct[] = [
    { name: 'Vestido Floral Rosa', sales: 45, image: '👗', trend: '+12%', color: 'from-pink-500 to-rose-500' },
    { name: 'Blusa Manga Longa', sales: 38, image: '👚', trend: '+8%', color: 'from-purple-500 to-indigo-500' },
    { name: 'Calça Jeans Premium', sales: 32, image: '👖', trend: '+15%', color: 'from-blue-500 to-cyan-500' },
  ];

  // Componentes Auxiliares
  function MetricCard({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: string; color: string }) {
    return (
      <div className={`bg-gradient-to-r ${color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-between`}>
        <div>
          <h3 className="text-sm font-semibold opacity-80">{title}</h3>
          <p className="text-2xl font-bold mt-1">{value}</p>
          <p className="text-xs opacity-70">{change}</p>
        </div>
        <span className="text-4xl opacity-70">{icon}</span>
      </div>
    );
  }

  function AlertItem({ icon, text, color }: { icon: string; text: string; color: string }) {
    return (
      <div className={`flex items-start p-4 rounded-xl ${color} text-sm`}>
        <span className="text-xl mr-3">{icon}</span>
        <p>{text}</p>
      </div>
    );
  }

  function QuickAction({ icon, text, color }: { icon: string; text: string; color: string }) {
    return (
      <button className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-200 bg-gradient-to-r ${color} text-white hover:scale-105`}>
        <span className="text-3xl mb-2">{icon}</span>
        <span className="text-sm font-medium text-center">{text}</span>
      </button>
    );
  }

  function VipClient({ name, purchases, avatar, level }: { name: string; purchases: number; avatar: string; level: string }) {
    return (
      <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">{avatar}</div>
        <div>
          <p className="font-semibold text-gray-800">{name}</p>
          <p className="text-sm text-gray-500">{purchases} compras</p>
        </div>
        <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">{level}</span>
      </div>
    );
  }

  function Activity({ time, text, icon }: { time: string; text: string; icon: string }) {
    return (
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
        <span className="text-xl">{icon}</span>
        <div>
          <p className="text-gray-700 text-sm">{text}</p>
          <p className="text-gray-500 text-xs">{time}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header de Boas-vindas */}
      <div className="bg-gradient-to-r from-white/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-pink-200/50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Olá, Verônica! ✨
            </h1>
            <p className="text-lg text-gray-600 mb-4">Que tal começarmos este dia com vendas incríveis?</p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-gray-600">Sistema Online</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🌤️</span>
                <span className="text-gray-600">25°C - Perfeito para vendas!</span>
              </div>
              <RealTimeClock />
            </div>
          </div>
          <div className="text-right">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
              <div className="text-sm opacity-90">Meta do Mês</div>
              <div className="text-2xl font-bold">78%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <DashboardCards />

      {/* Gráficos e Informações */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vendas por Dia</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#888" />
              <YAxis tickLine={false} axisLine={false} stroke="#888" />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Line type="monotone" dataKey="vendas" stroke="#ec4899" activeDot={{ r: 8 }} strokeWidth={2} name="Vendas" />
              <Line type="monotone" dataKey="meta" stroke="#8b5cf6" activeDot={{ r: 8 }} strokeWidth={2} name="Meta" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Vendas por Categoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {categoryData.map((entry, index) => (
              <div key={`legend-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
                {entry.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Seção de Principais Produtos, Alertas, Ações Rápidas, Clientes VIP, Atividade Recente */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Principais Produtos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 rounded-xl shadow-md bg-gradient-to-r ${product.color} text-white`}
                >
                  <span className="text-3xl mr-3">{product.image}</span>
                  <div>
                    <p className="font-semibold">{product.name}</p>
                    <p className="text-sm opacity-90">{product.sales} vendas ({product.trend})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Alertas Importantes</h2>
            <div className="space-y-3">
              <AlertItem icon="🚨" text="Estoque baixo: Blusa de Seda Preta." color="bg-red-50/50 text-red-700" />
              <AlertItem icon="💡" text="Nova promoção de verão ativada!" color="bg-yellow-50/50 text-yellow-700" />
              <AlertItem icon="💬" text="Cliente solicitou troca do pedido #20230510." color="bg-blue-50/50 text-blue-700" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <QuickAction icon="➕" text="Novo Produto" color="from-green-500 to-emerald-500" />
              <QuickAction icon="📦" text="Gerenciar Estoque" color="from-blue-500 to-cyan-500" />
              <QuickAction icon="📊" text="Ver Relatórios" color="from-orange-500 to-yellow-500" />
              <QuickAction icon="✍️" text="Registrar Venda" color="from-purple-500 to-indigo-500" />
              <QuickAction icon="✉️" text="Enviar Notificação" color="from-pink-500 to-rose-500" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Clientes VIP</h2>
            <div className="space-y-3">
              <VipClient name="Isabela Costa" purchases={78} avatar="👑" level="Ouro" />
              <VipClient name="Fernanda Souza" purchases={62} avatar="💎" level="Prata" />
              <VipClient name="Mariana Lima" purchases={55} avatar="🌟" level="Bronze" />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              <Activity time="10 min atrás" text="Novo pedido #20230512 realizado." icon="🛒" />
              <Activity time="30 min atrás" text="Estoque de 'Saia Midi Floral' atualizado." icon="📦" />
              <Activity time="1 hora atrás" text="Pagamento de pedido #20230511 confirmado." icon="💳" />
              <Activity time="2 horas atrás" text="Cliente 'Ana Paula' cadastrada." icon="👤" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// app/(admin)/dashboard/page.tsx
// 'use client'; // Mantenha este para usar hooks como useState e useEffect
// import { useState, useEffect } from 'react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
// import DashboardCards from '../../(admin)/dashboard/cards'; // Caminho para o seu DashboardCards

// // Defina os tipos de dados para os dados fictícios que ainda não têm API
// type DailySalesData = {
//   day: string;
//   vendas: number;
//   meta: number;
// };

// type CategoryData = {
//   name: string;
//   value: number;
//   color: string;
// };

// type TopProduct = {
//   name: string;
//   sales: number;
//   image: string;
//   trend: string;
//   color: string;
// };

// export default function DashboardPage() {
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Dados mockados (fictícios) para os gráficos.
//   // Você precisará substituir estes por chamadas de API reais como discutimos anteriormente.
//   const salesData: DailySalesData[] = [
//     { day: 'Seg', vendas: 2400, meta: 3000 },
//     { day: 'Ter', vendas: 1398, meta: 3000 },
//     { day: 'Qua', vendas: 9800, meta: 3000 },
//     { day: 'Qui', vendas: 3908, meta: 3000 },
//     { day: 'Sex', vendas: 4800, meta: 3000 },
//     { day: 'Sáb', vendas: 3800, meta: 3000 },
//     { day: 'Dom', vendas: 4300, meta: 3000 },
//   ];

//   const categoryData: CategoryData[] = [
//     { name: 'Vestidos', value: 400, color: '#ec4899' },
//     { name: 'Blusas', value: 300, color: '#f97316' },
//     { name: 'Calças', value: 200, color: '#8b5cf6' },
//     { name: 'Acessórios', value: 100, color: '#06b6d4' },
//   ];

//   const topProducts: TopProduct[] = [
//     { name: 'Vestido Floral Rosa', sales: 45, image: '👗', trend: '+12%', color: 'from-pink-500 to-rose-500' },
//     { name: 'Blusa Manga Longa', sales: 38, image: '👚', trend: '+8%', color: 'from-purple-500 to-indigo-500' },
//     { name: 'Calça Jeans Premium', sales: 32, image: '👖', trend: '+15%', color: 'from-blue-500 to-cyan-500' },
//   ];

//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);

//   // Componentes Auxiliares (mantidos aqui para simplicidade, mas podem ser movidos para _components)
//   function MetricCard({ title, value, change, icon, color }: { title: string; value: string; change: string; icon: string; color: string }) {
//     return (
//       <div className={`bg-gradient-to-r ${color} text-white p-5 rounded-2xl shadow-lg flex items-center justify-between`}>
//         <div>
//           <h3 className="text-sm font-semibold opacity-80">{title}</h3>
//           <p className="text-2xl font-bold mt-1">{value}</p>
//           <p className="text-xs opacity-70">{change}</p>
//         </div>
//         <span className="text-4xl opacity-70">{icon}</span>
//       </div>
//     );
//   }

//   function AlertItem({ icon, text, color }: { icon: string; text: string; color: string }) {
//     return (
//       <div className={`flex items-start p-4 rounded-xl ${color} text-sm`}>
//         <span className="text-xl mr-3">{icon}</span>
//         <p>{text}</p>
//       </div>
//     );
//   }

//   function QuickAction({ icon, text, color }: { icon: string; text: string; color: string }) {
//     return (
//       <button className={`flex flex-col items-center justify-center p-4 rounded-xl shadow-md transition-all duration-200 ${color} text-white hover:scale-105`}>
//         <span className="text-3xl mb-2">{icon}</span>
//         <span className="text-sm font-medium text-center">{text}</span>
//       </button>
//     );
//   }

//   function VipClient({ name, purchases, avatar, level }: { name: string; purchases: number; avatar: string; level: string }) {
//     return (
//       <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
//         <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-xl">{avatar}</div>
//         <div>
//           <p className="font-semibold text-gray-800">{name}</p>
//           <p className="text-sm text-gray-500">{purchases} compras</p>
//         </div>
//         <span className="ml-auto text-xs font-semibold px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">{level}</span>
//       </div>
//     );
//   }

//   function Activity({ time, text, icon }: { time: string; text: string; icon: string }) {
//     return (
//       <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
//         <span className="text-xl">{icon}</span>
//         <div>
//           <p className="text-gray-700 text-sm">{text}</p>
//           <p className="text-gray-500 text-xs">{time}</p>
//         </div>
//       </div>
//     );
//   }


//   return (
//     <div className="space-y-6">
//       {/* Header de Boas-vindas */}
//       <div className="bg-gradient-to-r from-white/80 to-pink-50/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-pink-200/50">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
//               Olá, Verônica! ✨
//             </h1>
//             <p className="text-lg text-gray-600 mb-4">Que tal começarmos este dia com vendas incríveis?</p>
//             <div className="flex items-center gap-6 text-sm">
//               <div className="flex items-center gap-2">
//                 <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
//                 <span className="text-gray-600">Sistema Online</span>
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="text-2xl">🌤️</span>
//                 <span className="text-gray-600">25°C - Perfeito para vendas!</span>
//               </div>
//               <div className="text-gray-500">
//                 {currentTime.toLocaleDateString('pt-BR')} - {currentTime.toLocaleTimeString('pt-BR')}
//               </div>
//             </div>
//           </div>
//           <div className="text-right">
//             <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-2xl shadow-lg">
//               <div className="text-sm opacity-90">Meta do Mês</div>
//               <div className="text-2xl font-bold">78%</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Cards de Métricas (Total de Vendas e Total em Estoque - dados REAIS do seu DB) */}
//       <DashboardCards />

//       {/* Gráficos e Informações (usando dados fictícios por enquanto) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Vendas por Dia</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart
//               data={salesData}
//               margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
//             >
//               <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
//               <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="#888" />
//               <YAxis tickLine={false} axisLine={false} stroke="#888" />
//               <Tooltip cursor={{ strokeDasharray: '3 3' }} />
//               <Line type="monotone" dataKey="vendas" stroke="#ec4899" activeDot={{ r: 8 }} strokeWidth={2} name="Vendas" />
//               <Line type="monotone" dataKey="meta" stroke="#8b5cf6" activeDot={{ r: 8 }} strokeWidth={2} name="Meta" />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Vendas por Categoria</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={categoryData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//               >
//                 {categoryData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={entry.color} />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//           <div className="flex flex-wrap justify-center gap-4 mt-4">
//             {categoryData.map((entry, index) => (
//               <div key={`legend-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
//                 <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></span>
//                 {entry.name}
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Seção de Principais Produtos, Alertas, Ações Rápidas, Clientes VIP, Atividade Recente */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Principais Produtos</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {topProducts.map((product, index) => (
//                 <div
//                   key={index}
//                   className={`flex items-center p-4 rounded-xl shadow-md ${product.color} text-white`}
//                   style={{ background: `linear-gradient(to right, ${product.color.split(' ')[0]}, ${product.color.split(' ')[1]})` }}
//                 >
//                   <span className="text-3xl mr-3">{product.image}</span>
//                   <div>
//                     <p className="font-semibold">{product.name}</p>
//                     <p className="text-sm opacity-90">{product.sales} vendas ({product.trend})</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Alertas Importantes</h2>
//             <div className="space-y-3">
//               <AlertItem icon="🚨" text="Estoque baixo: Blusa de Seda Preta." color="bg-red-50/50 text-red-700" />
//               <AlertItem icon="💡" text="Nova promoção de verão ativada!" color="bg-yellow-50/50 text-yellow-700" />
//               <AlertItem icon="💬" text="Cliente solicitou troca do pedido #20230510." color="bg-blue-50/50 text-blue-700" />
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Ações Rápidas</h2>
//             <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//               <QuickAction icon="➕" text="Novo Produto" color="from-green-500 to-emerald-500" />
//               <QuickAction icon="📦" text="Gerenciar Estoque" color="from-blue-500 to-cyan-500" />
//               <QuickAction icon="📊" text="Ver Relatórios" color="from-orange-500 to-yellow-500" />
//               <QuickAction icon="✍️" text="Registrar Venda" color="from-purple-500 to-indigo-500" />
//               <QuickAction icon="✉️" text="Enviar Notificação" color="from-pink-500 to-rose-500" />
//             </div>
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Clientes VIP</h2>
//             <div className="space-y-3">
//               <VipClient name="Isabela Costa" purchases={78} avatar="👑" level="Ouro" />
//               <VipClient name="Fernanda Souza" purchases={62} avatar="💎" level="Prata" />
//               <VipClient name="Mariana Lima" purchases={55} avatar="🌟" level="Bronze" />
//             </div>
//           </div>

//           <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-pink-200/50">
//             <h2 className="text-xl font-bold text-gray-800 mb-4">Atividade Recente</h2>
//             <div className="space-y-3">
//               <Activity time="10 min atrás" text="Novo pedido #20230512 realizado." icon="🛒" />
//               <Activity time="30 min atrás" text="Estoque de 'Saia Midi Floral' atualizado." icon="📦" />
//               <Activity time="1 hora atrás" text="Pagamento de pedido #20230511 confirmado." icon="💳" />
//               <Activity time="2 horas atrás" text="Cliente 'Ana Paula' cadastrada." icon="👤" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }