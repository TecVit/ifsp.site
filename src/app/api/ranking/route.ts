// api/ranking/route.ts

import { db } from "@/utils/firebase/config";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, orderBy("points", "desc"));
    const snapshot = await getDocs(q);

    const ranking: { ranking: string | number; nome: string; points: number }[] = [];

    let position = 1;

    snapshot.forEach((doc) => {
      const data = doc.data();

      let nameDisplay: string = data.nome;
      if (position === 1) nameDisplay = `🥇 ${data.nome}`;
      else if (position === 2) nameDisplay = `🥈 ${data.nome}`;
      else if (position === 3) nameDisplay = `🥉 ${data.nome}`;

      ranking.push({
        ranking: `${position}º`,
        nome: nameDisplay || "Sem nome",
        points: data.points || 0,
      });

      position++;
    });

    return NextResponse.json(ranking, { status: 200 });
  } catch (error) {
    console.error("Erro ao gerar ranking:", error);
    return NextResponse.json(
      { status: 500, message: "Erro ao buscar ranking" },
      { status: 500 }
    );
  }
}