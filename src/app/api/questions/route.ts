// GET api/questions/route.ts

import { db } from "@/utils/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    const questionRef = collection(db, "questions");
    const snapshot = await getDocs(questionRef);

    const questions = snapshot.docs.map(doc => ({
        uuid: doc.id,
        ...doc.data(),
    }));

    if (questions.length === 0) {
        return NextResponse.json({
            status: 404,
            message: "Nenhuma questão encontrada!",
        }, { status: 404 });
    }

    const data = {
        status: 200,
        message: "Questões coletadas com sucesso!",
        questions: questions,
    }
  
    return NextResponse.json(data);
}