// api/register-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/config"; // ajuste se necessário
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { xorEncode } from "@/utils/functions";

const questions = [
  {
    uuid: "1",
    question: "(Netflix) Qual o nome da vítima?",
    example: "Dica: J**n D**",
    answer: "John Doe",
    points: 25,
  },
  {
    uuid: "2",
    question: "(Netflix) Identifique o e-mail da vítima",
    example: "Dica: j*****e@g***l.**m",
    answer: "johndoe@gmail.com",
    points: 25,
  },
  {
    uuid: "3",
    question: "(Netflix) Qual o domínio utilizado pelo atacante?",
    example: "Dica: n**f**i*x.com",
    answer: "netfliixx.com",
    points: 50,
  },
  {
    uuid: "4",
    question: "(Instagram) Qual a url utilizada para garantir a segurança da conta?",
    example: "Dica: https://i******ram.**/s****it*-***o***",
    answer: "https://iinstagram.co/security-account",
    points: 50,
  },
  {
    uuid: "5",
    question: "(Instagram) Qual o sobrenome da vítima?",
    example: "Dica: M*******",
    answer: "Margaret",
    points: 50,
  },
  {
    uuid: "6",
    question: "(Instagram) Qual o suposto país em que foi acessado a conta da vítima?",
    example: "Dica: T*****n*",
    answer: "Thailand",
    points: 50,
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

  const snapshot = await getDocs(collection(db, "questions"));
  
  snapshot.forEach(async (d) => {
    await deleteDoc(doc(db, "questions", d.id));
  });

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