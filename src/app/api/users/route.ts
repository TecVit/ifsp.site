// GET api/users/route.ts

import { db } from "@/utils/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);

    const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
    }));

    if (users.length === 0) {
        return NextResponse.json({
            status: 404,
            message: "Nenhum usuário encontrado!",
        }, { status: 404 });
    }

    const data = {
        status: 200,
        message: "Usuário coletados com sucesso!",
        users: users,
    }
  
    return NextResponse.json(data);
}