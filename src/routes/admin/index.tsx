import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Package, Settings, LogOut, ArrowLeft } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

function AdminDashboard(){
 const navigate=useNavigate(); const [email,setEmail]=useState(""); const [checking,setChecking]=useState(true);
 useEffect(()=>{if(!supabase){setChecking(false);return;} supabase.auth.getSession().then(({data})=>{if(!data.session)navigate({to:"/admin/login"});else setEmail(data.session.user.email??"");setChecking(false);});},[navigate]);
 async function logout(){await supabase?.auth.signOut();navigate({to:"/admin/login"});}
 if(checking)return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
 return <main className="min-h-screen bg-[#f8f7f4]"><header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><div><p className="text-xl font-black">HAMBURGÃO • ADM</p><p className="text-xs text-black/40">{email||"Supabase não configurado"}</p></div><button onClick={logout} className="flex items-center gap-2 rounded-xl bg-black/5 px-4 py-2 text-sm font-bold"><LogOut size={16}/>Sair</button></div></header>
 <section className="mx-auto max-w-6xl px-4 py-8"><h1 className="text-3xl font-black">Painel administrativo</h1><p className="mt-1 text-black/50">Gerencie o cardápio e os dados do estabelecimento.</p>
 <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Link to="/admin/produtos" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"><Package/><h2 className="mt-4 text-lg font-black">Produtos</h2><p className="mt-1 text-sm text-black/45">Adicionar e gerenciar preços.</p></Link>
 <Link to="/admin/configuracoes" className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"><Settings/><h2 className="mt-4 text-lg font-black">Configurações</h2><p className="mt-1 text-sm text-black/45">Nome e WhatsApp.</p></Link>
 <Link to="/" className="rounded-3xl bg-[#171717] p-6 text-white"><ArrowLeft/><h2 className="mt-4 text-lg font-black">Ver catálogo</h2></Link></div></section></main>;
}
