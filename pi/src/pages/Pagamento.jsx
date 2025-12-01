import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";

export default function Pagamento() {
  const navigate = useNavigate();
  const { cartItems } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [metodoSelecionado, setMetodoSelecionado] = useState(null);

  const metodos = [
    { key: "cartao-credito", nome: "Cartão de Crédito", image: "https://cdn-icons-png.flaticon.com/512/2695/2695969.png"},
    { key: "cartao-debito", nome: "Cartão de Débito", image: "https://cdn-icons-png.flaticon.com/512/2695/2695969.png" },
    { key: "pix", nome: "Pix", image: "https://user-images.githubusercontent.com/741969/99538133-492fe280-298b-11eb-81a2-66779343e064.png" },
    { key: "dinheiro", nome: "Dinheiro", image: "https://cdn-icons-png.flaticon.com/512/10384/10384161.png" }
  ];

  const publicPath = (name) => `${import.meta.env.BASE_URL}assets/payment/${name}`;

  const resolveSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http://") || img.startsWith("https://")) return img;
    return publicPath(img);
  };

  const placeholder =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='220'><rect width='100%' height='100%' fill='#e6e1d3'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#777' font-size='18'>Imagem</text></svg>`
    );

  const confirmarPagamento = () => {
    navigate("/confirmacao");
  };

  return (
    <div className="relative min-h-screen bg-[#f8f5e4] text-[#5b3a29]">
      {/* Cabeçalho */}
      <header className="absolute top-0 left-0 right-0 px-6 py-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <BackButton to="/menu" />
          <h1 className="text-2xl font-bold text-[#5b3a29]">Pagamento</h1>
        </div>

        
      </header>

      {/* Conteúdo principal */}
      <main className="min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <div className="w-full max-w-2xl mx-auto flex flex-col gap-4">
          {metodos.map((m) => (
            <button
              key={m.key}
              onClick={() => setMetodoSelecionado(m.key)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-md shadow-sm transition ${
                metodoSelecionado === m.key ? "bg-[#dcd6c4]" : "bg-[#e6e1d3] hover:bg-[#dcd6c4]"
              }`}
              aria-label={`Selecionar ${m.nome}`}
            >
              <img
                src={resolveSrc(m.image)}
                alt={m.nome}
                className="w-28 h-20 object-cover rounded-md shrink-0"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = placeholder;
                  console.warn(`Imagem não encontrada: ${resolveSrc(m.image)}`);
                }}
              />
              <span className="text-lg font-medium text-[#5b3a29]">{m.nome}</span>
            </button>
          ))}

          {/* Botão Confirmar */}
          {metodoSelecionado && (
            <button
              onClick={confirmarPagamento}
              className="mt-4 bg-[#6b4f3b] text-white px-6 py-3 rounded hover:bg-[#5a3f2f] transition"
            >
              Confirmar
            </button>
          )}
        </div>
      </main>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}