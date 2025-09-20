//app/api/produtos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const id = Number(context.params.id);
  const body = await req.json();

  const produtoAtualizado = await prisma.produto.update({
    where: { id },
    data: {
      nome: body.nome,
      quantidade: body.quantidade,
      preco: body.preco,
    },
  });

  return NextResponse.json(produtoAtualizado);
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  await prisma.produto.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Produto excluído com sucesso" });
}