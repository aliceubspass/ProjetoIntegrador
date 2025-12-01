import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartDrawer from "../components/CartDrawer";
import { useCart } from "../context/CartContext";

// Importando imagens diretamente da pasta src/assets/img
import bebidasImg from "../assets/img/bebida-gelada.png";
import cafeImg from "../assets/img/xicara-de-cafe.png";
import docesImg from "../assets/img/bolinho.png";
import chasImg from "../assets/img/xicara-de-cha.png";
import salgadosImg from "../assets/img/nachos.png";


export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems } = useCart();

  useEffect(() => {
    console.log("Menu render");
  }, []);

  const categories = [
    { key: "bebidas", label: "Bebidas Geladas", route: "/bebidas", image: bebidasImg },
    { key: "cafe", label: "Café", route: "/cafe", image: cafeImg },
    { key: "doces", label: "Doces", route: "/doces", image: docesImg },
    { key: "chas", label: "Chás", route: "/chas", image: chasImg },
    { key: "salgados", label: "Salgados", route: "/salgados", image: salgadosImg },
  ];

  return (
    <div className="relative min-h-screen bg-[#f8f5e4]">
      {/* Cabeçalho */}
      <header className="absolute top-0 left-0 right-0 px-8 py-4 flex justify-between items-center z-20">
        <div className="flex items-center">
          <Link
            to="/choose"
            className="mr-4 inline-flex items-center p-2 rounded hover:bg-[#efe9d8]"
            aria-label="Voltar"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#5b3a29]"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#5b3a29"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#5b3a29]">Menu</h1>
        </div>
      </header>

      {/* Área principal */}
      <main className="min-h-screen flex items-center justify-center px-4 pt-24">
        <div className="w-full max-w-2xl mx-auto">
          <div className="flex flex-col gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.key}
                to={cat.route}
                className="w-full flex items-center gap-4 bg-[#e6e1d3] px-6 py-4 rounded-md shadow-sm hover:bg-[#dcd6c4] transition"
              >
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-28 h-24 object-contain rounded-md shrink-0 bg-white p-1"
                  onError={(e) => {
                    if (!e.currentTarget.dataset.error) {
                      e.currentTarget.src = placeholderImg;
                      e.currentTarget.dataset.error = "true";
                      console.warn(`Imagem não encontrada: ${cat.image}`);
                    }
                  }}
                />
                <span className="text-lg font-medium text-[#5b3a29]">{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}