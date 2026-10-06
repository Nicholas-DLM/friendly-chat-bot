import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../lib/supabase";

export const Route = createFileRoute("/admin/produtos")({component:AdminProducts});
type Product={id:string;name:string;description:string|null;price:number;promotional_price:number|null;available:boolean};

function AdminProducts(){
 const navigate=useNavigate(); const [products,setProducts]=useState<Product[]>([]); const [error,setError]=useState("");
 const [form,setForm]=useState({name:"",description:"",price:"",promo:""});
 async function load(){if(!supabase)return;const {data}=await supabase.from("products").select("id,name,description,price,promotional_price,available").order("created_at");setProducts((data??[]) as Product[]);}
 useEffect(()=>{supabase?.auth.getSession().then(({data})=>{if(!data.session)navigate({to:"/admin/login"});else load();});},[navigate]);
 async function add(e:FormEvent){e.preventDefault();if(!supabase)return setError("Supabase não configurado.");const {data:auth}=await supabase.auth.getSession();const {data:admin}=await supabase.from("admins").select("establishment_id").eq("user_id",auth.session?.user.id).single();if(!admin)return setError("Administrador sem estabelecimento vinculado.");const {error}=await supabase.from("products").insert({establishment_id:admin.establishment_id,name:form.name,description:form.description,price:Number(form.price),promotional_price:form.promo?Number(form.promo):null});if(error)return setError(error.message);setForm({name:"",description:"",price:"",promo:""});setError("");load();}
 async function remove(id:string){await supabase?.from("products").delete().eq("id",id);load();}
 return <main className="min-h-screen bg-[#f8f7f4]"><header className="border-b bg-white"><div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4"><Link to="/admin" className="flex items-center gap-2 font-bold"><ArrowLeft size={17}/>Painel</Link><b>Produtos</b></div></header>
 <section className="mx-auto max-w-6xl px-4 py-7"><form onSubmit={add} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-black/5"><h1 className="text-xl font-black">Adicionar produto</h1><div className="mt-4 grid gap-3 md:grid-cols-2">
 <input required placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="h-11 rounded-xl border px-3"/><input required type="number" step="0.01" placeholder="Preço" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="h-11 rounded-xl border px-3"/><input type="number" step="0.01" placeholder="Preço promocional" value={form.promo} onChange={e=>setForm({...form,promo:e.target.value})} className="h-11 rounded-xl border px-3"/><input placeholder="Descrição" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} className="h-11 rounded-xl border px-3"/></div>
 {error&&<p className="mt-3 text-sm font-semibold text-red-600">{error}</p>}<button className="mt-4 flex items-center gap-2 rounded-xl bg-[#171717] px-4 py-3 text-sm font-black text-white"><Plus size={17}/>Adicionar</button></form>
 <div className="mt-5 space-y-3">{products.map(p=><div key={p.id} className="flex items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-black/5"><div><p className="font-black">{p.name}</p><p className="text-sm text-black/45">R$ {Number(p.price).toFixed(2)}{p.promotional_price ? " • oferta R$ "+Number(p.promotional_price).toFixed(2):""}</p></div><button onClick={()=>remove(p.id)} className="rounded-xl p-2 text-red-500"><Trash2 size={18}/></button></div>)}</div></section></main>;
}
