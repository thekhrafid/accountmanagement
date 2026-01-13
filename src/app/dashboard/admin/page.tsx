"use client";
import { useEffect, useState } from "react";

export default function AdminPage(){
    const [data, setData] = useState<any>(null);

    useEffect(()=>{
        fetch("/api/admin/settings").then(res => res.json()).then(setData)
    },[]);

    return(
        <div>
            <h1>Admin Settings</h1>
            <p>{JSON.stringify(data, null, 2)}</p>
        </div>
    )
}