//app/api/relatorios/route.ts (VERSÃO CORRIGIDA)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const tipo = searchParams.get('tipo');
    const dataInicio = searchParams.get('dataInicio');
    const dataFim = searchParams.get('dataFim');

    // Se não especificar tipo, retorna resumo geral
    if (!tipo) {
      return await getResumoGeral(dataInicio, dataFim);
    }

    switch (tipo) {
      case 'vendas':
        return await getRelatorioVendas(dataInicio, dataFim);
      case 'estoque':
        return await getRelatorioEstoque();
      case 'caixa':
        return await getRelatorioCaixa(dataInicio, dataFim);
      case 'financeiro':
        return await getRelatorioFinanceiro(dataInicio, dataFim);
      default:
        return NextResponse.json(
          { error: "Tipo de relatório inválido. Use: vendas, estoque, caixa ou financeiro" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erro no GET /api/relatorios:", error);
    return NextResponse.json(
      { error: "Erro interno ao gerar relatório." },
      { status: 500 }
    );
  }
}

// Função para relatório de vendas
async function getRelatorioVendas(dataInicio?: string | null, dataFim?: string | null) {
  const whereCondition: any = {};
  
  if (dataInicio && dataFim) {
    whereCondition.dataVenda = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const vendas = await prisma.venda.findMany({
    where: whereCondition,
    include: { produto: true },
    orderBy: { criadoEm: "desc" },
  });

  const resumo = {
    totalVendas: vendas.length,
    faturamentoTotal: vendas.reduce((acc, venda) => acc + Number(venda.preco), 0),
    quantidadeTotalVendida: vendas.reduce((acc, venda) => acc + venda.quantidade, 0),
    ticketMedio: vendas.length > 0 ? 
      vendas.reduce((acc, venda) => acc + Number(venda.preco), 0) / vendas.length : 0,
  };

  // Top produtos mais vendidos
  const produtosMaisVendidos = await prisma.venda.groupBy({
    by: ['produtoId'],
    where: whereCondition,
    _sum: {
      quantidade: true,
      preco: true,
    },
    _count: {
      id: true,
    },
    orderBy: {
      _sum: {
        quantidade: 'desc',
      },
    },
    take: 10,
  });

  const produtosDetalhados = await Promise.all(
    produtosMaisVendidos.map(async (item) => {
      const produto = await prisma.produto.findUnique({
        where: { id: item.produtoId },
      });
      return {
        produto: produto?.nome || 'Produto não encontrado',
        quantidadeVendida: item._sum.quantidade || 0,
        faturamento: Number(item._sum.preco) || 0,
        numeroVendas: item._count.id,
      };
    })
  );

  return NextResponse.json({
    tipo: 'vendas',
    periodo: { dataInicio, dataFim },
    resumo,
    vendas,
    produtosMaisVendidos: produtosDetalhados,
  });
}

// Função para relatório de estoque
async function getRelatorioEstoque() {
  const produtos = await prisma.produto.findMany({
    orderBy: { quantidade: 'asc' },
  });

  const resumo = {
    totalProdutos: produtos.length,
    produtosComEstoqueBaixo: produtos.filter(p => p.quantidade <= 5).length,
    produtosSemEstoque: produtos.filter(p => p.quantidade === 0).length,
    valorTotalEstoque: produtos.reduce((acc, p) => acc + (Number(p.preco) * p.quantidade), 0),
  };

  const produtosComAlerta = produtos.map(p => ({
    ...p,
    preco: Number(p.preco), // Garantir que o preço seja number
    alertaEstoque: p.quantidade <= 5,
    semEstoque: p.quantidade === 0,
    valorTotal: Number(p.preco) * p.quantidade,
  }));

  return NextResponse.json({
    tipo: 'estoque',
    resumo,
    produtos: produtosComAlerta,
  });
}

// Função para relatório de caixa
async function getRelatorioCaixa(dataInicio?: string | null, dataFim?: string | null) {
  const whereCondition: any = {};
  
  if (dataInicio && dataFim) {
    whereCondition.criadoEm = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const movimentos = await prisma.caixa.findMany({
    where: whereCondition,
    orderBy: { criadoEm: "desc" },
  });

  const resumo = {
    totalMovimentos: movimentos.length,
    totalEntradas: movimentos
      .filter(m => m.tipo === "ENTRADA")
      .reduce((acc, m) => acc + Number(m.valor), 0),
    totalSaidas: movimentos
      .filter(m => m.tipo === "SAIDA")
      .reduce((acc, m) => acc + Number(m.valor), 0),
    saldoPeriodo: 0,
  };

  // Calcula o saldo do período
  resumo.saldoPeriodo = resumo.totalEntradas - resumo.totalSaidas;

  return NextResponse.json({
    tipo: 'caixa',
    periodo: { dataInicio, dataFim },
    resumo,
    movimentos,
  });
}

// Função para relatório financeiro consolidado
async function getRelatorioFinanceiro(dataInicio?: string | null, dataFim?: string | null) {
  const whereCondition: any = {};
  
  if (dataInicio && dataFim) {
    whereCondition.dataVenda = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const whereConditionCaixa: any = {};
  
  if (dataInicio && dataFim) {
    whereConditionCaixa.criadoEm = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  // Dados de vendas
  const vendas = await prisma.venda.findMany({
    where: whereCondition,
    include: { produto: true },
  });

  // Dados de caixa
  const movimentosCaixa = await prisma.caixa.findMany({
    where: whereConditionCaixa,
  });

  const resumoFinanceiro = {
    faturamentoBruto: vendas.reduce((acc, v) => acc + Number(v.preco), 0),
    entradasCaixa: movimentosCaixa
      .filter(m => m.tipo === "ENTRADA")
      .reduce((acc, m) => acc + Number(m.valor), 0),
    saidasCaixa: movimentosCaixa
      .filter(m => m.tipo === "SAIDA")
      .reduce((acc, m) => acc + Number(m.valor), 0),
    saldoLiquido: 0, // Será calculado abaixo
    totalVendas: vendas.length,
    totalMovimentosCaixa: movimentosCaixa.length,
  };

  resumoFinanceiro.saldoLiquido = 
    resumoFinanceiro.entradasCaixa - resumoFinanceiro.saidasCaixa;

  return NextResponse.json({
    tipo: 'financeiro',
    periodo: { dataInicio, dataFim },
    resumo: resumoFinanceiro,
    detalhes: {
      vendas: vendas.length,
      movimentosCaixa: movimentosCaixa.length,
    },
  });
}

// Função auxiliar para buscar dados sem retornar Response
async function getRelatorioVendasData(dataInicio?: string | null, dataFim?: string | null) {
  const whereCondition: any = {};
  
  if (dataInicio && dataFim) {
    whereCondition.dataVenda = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const vendas = await prisma.venda.findMany({
    where: whereCondition,
    include: { produto: true },
    orderBy: { criadoEm: "desc" },
  });

  return {
    totalVendas: vendas.length,
    faturamentoTotal: vendas.reduce((acc, venda) => acc + Number(venda.preco), 0),
    quantidadeTotalVendida: vendas.reduce((acc, venda) => acc + venda.quantidade, 0),
    ticketMedio: vendas.length > 0 ? 
      vendas.reduce((acc, venda) => acc + Number(venda.preco), 0) / vendas.length : 0,
  };
}

async function getRelatorioEstoqueData() {
  const produtos = await prisma.produto.findMany({
    orderBy: { quantidade: 'asc' },
  });

  return {
    totalProdutos: produtos.length,
    produtosComEstoqueBaixo: produtos.filter(p => p.quantidade <= 5).length,
    produtosSemEstoque: produtos.filter(p => p.quantidade === 0).length,
    valorTotalEstoque: produtos.reduce((acc, p) => acc + (Number(p.preco) * p.quantidade), 0),
  };
}

async function getRelatorioCaixaData(dataInicio?: string | null, dataFim?: string | null) {
  const whereCondition: any = {};
  
  if (dataInicio && dataFim) {
    whereCondition.criadoEm = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const movimentos = await prisma.caixa.findMany({
    where: whereCondition,
    orderBy: { criadoEm: "desc" },
  });

  const totalEntradas = movimentos
    .filter(m => m.tipo === "ENTRADA")
    .reduce((acc, m) => acc + Number(m.valor), 0);
  
  const totalSaidas = movimentos
    .filter(m => m.tipo === "SAIDA")
    .reduce((acc, m) => acc + Number(m.valor), 0);

  return {
    totalMovimentos: movimentos.length,
    totalEntradas,
    totalSaidas,
    saldoPeriodo: totalEntradas - totalSaidas,
  };
}

async function getRelatorioFinanceiroData(dataInicio?: string | null, dataFim?: string | null) {
  const whereConditionVendas: any = {};
  const whereConditionCaixa: any = {};
  
  if (dataInicio && dataFim) {
    whereConditionVendas.dataVenda = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
    whereConditionCaixa.criadoEm = {
      gte: new Date(dataInicio),
      lte: new Date(dataFim + 'T23:59:59.999Z'),
    };
  }

  const vendas = await prisma.venda.findMany({
    where: whereConditionVendas,
  });

  const movimentosCaixa = await prisma.caixa.findMany({
    where: whereConditionCaixa,
  });

  const faturamentoBruto = vendas.reduce((acc, v) => acc + Number(v.preco), 0);
  const entradasCaixa = movimentosCaixa
    .filter(m => m.tipo === "ENTRADA")
    .reduce((acc, m) => acc + Number(m.valor), 0);
  const saidasCaixa = movimentosCaixa
    .filter(m => m.tipo === "SAIDA")
    .reduce((acc, m) => acc + Number(m.valor), 0);

  return {
    faturamentoBruto,
    entradasCaixa,
    saidasCaixa,
    saldoLiquido: entradasCaixa - saidasCaixa,
    totalVendas: vendas.length,
    totalMovimentosCaixa: movimentosCaixa.length,
  };
}

// Função para resumo geral (CORRIGIDA)
async function getResumoGeral(dataInicio?: string | null, dataFim?: string | null) {
  try {
    const [vendas, estoque, caixa, financeiro] = await Promise.all([
      getRelatorioVendasData(dataInicio, dataFim),
      getRelatorioEstoqueData(),
      getRelatorioCaixaData(dataInicio, dataFim),
      getRelatorioFinanceiroData(dataInicio, dataFim),
    ]);

    return NextResponse.json({
      tipo: 'geral',
      periodo: { dataInicio, dataFim },
      resumoGeral: {
        vendas,
        estoque,
        caixa,
        financeiro,
      },
    });
  } catch (error) {
    console.error("Erro ao gerar resumo geral:", error);
    throw error;
  }
}