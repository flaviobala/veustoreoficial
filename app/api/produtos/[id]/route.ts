// app/api/produtos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

function parseId(raw: unknown) {
  const id = typeof raw === "string" ? Number(raw) : Number(String(raw));
  if (Number.isNaN(id)) return null;
  return id;
}

export async function PUT(req: NextRequest, context: any) {
  try {
    const id = parseId(context?.params?.id);
    if (id === null) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const body = await req.json();

    const produtoAtualizado = await prisma.produto.update({
      where: { id },
      data: {
        nome: body.nome,
        quantidade: body.quantidade,
        preco: body.preco,
      },
    });

    return NextResponse.json(produtoAtualizado, { status: 200 });
  } catch (error: any) {
    // Se for erro de não encontrado do Prisma (P2025), retorna 404
    if (error?.code === "P2025") {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }
    console.error("PUT /api/produtos/[id] error:", error);
    return NextResponse.json({ message: "Erro ao atualizar produto" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    const id = parseId(context?.params?.id);
    if (id === null) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    await prisma.produto.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Produto excluído com sucesso" }, { status: 200 });
  } catch (error: any) {
    if (error?.code === "P2025") {
      return NextResponse.json({ message: "Produto não encontrado" }, { status: 404 });
    }
    console.error("DELETE /api/produtos/[id] error:", error);
    return NextResponse.json({ message: "Erro ao excluir produto" }, { status: 500 });
  }
}
