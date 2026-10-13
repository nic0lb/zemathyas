import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Flame, Minus, Plus, ShoppingBag, X } from "lucide-react";
import {
  CATEGORIES,
  MESAS,
  PRODUCTS,
  SETOR_LABEL,
  money,
  priceLabel,
  unitPrice,
  type Product,
  type Setor,
} from "@/lib/menu";

type CartItem = {
  key: string;
  productId: string;
  name: string;
  qty: number;
  grams?: number;
  optionIds: string[];
  optionNames: string[];
  note: string;
  setor: Setor;
  subtotal: number;
};

type Ticket = {
  code: string;
  total: number;
  bySetor: Record<string, string[]>;
};

function mesaFromHash(hash?: string) {
  if (hash && MESAS[hash]) return { hash, numero: MESAS[hash] };
  return { hash: "m5-x9a2", numero: 5 };
}

export function MenuApp({ hash }: { hash?: string }) {
  const mesa = mesaFromHash(hash);
  const [tab, setTab] = useState<string>(CATEGORIES[0].id);
  const [open, setOpen] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    sessionStorage.setItem("zm_mesa", JSON.stringify(mesa));
  }, [mesa.hash, mesa.numero]);

  const total = cart.reduce((s, i) => s + i.subtotal, 0);
  const qty = cart.reduce((s, i) => s + i.qty, 0);

  const visible = useMemo(
    () => PRODUCTS.filter((p) => p.category === tab),
    [tab],
  );

  function flash(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }

  function add(item: CartItem) {
    setCart((c) => [...c, item]);
    setOpen(null);
    flash("Adicionado ao pedido");
  }

  function send() {
    const bySetor: Record<string, string[]> = {};
    for (const item of cart) {
      const label = SETOR_LABEL[item.setor];
      const line = `${item.qty}× ${item.name}${item.grams ? ` (${item.grams} g)` : ""}${
        item.optionNames.length ? ` — ${item.optionNames.join(", ")}` : ""
      }`;
      bySetor[label] = [...(bySetor[label] ?? []), line];
    }
    const code = `ZM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const saved = { code, total, bySetor, mesa: mesa.numero, at: Date.now() };
    const prev = JSON.parse(localStorage.getItem("zm_pedidos") || "[]");
    localStorage.setItem("zm_pedidos", JSON.stringify([saved, ...prev].slice(0, 12)));
    setTicket({ code, total, bySetor });
    setCart([]);
    setCartOpen(false);
  }

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full border border-gold bg-gold text-bg font-display text-lg font-semibold">
              Z
            </div>
            <div>
              <p className="font-display text-lg leading-none text-gold">Zé Mathyas</p>
              <p className="mt-1 text-xs tracking-[0.16em] text-muted uppercase">La Parrilla & Resto</p>
            </div>
          </div>
          <div className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-gold">
            Mesa {String(mesa.numero).padStart(2, "0")}
          </div>
        </div>
        <nav className="mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 pb-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setTab(c.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm ${
                tab === c.id ? "bg-gold text-bg" : "bg-raised text-muted"
              }`}
            >
              {c.name}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-lg space-y-3 px-4 pt-4 pb-32">
        {visible.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setOpen(p)}
            className="flex w-full gap-3 rounded-2xl border border-line bg-surface p-3 text-left"
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h2 className="font-medium">{p.name}</h2>
                {p.featured && (
                  <Flame className="h-4 w-4 text-gold" aria-label="Destaque" />
                )}
              </div>
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{p.description}</p>
              <p className="mt-2 text-sm font-semibold text-gold">{priceLabel(p)}</p>
            </div>
            {p.image ? (
              <img
                src={p.image}
                alt=""
                className="h-24 w-24 shrink-0 rounded-xl object-cover"
              />
            ) : (
              <div className="grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-raised text-xs text-muted">
                {SETOR_LABEL[p.setor]}
              </div>
            )}
          </button>
        ))}
      </main>

      {qty > 0 && !ticket && (
        <div className="fixed inset-x-0 bottom-0 z-40">
          <div className="mx-auto max-w-lg px-4 pb-4">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="flex w-full items-center justify-between rounded-2xl bg-gold px-5 py-4 font-semibold text-bg"
            >
              <span className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-bg text-sm text-gold">
                  {qty}
                </span>
                Ver pedido
              </span>
              <span>{money(total)}</span>
            </button>
          </div>
        </div>
      )}

      {open && <Customize product={open} onClose={() => setOpen(null)} onAdd={add} />}

      {cartOpen && (
        <Sheet onClose={() => setCartOpen(false)} title="Seu pedido">
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.key} className="flex items-start justify-between gap-3 border-b border-line pb-3">
                <div>
                  <p className="font-medium">
                    {item.qty}× {item.name}
                  </p>
                  {item.grams ? <p className="text-sm text-muted">{item.grams} g</p> : null}
                  {item.optionNames.length ? (
                    <p className="text-sm text-muted">{item.optionNames.join(" · ")}</p>
                  ) : null}
                  {item.note ? <p className="text-sm text-muted italic">{item.note}</p> : null}
                  <p className="text-xs text-gold">{SETOR_LABEL[item.setor]}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gold">{money(item.subtotal)}</p>
                  <button
                    type="button"
                    className="mt-2 text-sm text-muted"
                    onClick={() => setCart((c) => c.filter((x) => x.key !== item.key))}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-muted">Total</span>
            <span className="font-display text-2xl text-gold">{money(total)}</span>
          </div>
          <button
            type="button"
            onClick={send}
            className="mt-4 w-full rounded-xl bg-gold py-4 font-semibold text-bg"
          >
            Enviar para a cozinha
          </button>
        </Sheet>
      )}

      {ticket && (
        <Sheet onClose={() => setTicket(null)} title={`Pedido ${ticket.code}`}>
          <p className="text-sm text-muted">
            Mesa {String(mesa.numero).padStart(2, "0")} · {money(ticket.total)}
          </p>
          <div className="mt-4 space-y-4">
            {Object.entries(ticket.bySetor).map(([setor, lines]) => (
              <div key={setor}>
                <p className="text-sm font-semibold text-gold">{setor}</p>
                <ul className="mt-1 space-y-1 text-sm">
                  {lines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setTicket(null)}
            className="mt-6 w-full rounded-xl bg-gold py-4 font-semibold text-bg"
          >
            Voltar ao cardápio
          </button>
        </Sheet>
      )}

      {toast && (
        <div className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-raised px-4 py-2 text-sm">
          <ShoppingBag className="mr-2 inline h-4 w-4 text-gold" />
          {toast}
        </div>
      )}
    </div>
  );
}

function Customize({
  product,
  onClose,
  onAdd,
}: {
  product: Product;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}) {
  const [sel, setSel] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const g of product.groups) {
      init[g.id] = g.required && g.mode === "single" && g.options[0] ? [g.options[0].id] : [];
    }
    return init;
  });
  const [qty, setQty] = useState(1);
  const [grams, setGrams] = useState(product.minGrams ?? 300);
  const [note, setNote] = useState("");

  const extras = product.groups.flatMap((g) =>
    g.options.filter((o) => (sel[g.id] ?? []).includes(o.id)),
  );
  const extraSum = extras.reduce((s, o) => s + o.extra, 0);
  const unit = unitPrice(product, grams) + extraSum;
  const subtotal = unit * qty;

  function toggle(groupId: string, optionId: string, mode: "single" | "multi", max: number) {
    setSel((prev) => {
      const cur = prev[groupId] ?? [];
      if (mode === "single") return { ...prev, [groupId]: [optionId] };
      if (cur.includes(optionId)) return { ...prev, [groupId]: cur.filter((id) => id !== optionId) };
      if (cur.length >= max) return prev;
      return { ...prev, [groupId]: [...cur, optionId] };
    });
  }

  function confirm() {
    for (const g of product.groups) {
      if (g.required && (sel[g.id] ?? []).length === 0) return;
    }
    onAdd({
      key: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      qty,
      grams: product.per100g ? grams : undefined,
      optionIds: Object.values(sel).flat(),
      optionNames: extras.map((o) => o.name),
      note,
      setor: product.setor,
      subtotal,
    });
  }

  return (
    <Sheet onClose={onClose} title={product.name}>
      <p className="text-sm leading-relaxed text-muted">{product.description}</p>
      <p className="mt-2 text-gold">{priceLabel(product)}</p>

      {product.per100g && (
        <div className="mt-5">
          <p className="mb-2 text-sm">Peso</p>
          <div className="flex items-center gap-3">
            <IconBtn onClick={() => setGrams((g) => Math.max(product.minGrams ?? 100, g - 50))}>
              <Minus className="h-4 w-4" />
            </IconBtn>
            <span className="w-20 text-center font-medium">{grams} g</span>
            <IconBtn onClick={() => setGrams((g) => g + 50)}>
              <Plus className="h-4 w-4" />
            </IconBtn>
          </div>
        </div>
      )}

      {product.groups.map((g) => (
        <fieldset key={g.id} className="mt-5">
          <legend className="mb-2 text-sm">
            {g.name}
            {g.required ? " *" : ""}
            <span className="ml-2 text-muted">{g.mode === "single" ? "escolha 1" : `até ${g.max}`}</span>
          </legend>
          <div className="space-y-2">
            {g.options.map((o) => {
              const on = (sel[g.id] ?? []).includes(o.id);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => toggle(g.id, o.id, g.mode, g.max)}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${
                    on ? "border-gold bg-raised" : "border-line bg-surface"
                  }`}
                >
                  <span>{o.name}</span>
                  <span className="text-muted">{o.extra ? `+ ${money(o.extra)}` : "incluso"}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div className="mt-5">
        <p className="mb-2 text-sm">Quantidade</p>
        <div className="flex items-center gap-3">
          <IconBtn onClick={() => setQty((q) => Math.max(1, q - 1))}>
            <Minus className="h-4 w-4" />
          </IconBtn>
          <span className="w-8 text-center font-medium">{qty}</span>
          <IconBtn onClick={() => setQty((q) => q + 1)}>
            <Plus className="h-4 w-4" />
          </IconBtn>
        </div>
      </div>

      <label className="mt-5 block text-sm">
        Observação
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={2}
          className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-fg outline-none"
          placeholder="Sem cebola, ponto extra..."
        />
      </label>

      <button
        type="button"
        onClick={confirm}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-gold px-4 py-4 font-semibold text-bg"
      >
        <span>Adicionar</span>
        <span>{money(subtotal)}</span>
      </button>
    </Sheet>
  );
}

function IconBtn({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-gold"
    >
      {children}
    </button>
  );
}

function Sheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Fechar" className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className={`sheet absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] max-w-lg flex-col rounded-t-3xl border-t border-line bg-bg ${
          shown ? "open" : ""
        }`}
      >
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <h3 className="font-display text-xl text-gold">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Fechar" className="grid h-11 w-11 place-items-center text-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-6">{children}</div>
      </div>
    </div>
  );
}
