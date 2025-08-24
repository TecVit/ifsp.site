// api/register-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/config"; // ajuste se necessário
import { doc, setDoc } from "firebase/firestore";
import { xorEncode } from "@/utils/functions";

const questions = [
  {
    uuid: "2173108b-320a-4885-a65e-3aea09aea7d7",
    question: "Identifique o e-mail do atacante",
    example: "Dica: ***c***e@***********",
    answer: "atacante@example.com",
    points: 100,
  },
  {
    uuid: "a1b2c3d4-5678-9101-1121-314151617181",
    question: "Qual é o nome do atacante",
    example: "",
    answer: "João Silva",
    points: 100,
  },
  {
    uuid: "b2c3d4e5-6789-1011-1213-141516171819",
    question: "Identifique o link suspeito presente no e-mail",
    example: "",
    answer: "http://seguranca-banco.fake",
    points: 100,
  },
  {
    uuid: "c3d4e5f6-7891-0111-2131-415161718192",
    question: "Qual seria a ação correta diante desse e-mail",
    example: "",
    answer: "Reportar ao setor de TI",
    points: 100,
  },
  {
    uuid: "d4e5f6g7-8910-1112-1314-151617181920",
    question: "Indique uma palavra ou frase que mostre que o e-mail é falso",
    example: "",
    answer: "Clique aqui para atualizar seus dados",
    points: 100,
  },
];

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password");

  if (password !== process.env.password) {
    return NextResponse.json({
      status: 500,
      message: "Senha inválida!",
    }, { status: 500 });
  }

  try {
    for (const q of questions) {
      const answerEncoded = xorEncode(q.answer, process.env.base64_key!);
      const questionRef = doc(db, "questions", q.uuid);
      await setDoc(questionRef, {
        question: q.question,
        example: q.example,
        points: q.points,
        answer: answerEncoded,
      });
    }

    return NextResponse.json({ message: "Perguntas criadas com sucesso!" });
  } catch (error) {
    console.error("Erro ao criar perguntas:", error);
    return NextResponse.json(
      { message: "Erro ao criar perguntas", error },
      { status: 500 }
    );
  }
}