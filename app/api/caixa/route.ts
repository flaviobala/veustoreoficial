//app/api/caixa/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const movimentos = await prisma.caixa.findMany({
      orderBy: { criadoEm: "desc" },
    });
    
    // Calcula o saldo atual
    const saldoAtual = movimentos.reduce((acc, movimento) => {
      if (movimento.tipo === "ENTRADA") {
        return acc + Number(movimento.valor);
      } else {
        return acc - Number(movimento.valor);
      }
    }, 0);

    return NextResponse.json({
      movimentos,
      saldoAtual,
      totalEntradas: movimentos
        .filter(m => m.tipo === "ENTRADA")
        .reduce((acc, m) => acc + Number(m.valor), 0),
      totalSaidas: movimentos
        .filter(m => m.tipo === "SAIDA")
        .reduce((acc, m) => acc + Number(m.valor), 0),
    });
  } catch (error) {
    console.error("Erro no GET /api/caixa:", error);
    return NextResponse.json(
      { error: "Erro ao buscar movimentos do caixa." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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

    // Cria o movimento no caixa
    const novoMovimento = await prisma.caixa.create({
      data: {
        descricao,
        tipo,
        valor: Number(valor),
      },
    });

    return NextResponse.json(novoMovimento, { status: 201 });
  } catch (error) {
    console.error("Erro no POST /api/caixa:", error);
    return NextResponse.json(
      { error: "Erro interno ao registrar movimento." },
      { status: 500 }
    );
  }
}

// TODO: Implementar o método PUT para atualização de movimentos
// export async function PUT(req: NextRequest) { /* ... */ }

// TODO: Implementar o método DELETE para exclusão de movimentos
// export async function DELETE(req: NextRequest) { /* ... */ }