import { db } from "@/utils/firebase/config";
import { xorEncode } from "@/utils/functions";
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { uid } = body;

    const userRef = doc(db, "users", uid);
    let snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        return NextResponse.json({
            status: 404,
            message: `Nenhum usuário encontrado com o prontuário: ${uid}`,
        }, { status: 404 });
    }

    let dataUser = snapshot.data();
    let { nome, prontuario, acesso, dataDeAcesso } = dataUser;

    if (!acesso) {
        await setDoc(
            userRef,
            {
                acesso: true,
                dataDeAcesso: serverTimestamp(),
            },
            { merge: true }
        );

        snapshot = await getDoc(userRef);
        dataUser = snapshot.data() || {};
        dataDeAcesso = dataUser?.dataDeAcesso;
        acesso = true;
    }

    // 🔥 Mantém como { seconds, nanoseconds }
    let dataAcessoRaw: { seconds: number; nanoseconds: number } | null = null;

    if (dataDeAcesso && dataDeAcesso instanceof Timestamp) {
        dataAcessoRaw = {
            seconds: dataDeAcesso.seconds,
            nanoseconds: dataDeAcesso.nanoseconds,
        };
    }

    const tokenAuthentication = xorEncode(
        JSON.stringify({
            nome,
            prontuario,
            date: dataAcessoRaw, // <<<<< aqui vai o { seconds, nanoseconds }
            time: new Date(),
        }),
        process.env.base64_key!
    );

    return NextResponse.json({
        token: tokenAuthentication,
        user: {
            nome,
            prontuario,
            acesso,
            dataDeAcesso: dataAcessoRaw,
        },
    });
}