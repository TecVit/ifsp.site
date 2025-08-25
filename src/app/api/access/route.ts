// GET api/access/route.ts

import { db } from "@/utils/firebase/config";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password");
  const rawAccept = url.searchParams.get("accept");
  const accept = rawAccept === null ? null : rawAccept === "true";

  if (password !== process.env.password) {
    return NextResponse.json({
      status: 500,
      message: "Senha inválida!",
    }, { status: 500 });
  }

  if (accept !== true && accept !== false) {
    return NextResponse.json({
      status: 400,
      message: "Campo 'accept' obrigatório!",
    }, { status: 400 });
  }
  
  const configRef = doc(db, "config", "auth");

  await setDoc(configRef, {
    access: accept,
  }, { merge: true });

  if (accept) {
    return NextResponse.json({
      status: 200,
      message: "Acesso ao desafio ativado!",
    });
  } else {
    return NextResponse.json({
      status: 200,
      message: "Acesso ao desafio desativado!",
    });
  }
}