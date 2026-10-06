import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { LockKeyhole, Mail, Store } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [loading,setLoading]=useState(false);

  useEffect(()=>{ if(supabase) supabase.auth.getSession().then(({data})=>{if(data.session) navigate({to:"/admin"});}); },[navigate]);

  async function submit(e:FormEvent){e.preventDefault();setError("");
    if(!supabase){setError("O sistema ainda não está conectado ao Supabase.");return;}
    setLoading(true); const {error}=await supabase.auth.signInWithPassword({email,password}); setLoading(false);
    if(error){setError("E-mail ou senha inválidos.");return;} navigate({to:"/admin"});
  }

  return <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-3xl bg-white p-7 shadow-xl ring-1 ring-black/5">
      <div className="mb-7 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#171717] text-white"><Store/></div>
      <h1 className="mt-4 text-2xl font-black">Área administrativa</h1><p className="mt-1 text-sm text-black/45">Acesso exclusivo do administrador</p></div>
      <label className="mb-4 block text-sm font-bold">E-mail<div className="mt-2 flex items-center rounded-xl border px-3"><Mail size={17}/><input required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="h-11 w-full px-3 outline-none"/></div></label>
      <label className="mb-4 block text-sm font-bold">Senha<div className="mt-2 flex items-center rounded-xl border px-3"><LockKeyhole size={17}/><input required type="password" value={password} onChange={e=>setPassword(e.target.value)} className="h-11 w-full px-3 outline-none"/></div></label>
      {error&&<p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-[#171717] py-3.5 text-sm font-black text-white disabled:opacity-50">{loading?"Entrando...":"Entrar no painel"}</button>
    </form>
  </main>;
}
