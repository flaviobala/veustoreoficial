//app/api/produtos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
   const produtos = await prisma.produto.findMany();
//   return NextResponse.json(produtos);
// }
const produtosComAlerta = produtos.map((p) => ({
    ...p,
    alertaEstoque: p.quantidade <= 5, // alerta se 5 unidades ou menos
  }));

  return NextResponse.json(produtosComAlerta);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const novoProduto = await prisma.produto.create({
    data: {
      nome: body.nome,
      quantidade: body.quantidade,
      preco: body.preco,
    },
  });

  return NextResponse.json(novoProduto, { status: 201 });
}