import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  promoPrice?: number;
  category: string;
  image: string;
  featured?: boolean;
};

type CartItem = Product & { quantity: number };

const WHATSAPP_NUMBER = "5521999999999";

const categories = ["Todos", "Hambúrgueres", "Combos", "Porções", "Bebidas"];

const products: Product[] = [
  {
    id: 1,
    name: "X-Bacon Especial",
    description: "Pão brioche, hambúrguer artesanal, cheddar, bacon crocante e molho da casa.",
    price: 32.9,
    promoPrice: 27.9,
    category: "Hambúrgueres",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 2,
    name: "Duplo Smash",
    description: "Dois smash burgers, queijo cheddar, cebola caramelizada e molho especial.",
    price: 34.9,
    category: "Hambúrgueres",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 3,
    name: "X-Tudo da Casa",
    description: "Hambúrguer, queijo, presunto, bacon, ovo, alface, tomate e molho especial.",
    price: 36.9,
    category: "Hambúrgueres",
    image: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Combo Clássico",
    description: "X-Bacon Especial + batata frita média + refrigerante lata.",
    price: 44.9,
    promoPrice: 39.9,
    category: "Combos",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=900&q=85",
    featured: true,
  },
  {
    id: 5,
    name: "Combo Duplo",
    description: "Duplo Smash + batata frita + refrigerante lata.",
    price: 49.9,
    category: "Combos",
    image: "https://images.unsplash.com/photo-1612392062631-94dd858cba88?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Batata com Cheddar e Bacon",
    description: "Porção generosa de batata crocante com cheddar cremoso e bacon.",
    price: 24.9,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 7,
    name: "Batata Frita",
    description: "Porção média de batata frita crocante.",
    price: 16.9,
    category: "Porções",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 8,
    name: "Refrigerante Lata",
    description: "Consulte os sabores disponíveis.",
    price: 6.5,
    category: "Bebidas",
    image: "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=900&q=85",
  },
];

const money = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function Index() {
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.category === category;
      const matchesSearch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + (item.promoPrice ?? item.price) * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }

      return [...current, { ...product, quantity: 1 }];
    });
  }

  function changeQuantity(id: number, amount: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: number) {
    setCart((current) => current.filter((item) => item.id !== id));
  }

  function sendWhatsAppOrder() {
    if (!cart.length) return;

    const lines = cart.map((item) => {
      const price = item.promoPrice ?? item.price;
      return `• ${item.quantity}x ${item.name} — ${money(price * item.quantity)}`;
    });

    const message = [
      "Olá! Quero fazer um pedido:",
      "",
      ...lines,
      "",
      `Total: ${money(cartTotal)}`,
      "",
      "Aguardo a confirmação do pedido. 😊",
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#171717]">
      <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f7f4]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e85d04] text-xl shadow-sm">
              🍔
            </div>
            <div>
              <p className="text-base font-black tracking-tight">HAMBURGÃO</p>
              <p className="text-xs text-black/50">Artesanal • Delivery</p>
            </div>
          </div>

          <button
            onClick={() => setCartOpen(true)}
            className="relative flex h-11 items-center gap-2 rounded-full bg-[#171717] px-4 text-sm font-bold text-white transition hover:scale-[1.02]"
            aria-label="Abrir carrinho"
          >
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">Carrinho</span>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e85d04] px-1 text-[11px] font-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pb-5 pt-8 sm:px-6 sm:pt-12">
          <div className="overflow-hidden rounded-[2rem] bg-[#171717] px-6 py-8 text-white shadow-xl sm:px-10 sm:py-12">
            <div className="max-w-2xl">
              <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#ff9f4a]">
                Peça sem complicação
              </p>
              <h1 className="text-4xl font-black leading-[0.98] tracking-tight sm:text-6xl">
                Seu hambúrguer favorito, do seu jeito.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
                Escolha seus produtos, monte seu pedido e envie tudo direto pelo
                WhatsApp.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
          <div className="relative">
            <Search
              size={19}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar no cardápio..."
              className="h-12 w-full rounded-2xl border border-black/8 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#e85d04] focus:ring-4 focus:ring-[#e85d04]/10"
            />
          </div>

          <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition ${
                  category === item
                    ? "bg-[#e85d04] text-white shadow-sm"
                    : "bg-white text-black/60 hover:bg-black/5"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-24 pt-7 sm:px-6">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-black/35">
                Cardápio
              </p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">
                {category === "Todos" ? "Mais pedidos" : category}
              </h2>
            </div>
            <span className="text-xs font-semibold text-black/35">
              {filteredProducts.length} itens
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center">
              <p className="text-lg font-bold">Nenhum produto encontrado.</p>
              <p className="mt-1 text-sm text-black/45">
                Tente outra busca ou categoria.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <article
                  key={product.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.05)] ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    {product.promoPrice && (
                      <span className="absolute left-3 top-3 rounded-full bg-[#e85d04] px-3 py-1 text-xs font-black text-white">
                        OFERTA
                      </span>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="min-h-[86px]">
                      <h3 className="text-lg font-black tracking-tight">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-black/50">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <div>
                        {product.promoPrice && (
                          <span className="mr-2 text-xs text-black/35 line-through">
                            {money(product.price)}
                          </span>
                        )}
                        <span className="text-lg font-black">
                          {money(product.promoPrice ?? product.price)}
                        </span>
                      </div>
                      <button
                        onClick={() => addToCart(product)}
                        className="flex h-10 items-center gap-1.5 rounded-xl bg-[#171717] px-4 text-sm font-bold text-white transition hover:bg-[#e85d04]"
                      >
                        <Plus size={16} />
                        Adicionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white px-4 py-8 text-center text-xs text-black/40">
        HAMBURGÃO • Cardápio digital
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black/45 backdrop-blur-[2px]"
            onClick={() => setCartOpen(false)}
            aria-label="Fechar carrinho"
          />

          <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-[#f8f7f4] shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/5 bg-white px-5 py-4">
              <div>
                <p className="text-lg font-black">Seu pedido</p>
                <p className="text-xs text-black/40">{cartCount} itens</p>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5"
                aria-label="Fechar carrinho"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              {!cart.length ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl">
                    🛒
                  </div>
                  <p className="mt-4 font-bold">Seu carrinho está vazio</p>
                  <p className="mt-1 max-w-xs text-sm text-black/45">
                    Adicione alguns produtos para começar seu pedido.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.promoPrice ?? item.price;
                    return (
                      <div
                        key={item.id}
                        className="rounded-2xl bg-white p-3 shadow-sm"
                      >
                        <div className="flex gap-3">
                          <img
                            src={item.image}
                            alt=""
                            className="h-16 w-16 rounded-xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="truncate text-sm font-black">
                                {item.name}
                              </p>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-black/30 hover:text-red-500"
                                aria-label={`Remover ${item.name}`}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                            <p className="mt-1 text-sm font-bold">
                              {money(price)}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <button
                                onClick={() => changeQuantity(item.id, -1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5"
                                aria-label="Diminuir quantidade"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-5 text-center text-sm font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => changeQuantity(item.id, 1)}
                                className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/5"
                                aria-label="Aumentar quantidade"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-black/5 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-black/50">Total</span>
                <span className="text-2xl font-black">{money(cartTotal)}</span>
              </div>
              <button
                onClick={sendWhatsAppOrder}
                disabled={!cart.length}
                className="w-full rounded-2xl bg-[#25D366] px-5 py-4 text-sm font-black text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Finalizar pelo WhatsApp
              </button>
              <p className="mt-2 text-center text-[11px] leading-4 text-black/35">
                O pedido será enviado com os itens e o valor total preenchidos.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
