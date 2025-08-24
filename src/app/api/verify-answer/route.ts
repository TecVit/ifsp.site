// POST api/verify-answer/route.ts

import { db } from "@/utils/firebase/config";
import { xorDecode, xorEncode } from "@/utils/functions";
import { arrayUnion, doc, getDoc, increment, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { uuid, answer, token } = body;

    const tokenDecoded = JSON.parse(xorDecode(token, process.env.base64_key!)) || null;

    if (!tokenDecoded) {
        return NextResponse.json({
            status: 400,
            message: "Informação do usuário não encontrada!",
        }, { status: 400 });
    }

    const questionRef = doc(db, "questions", uuid);
    let snapshot = await getDoc(questionRef);

    if (snapshot.exists()) {
        const data = snapshot.data();

        const { prontuario } = tokenDecoded

        const userRef = doc(db, "users", prontuario);
        const snapshotUser = await getDoc(userRef);
        
        const dataUser = snapshotUser.data() || {}
        const answersCorrects = dataUser.answersCorrects || {};

        const answerDecoded = xorDecode(data.answer, process.env.base64_key!);
        
        if (answersCorrects[uuid]) {
            return NextResponse.json({
                status: 200,
                message: "Questão já respondida!",
                answer: false,
            }, { status: 200 });
        }

        if (answer === answerDecoded) {

            await setDoc(userRef, {
                answersCorrects: {
                    [uuid]: answer,
                },
                points: increment(data.points),
            }, { merge: true });

            const snap = await getDoc(userRef);
            const totalPoints = snap.exists() ? snap.data().points : 0;

            return NextResponse.json({
                status: 200,
                message: "Resposta certa!",
                answer: true,
                points: totalPoints
            }, { status: 200 });
        } else {
            return NextResponse.json({
                status: 200,
                message: "Resposta errada!",
                answer: false,
            }, { status: 200 });
        }
    }

    return NextResponse.json({
        status: 400,
        message: "Houve um erro interno no servidor!",
    }, { status: 400 });
}