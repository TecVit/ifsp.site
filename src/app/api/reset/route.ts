// GET api/reset/route.ts

import { db } from "@/utils/firebase/config";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";
import alunos from '@/app/(private)/alunos.json';

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const password = url.searchParams.get("password");

    if (password !== process.env.password) {
        return NextResponse.json({
            status: 500,
            message: "Senha inválida!",
        }, { status: 500 });
    }

    for (const aluno of alunos) {
      const ref = doc(db, "users", aluno.prontuario);

      await deleteDoc(ref);

      // Cria do zero
      await setDoc(ref, {
        nome: aluno.nome,
        prontuario: aluno.prontuario,
        acesso: false,
        points: 0,
      });
    }

    return NextResponse.json({
        status: 200,
        message: "Usuários resetados com sucesso!",
    });
}