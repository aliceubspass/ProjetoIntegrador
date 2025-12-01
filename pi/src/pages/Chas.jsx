import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import CartDrawer from "../components/CartDrawer";
import { supabase } from "../service/supabase";

export default function Chas() {
  const navigate = useNavigate();
  const { addItem, cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const placeholderImg = "https://via.placeholder.com/240x160?text=Produto";

  useEffect(() => {
    let mounted = true;
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("produto")
          .select("id_produto, nome_produto, descricao, preco, created_at, categoria")
          .eq("categoria", "chas")
          .order("created_at", { ascending: false });
        if (error) {
          console.error("Erro ao buscar produtos:", error);
          return;
        }
        if (!mounted) return;

        const mapped = (data || []).map((r) => ({
          id_produto: r.id_produto ?? r.id,
          nome: r.nome_produto ?? "Produto",
          preco: typeof r.preco === "number" ? r.preco : parseFloat(String(r.preco ?? "0").replace(",", ".")) || 0,
          descricao: r.descricao ?? "",
          imagem: placeholderImg,
        }));

        setProdutos(mapped);
      } catch (err) {
        console.error("Erro inesperado ao buscar produtos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
    return () => (mounted = false);
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/menu")}
            className="p-2 rounded hover:bg-[#efe9d8] text-[#5b3a29]"
            aria-label="Voltar"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="#5b3a29"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h2 className="text-2xl font-bold text-[#5b3a29]">Chás</h2>
        </div>

        <button onClick={() => setIsOpen(true)} className="relative p-1" aria-label="Abrir carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 6h13l-1.5 9h-10L6 6z"
              stroke="#5b3a29"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="19" r="1.2" fill="#5b3a29" />
            <circle cx="17" cy="19" r="1.2" fill="#5b3a29" />
          </svg>
          {cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
              {cartItems.length}
            </span>
          )}
        </button>
      </div>

      {/* Grid de produtos */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((item, idx) => (
          <div key={idx} className="w-full bg-white rounded shadow p-4 text-center">
            <div className="w-32 h-28 mx-auto p-2 flex items-center justify-center">
              <img
                src={item.imagem}
                alt={item.nome}
                className="max-w-full max-h-full object-contain rounded"
              />
            </div>
            <h3 className="text-lg font-semibold text-[#5b3a29] mt-2">{item.nome}</h3>
            <p className="text-[#5b3a29] font-medium mt-1">R$ {item.preco.toFixed(2)}</p>
            <p className="text-sm text-gray-600 mt-1">{item.descricao}</p>
            <button
              onClick={() => addItem(item)}
              className="mt-3 bg-[#6b4f3b] text-white px-4 py-2 rounded hover:bg-[#5a3f2f]"
            >
              Adicionar ao Carrinho
            </button>
          </div>
        ))}
      </div>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}