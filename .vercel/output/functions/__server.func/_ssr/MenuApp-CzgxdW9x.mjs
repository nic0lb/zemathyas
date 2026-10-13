import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Minus, i as Plus, o as Flame, r as ShoppingBag, t as X } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/MenuApp-CzgxdW9x.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MESAS = {
	"m1-a7k3": 1,
	"m2-b8p1": 2,
	"m5-x9a2": 5,
	"m8-q4r7": 8,
	"m12-z3m9": 12
};
var ponto = {
	id: "ponto",
	name: "Ponto da carne",
	mode: "single",
	required: true,
	max: 1,
	options: [
		{
			id: "mp",
			name: "Mal passado",
			extra: 0
		},
		{
			id: "apm",
			name: "Ao ponto para mal",
			extra: 0
		},
		{
			id: "ap",
			name: "Ao ponto",
			extra: 0
		},
		{
			id: "apb",
			name: "Ao ponto para bem",
			extra: 0
		},
		{
			id: "bp",
			name: "Bem passado",
			extra: 0
		}
	]
};
var acomp = {
	id: "acomp",
	name: "Acompanhamentos",
	mode: "multi",
	required: false,
	max: 3,
	options: [
		{
			id: "arroz",
			name: "Arroz de alho",
			extra: 0
		},
		{
			id: "baiao",
			name: "Baião cremoso do Zé",
			extra: 8
		},
		{
			id: "fritas",
			name: "Batata frita",
			extra: 0
		},
		{
			id: "macaxeira",
			name: "Macaxeira frita",
			extra: 0
		},
		{
			id: "farofa",
			name: "Farofa mediterrânea",
			extra: 0
		},
		{
			id: "legumes",
			name: "Legumes assados",
			extra: 0
		}
	]
};
var CATEGORIES = [
	{
		id: "entradas",
		name: "Entradas"
	},
	{
		id: "cortes",
		name: "Cortes nobres"
	},
	{
		id: "executivos",
		name: "Executivos"
	},
	{
		id: "drinks",
		name: "Drinks"
	},
	{
		id: "bebidas",
		name: "Bebidas"
	},
	{
		id: "doces",
		name: "Sobremesas"
	}
];
var PRODUCTS = [
	{
		id: "chorizo",
		category: "entradas",
		name: "Chorizo argentino",
		description: "Linguiça artesanal na parrilla, casca crocante e miolo suculento.",
		price: 42,
		setor: "parrilla",
		image: "/menu/chorizo.jpg",
		featured: true,
		groups: []
	},
	{
		id: "pao",
		category: "entradas",
		name: "Pão de alho artesanal",
		description: "Pão na brasa com manteiga de alho da casa.",
		price: 28,
		setor: "cozinha",
		groups: []
	},
	{
		id: "coracao",
		category: "entradas",
		name: "Coração de frango",
		description: "Espeto grelhado, tempero leve de limão e sal grosso.",
		price: 36,
		setor: "parrilla",
		groups: []
	},
	{
		id: "picanha",
		category: "cortes",
		name: "Picanha Angus",
		description: "Capa de gordura selada. Preço por 100 g, mínimo 300 g.",
		price: 0,
		per100g: 18.9,
		minGrams: 300,
		setor: "parrilla",
		image: "/menu/picanha.jpg",
		featured: true,
		groups: [ponto, acomp]
	},
	{
		id: "ancho",
		category: "cortes",
		name: "Beef ancho",
		description: "Corte premium da costela, marmoreio marcado.",
		price: 0,
		per100g: 22.5,
		minGrams: 300,
		setor: "parrilla",
		featured: true,
		groups: [ponto, acomp]
	},
	{
		id: "maminha",
		category: "cortes",
		name: "Maminha argentina",
		description: "Fibra curta, suculenta, ponto da casa.",
		price: 0,
		per100g: 16.9,
		minGrams: 300,
		setor: "parrilla",
		groups: [ponto, acomp]
	},
	{
		id: "tomahawk",
		category: "cortes",
		name: "Tomahawk",
		description: "Peça de cerca de 1 kg, para dividir à mesa.",
		price: 289,
		setor: "parrilla",
		image: "/menu/tomahawk.jpg",
		featured: true,
		groups: [ponto, acomp]
	},
	{
		id: "medalhao",
		category: "executivos",
		name: "Medalhão de filé mignon",
		description: "Com arroz de alho e legumes grelhados.",
		price: 79.9,
		setor: "cozinha",
		groups: [ponto]
	},
	{
		id: "fettuccine",
		category: "executivos",
		name: "Fettuccine ao alho e óleo",
		description: "Massa fresca, azeite, alho laminado e parmesão.",
		price: 48,
		setor: "cozinha",
		groups: []
	},
	{
		id: "negroni",
		category: "drinks",
		name: "Negroni do Zé",
		description: "Gin, bitter e vermute, casca de laranja.",
		price: 38,
		setor: "bar",
		image: "/menu/negroni.jpg",
		featured: true,
		groups: []
	},
	{
		id: "gin",
		category: "drinks",
		name: "Gin tônica",
		description: "Gin selecionado e tônica gelada.",
		price: 32,
		setor: "bar",
		groups: []
	},
	{
		id: "agua",
		category: "bebidas",
		name: "Água com gás",
		description: "Garrafa 500 ml.",
		price: 9,
		setor: "copa",
		groups: []
	},
	{
		id: "refri",
		category: "bebidas",
		name: "Refrigerante lata",
		description: "Cola, guaraná ou cítrico.",
		price: 8,
		setor: "copa",
		groups: [{
			id: "sabor",
			name: "Sabor",
			mode: "single",
			required: true,
			max: 1,
			options: [
				{
					id: "cola",
					name: "Cola",
					extra: 0
				},
				{
					id: "guarana",
					name: "Guaraná",
					extra: 0
				},
				{
					id: "citrico",
					name: "Cítrico",
					extra: 0
				}
			]
		}]
	},
	{
		id: "pudim",
		category: "doces",
		name: "Pudim de leite",
		description: "Cremoso, calda de caramelo queimado.",
		price: 24,
		setor: "copa",
		image: "/menu/pudim.jpg",
		groups: []
	}
];
function money(n) {
	return n.toLocaleString("pt-BR", {
		style: "currency",
		currency: "BRL"
	});
}
function priceLabel(p) {
	return p.per100g ? `${money(p.per100g)} / 100 g` : money(p.price);
}
function unitPrice(p, grams) {
	if (p.per100g) return p.per100g * grams / 100;
	return p.price;
}
var SETOR_LABEL = {
	parrilla: "Parrilla",
	cozinha: "Cozinha",
	bar: "Bar",
	copa: "Copa"
};
function mesaFromHash(hash) {
	if (hash && MESAS[hash]) return {
		hash,
		numero: MESAS[hash]
	};
	return {
		hash: "m5-x9a2",
		numero: 5
	};
}
function MenuApp({ hash }) {
	const mesa = mesaFromHash(hash);
	const [tab, setTab] = (0, import_react.useState)(CATEGORIES[0].id);
	const [open, setOpen] = (0, import_react.useState)(null);
	const [cartOpen, setCartOpen] = (0, import_react.useState)(false);
	const [cart, setCart] = (0, import_react.useState)([]);
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		sessionStorage.setItem("zm_mesa", JSON.stringify(mesa));
	}, [mesa.hash, mesa.numero]);
	const total = cart.reduce((s, i) => s + i.subtotal, 0);
	const qty = cart.reduce((s, i) => s + i.qty, 0);
	const visible = (0, import_react.useMemo)(() => PRODUCTS.filter((p) => p.category === tab), [tab]);
	function flash(msg) {
		setToast(msg);
		window.setTimeout(() => setToast(""), 2200);
	}
	function add(item) {
		setCart((c) => [...c, item]);
		setOpen(null);
		flash("Adicionado ao pedido");
	}
	function send() {
		const bySetor = {};
		for (const item of cart) {
			const label = SETOR_LABEL[item.setor];
			const line = `${item.qty}× ${item.name}${item.grams ? ` (${item.grams} g)` : ""}${item.optionNames.length ? ` — ${item.optionNames.join(", ")}` : ""}`;
			bySetor[label] = [...bySetor[label] ?? [], line];
		}
		const code = `ZM-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
		const saved = {
			code,
			total,
			bySetor,
			mesa: mesa.numero,
			at: Date.now()
		};
		const prev = JSON.parse(localStorage.getItem("zm_pedidos") || "[]");
		localStorage.setItem("zm_pedidos", JSON.stringify([saved, ...prev].slice(0, 12)));
		setTicket({
			code,
			total,
			bySetor
		});
		setCart([]);
		setCartOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-lg items-center justify-between px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 place-items-center rounded-full border border-gold bg-gold text-bg font-display text-lg font-semibold",
							children: "Z"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-lg leading-none text-gold",
							children: "Zé Mathyas"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs tracking-[0.16em] text-muted uppercase",
							children: "La Parrilla & Resto"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-full border border-line bg-surface px-3 py-2 text-sm font-medium text-gold",
						children: ["Mesa ", String(mesa.numero).padStart(2, "0")]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "mx-auto flex max-w-lg gap-2 overflow-x-auto px-4 pb-3",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTab(c.id),
						className: `shrink-0 rounded-full px-4 py-2 text-sm ${tab === c.id ? "bg-gold text-bg" : "bg-raised text-muted"}`,
						children: c.name
					}, c.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-lg space-y-3 px-4 pt-4 pb-32",
				children: visible.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpen(p),
					className: "flex w-full gap-3 rounded-2xl border border-line bg-surface p-3 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-medium",
									children: p.name
								}), p.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, {
									className: "h-4 w-4 text-gold",
									"aria-label": "Destaque"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-sm leading-relaxed text-muted",
								children: p.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold text-gold",
								children: priceLabel(p)
							})
						]
					}), p.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: p.image,
						alt: "",
						className: "h-24 w-24 shrink-0 rounded-xl object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-24 w-24 shrink-0 place-items-center rounded-xl bg-raised text-xs text-muted",
						children: SETOR_LABEL[p.setor]
					})]
				}, p.id))
			}),
			qty > 0 && !ticket && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-x-0 bottom-0 z-40",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-lg px-4 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setCartOpen(true),
						className: "flex w-full items-center justify-between rounded-2xl bg-gold px-5 py-4 font-semibold text-bg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-7 place-items-center rounded-full bg-bg text-sm text-gold",
								children: qty
							}), "Ver pedido"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(total) })]
					})
				})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customize, {
				product: open,
				onClose: () => setOpen(null),
				onAdd: add
			}),
			cartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				onClose: () => setCartOpen(false),
				title: "Seu pedido",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-3",
						children: cart.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3 border-b border-line pb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-medium",
									children: [
										item.qty,
										"× ",
										item.name
									]
								}),
								item.grams ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted",
									children: [item.grams, " g"]
								}) : null,
								item.optionNames.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted",
									children: item.optionNames.join(" · ")
								}) : null,
								item.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-muted italic",
									children: item.note
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-gold",
									children: SETOR_LABEL[item.setor]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-gold",
									children: money(item.subtotal)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "mt-2 text-sm text-muted",
									onClick: () => setCart((c) => c.filter((x) => x.key !== item.key)),
									children: "Remover"
								})]
							})]
						}, item.key))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: "Total"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl text-gold",
							children: money(total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: send,
						className: "mt-4 w-full rounded-xl bg-gold py-4 font-semibold text-bg",
						children: "Enviar para a cozinha"
					})
				]
			}),
			ticket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
				onClose: () => setTicket(null),
				title: `Pedido ${ticket.code}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							"Mesa ",
							String(mesa.numero).padStart(2, "0"),
							" · ",
							money(ticket.total)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 space-y-4",
						children: Object.entries(ticket.bySetor).map(([setor, lines]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-semibold text-gold",
							children: setor
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-1 space-y-1 text-sm",
							children: lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: line }, line))
						})] }, setor))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setTicket(null),
						className: "mt-6 w-full rounded-xl bg-gold py-4 font-semibold text-bg",
						children: "Voltar ao cardápio"
					})
				]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-raised px-4 py-2 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "mr-2 inline h-4 w-4 text-gold" }), toast]
			})
		]
	});
}
function Customize({ product, onClose, onAdd }) {
	const [sel, setSel] = (0, import_react.useState)(() => {
		const init = {};
		for (const g of product.groups) init[g.id] = g.required && g.mode === "single" && g.options[0] ? [g.options[0].id] : [];
		return init;
	});
	const [qty, setQty] = (0, import_react.useState)(1);
	const [grams, setGrams] = (0, import_react.useState)(product.minGrams ?? 300);
	const [note, setNote] = (0, import_react.useState)("");
	const extras = product.groups.flatMap((g) => g.options.filter((o) => (sel[g.id] ?? []).includes(o.id)));
	const extraSum = extras.reduce((s, o) => s + o.extra, 0);
	const subtotal = (unitPrice(product, grams) + extraSum) * qty;
	function toggle(groupId, optionId, mode, max) {
		setSel((prev) => {
			const cur = prev[groupId] ?? [];
			if (mode === "single") return {
				...prev,
				[groupId]: [optionId]
			};
			if (cur.includes(optionId)) return {
				...prev,
				[groupId]: cur.filter((id) => id !== optionId)
			};
			if (cur.length >= max) return prev;
			return {
				...prev,
				[groupId]: [...cur, optionId]
			};
		});
	}
	function confirm() {
		for (const g of product.groups) if (g.required && (sel[g.id] ?? []).length === 0) return;
		onAdd({
			key: `${product.id}-${Date.now()}`,
			productId: product.id,
			name: product.name,
			qty,
			grams: product.per100g ? grams : void 0,
			optionIds: Object.values(sel).flat(),
			optionNames: extras.map((o) => o.name),
			note,
			setor: product.setor,
			subtotal
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
		onClose,
		title: product.name,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: product.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-gold",
				children: priceLabel(product)
			}),
			product.per100g && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm",
					children: "Peso"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => setGrams((g) => Math.max(product.minGrams ?? 100, g - 50)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "w-20 text-center font-medium",
							children: [grams, " g"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => setGrams((g) => g + 50),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						})
					]
				})]
			}),
			product.groups.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("legend", {
					className: "mb-2 text-sm",
					children: [
						g.name,
						g.required ? " *" : "",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-muted",
							children: g.mode === "single" ? "escolha 1" : `até ${g.max}`
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: g.options.map((o) => {
						const on = (sel[g.id] ?? []).includes(o.id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => toggle(g.id, o.id, g.mode, g.max),
							className: `flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm ${on ? "border-gold bg-raised" : "border-line bg-surface"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: o.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: o.extra ? `+ ${money(o.extra)}` : "incluso"
							})]
						}, o.id);
					})
				})]
			}, g.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm",
					children: "Quantidade"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => setQty((q) => Math.max(1, q - 1)),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "w-8 text-center font-medium",
							children: qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IconBtn, {
							onClick: () => setQty((q) => q + 1),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-5 block text-sm",
				children: ["Observação", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: note,
					onChange: (e) => setNote(e.target.value),
					rows: 2,
					className: "mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-fg outline-none",
					placeholder: "Sem cebola, ponto extra..."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: confirm,
				className: "mt-5 flex w-full items-center justify-between rounded-xl bg-gold px-4 py-4 font-semibold text-bg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Adicionar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: money(subtotal) })]
			})
		]
	});
}
function IconBtn({ children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: "grid h-11 w-11 place-items-center rounded-full border border-line bg-raised text-gold",
		children
	});
}
function Sheet({ title, onClose, children }) {
	const [shown, setShown] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const id = requestAnimationFrame(() => setShown(true));
		return () => cancelAnimationFrame(id);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": "Fechar",
			className: "absolute inset-0 bg-black/70",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `sheet absolute inset-x-0 bottom-0 mx-auto flex max-h-[88vh] max-w-lg flex-col rounded-t-3xl border-t border-line bg-bg ${shown ? "open" : ""}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-5 pt-4 pb-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl text-gold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onClose,
					"aria-label": "Fechar",
					className: "grid h-11 w-11 place-items-center text-muted",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-5 w-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-y-auto px-5 pb-6",
				children
			})]
		})]
	});
}
//#endregion
export { MenuApp as t };
