//app/api/vendas/route.ts (VERSÃO ATUALIZADA COM INTEGRAÇÃO AO CAIXA)
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vendas = await prisma.venda.findMany({
    include: { produto: true },
    orderBy: { criadoEm: "desc" },
  });
  return NextResponse.json(vendas);
}

export async function POST(req: NextRequest) {
  try {
    // 1. Captura todos os campos necessários do corpo da requisição
    const body = await req.json();
    const { produtoId, quantidade, precoTotal, cliente, dataVenda, status } = body;

    // Validação básica dos campos
    if (!produtoId || !quantidade || !precoTotal || !cliente || !dataVenda || !status) {
      return NextResponse.json(
        { error: "Dados incompletos para registrar a venda." },
        { status: 400 }
      );
    }

    // 2. Verifica se o produto existe
    const produtoAtual = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produtoAtual) {
      return NextResponse.json(
        { error: "Produto não encontrado no estoque." },
        { status: 404 }
      );
    }

    // 3. Verifica estoque suficiente
    if (produtoAtual.quantidade < quantidade) {
      return NextResponse.json(
        { error: `Estoque insuficiente! Disponível: ${produtoAtual.quantidade}` },
        { status: 400 }
      );
    }

    // 4. Inicia uma transação para garantir consistência
    const resultado = await prisma.$transaction(async (tx) => {
      // 4.1 Cria a venda
      const novaVenda = await tx.venda.create({
        data: {
          produtoId,
          quantidade,
          preco: precoTotal,
          cliente,
          dataVenda,
          status,
        },
      });

      // 4.2 Atualiza o estoque do produto
      await tx.produto.update({
        where: { id: produtoId },
        data: {
          quantidade: produtoAtual.quantidade - quantidade,
        },
      });

      // 4.3 Registra entrada no caixa (apenas se venda for concluída)
      if (status === "Concluída") {
        await tx.caixa.create({
          data: {
            descricao: `Venda - ${produtoAtual.nome} (${quantidade}x) - Cliente: ${cliente}`,
            tipo: "ENTRADA",
            valor: precoTotal,
          },
        });
      }

      return novaVenda;
    });

    // 5. Retorna a venda criada com os dados do produto incluídos
    const vendaComProduto = await prisma.venda.findUnique({
      where: { id: resultado.id },
      include: { produto: true },
    });

    return NextResponse.json(vendaComProduto, { status: 201 });
  } catch (error) {
    console.error("Erro no POST /api/vendas:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar venda." },
      { status: 500 }
    );
  }
}

// Método PUT para atualizar vendas (com impacto no caixa)
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, produtoId, quantidade, precoTotal, cliente, dataVenda, status } = body;

    if (!id) {
      return NextResponse.json(
        { error: "ID da venda é obrigatório para atualização." },
        { status: 400 }
      );
    }

    // Busca a venda atual
    const vendaAtual = await prisma.venda.findUnique({
      where: { id },
      include: { produto: true },
    });

    if (!vendaAtual) {
      return NextResponse.json(
        { error: "Venda não encontrada." },
        { status: 404 }
      );
    }

    // Busca o produto novo (pode ser o mesmo)
    const produtoNovo = await prisma.produto.findUnique({
      where: { id: produtoId },
    });

    if (!produtoNovo) {
      return NextResponse.json(
        { error: "Produto não encontrado." },
        { status: 404 }
      );
    }

    // Inicia transação para atualizar venda e ajustar estoque/caixa
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Reverte o estoque da venda anterior
      await tx.produto.update({
        where: { id: vendaAtual.produtoId },
        data: {
          quantidade: vendaAtual.produto.quantidade + vendaAtual.quantidade,
        },
      });

      // 2. Verifica estoque disponível para a nova quantidade
      const produtoAtualizado = await tx.produto.findUnique({
        where: { id: produtoId },
      });

      if (!produtoAtualizado || produtoAtualizado.quantidade < quantidade) {
        throw new Error(`Estoque insuficiente! Disponível: ${produtoAtualizado?.quantidade || 0}`);
      }

      // 3. Aplica nova quantidade ao estoque
      await tx.produto.update({
        where: { id: produtoId },
        data: {
          quantidade: produtoAtualizado.quantidade - quantidade,
        },
      });

      // 4. Atualiza a venda
      const vendaAtualizada = await tx.venda.update({
        where: { id },
        data: {
          produtoId,
          quantidade,
          preco: precoTotal,
          cliente,
          dataVenda,
          status,
        },
      });

      // 5. Ajusta movimentação no caixa se necessário
      // Remove entrada anterior se venda estava concluída
      if (vendaAtual.status === "Concluída") {
        // Aqui você pode implementar lógica para remover/ajustar entrada anterior
        // Por simplicidade, estamos criando uma saída de ajuste
        await tx.caixa.create({
          data: {
            descricao: `Ajuste - Cancelamento venda anterior - ${vendaAtual.produto.nome}`,
            tipo: "SAIDA",
            valor: vendaAtual.preco,
          },
        });
      }

      // Adiciona nova entrada se venda atual está concluída
      if (status === "Concluída") {
        await tx.caixa.create({
          data: {
            descricao: `Venda - ${produtoNovo.nome} (${quantidade}x) - Cliente: ${cliente}`,
            tipo: "ENTRADA",
            valor: precoTotal,
          },
        });
      }

      return vendaAtualizada;
    });

    // Retorna venda atualizada com produto
    const vendaComProduto = await prisma.venda.findUnique({
      where: { id: resultado.id },
      include: { produto: true },
    });

    return NextResponse.json(vendaComProduto);
  } catch (error) {
    console.error("Erro no PUT /api/vendas:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erro interno ao atualizar venda." },
      { status: 500 }
    );
  }
}