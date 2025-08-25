// POST api/user/route.ts

import { db } from "@/utils/firebase/config";
import { xorDecode } from "@/utils/functions";
import { doc, getDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { token } = body;
    
    if (!token) {
        return NextResponse.json({
            status: 400,
            message: "Token do usuário não fornecido!",
        }, { status: 400 });
    }

    let tokenDecoded;

    try {
        tokenDecoded = JSON.parse(xorDecode(token, process.env.base64_key!)) || null;
    } catch {
        return NextResponse.json({
            status: 400,
            message: "Informação do usuário não encontrada!",
        }, { status: 400 });    
    }
    
    const userRef = doc(db, "users", tokenDecoded.prontuario);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const data = snapshot.data();
        return NextResponse.json({
            status: 200,
            message: "Informação do usuário coletada!",
            user: data,
        });
    } else {
        return NextResponse.json({
            status: 404,
            message: "usuário não encontrado!",
        }, { status: 404 });
    }
    
}