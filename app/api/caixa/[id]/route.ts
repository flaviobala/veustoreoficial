//app/api/caixa/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();
    const { descricao, tipo, valor } = body;

    // Validação básica dos campos
    if (!descricao || !tipo || !valor) {
      return NextResponse.json(
        { error: "Dados incompletos. Informe descrição, tipo e valor." },
        { status: 400 }
      );
    }

    // Valida se o tipo é válido
    if (tipo !== "ENTRADA" && tipo !== "SAIDA") {
      return NextResponse.json(
        { error: "Tipo deve ser ENTRADA ou SAIDA." },
        { status: 400 }
      );
    }

    // Valida se o valor é positivo
    if (Number(valor) <= 0) {
      return NextResponse.json(
        { error: "O valor deve ser maior que zero." },
        { status: 400 }
      );
    }

    // Verifica se o movimento existe
    const movimentoExistente = await prisma.caixa.findUnique({
      where: { id },
    });

    if (!movimentoExistente) {
      return NextResponse.json(
        { error: "Movimento não encontrado." },
        { status: 404 }
      );
    }

    // Atualiza o movimento
    const movimentoAtualizado = await prisma.caixa.update({
      where: { id },
      data: {
        descricao,
        tipo,
        valor: Number(valor),
      },
    });

    return NextResponse.json(movimentoAtualizado);
  } catch (error) {
    console.error("Erro no PUT /api/caixa/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno ao atualizar movimento." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    // Verifica se o movimento existe
    const movimentoExistente = await prisma.caixa.findUnique({
      where: { id },
    });

    if (!movimentoExistente) {
      return NextResponse.json(
        { error: "Movimento não encontrado." },
        { status: 404 }
      );
    }

    // Exclui o movimento
    await prisma.caixa.delete({
      where: { id },
    });

    return NextResponse.json({ 
      message: "Movimento excluído com sucesso",
      movimentoExcluido: movimentoExistente 
    });
  } catch (error) {
    console.error("Erro no DELETE /api/caixa/[id]:", error);
    return NextResponse.json(
      { error: "Erro interno ao excluir movimento." },
      { status: 500 }
    );
  }
}