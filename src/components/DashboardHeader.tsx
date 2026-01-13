"use client";

import { signOut } from "next-auth/react";

export default function DashboardHeader(){
    return(
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dashboard</h1>

            <button onClick={()=> signOut({callbackUrl: "/"})}
                className="px-4 py-2 bg-red-500 text-white rounded">
                Logout
            </button>
        </header>
    )
}