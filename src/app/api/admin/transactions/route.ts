import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);

    if(!session || session.user.role !== "ADMIN"){
        return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const transactions = await prisma.transaction.findMany({
        include:{
            user:{select:{email:true}}
        },
        orderBy:{
            createdAt:"desc"
        }
    })

    return NextResponse.json(transactions)
}