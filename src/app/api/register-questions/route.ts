// api/register-questions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/firebase/config"; // ajuste se necessário
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { xorEncode } from "@/utils/functions";

const questions = [
  {
    uuid: "6ee72fc6-ea0d-46e4-a27a-d670d1328b1a",
    question: "(Netflix) Qual o nome da vítima?",
    example: "Dica: J**n D**",
    answer: "John Doe",
    points: 25,
  },
  {
    uuid: "2173108b-320a-4885-a65e-3aea09aea7d7",
    question: "(Netflix) Identifique o e-mail da vítima",
    example: "Dica: j*****e@g***l.**m",
    answer: "johndoe@gmail.com",
    points: 25,
  },
  {
    uuid: "60f3117c-0ac4-4d04-82b0-939098610aad",
    question: "(Netflix) Qual o domínio utilizado pelo atacante?",
    example: "Dica: n**f**i*x.com",
    answer: "netfliixx.com",
    points: 50,
  },
  {
    uuid: "d5b44379-24ca-4d39-a312-1152fd5f7e2c",
    question: "(Instagram) Qual a url utilizada para garantir a segurança da conta?",
    example: "Dica: https://i******ram.**/s****it*-***o***",
    answer: "https://iinstagram.co/security-account",
    points: 50,
  },
  {
    uuid: "37d9ecce-d419-4650-bb3b-fc6e181bd5d1",
    question: "(Instagram) Qual o sobrenome da vítima?",
    example: "Dica: M*******",
    answer: "Margaret",
    points: 50,
  },
  {
    uuid: "dc73e2a0-32e0-47f1-93cf-19f857edeefc",
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