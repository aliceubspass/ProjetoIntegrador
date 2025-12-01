import React from "react";
import { useNavigate } from "react-router-dom";

export default function Carrinho({ itens = [], total = 0 }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8f5e4] p-4 font-sans text-[#5b3a29]">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-xl text-[#5b3a29] hover:text-[#45291f] transition"
        aria-label="Voltar"
      >
        ←
      </button>

      <h1 className="text-2xl font-bold mb-4 text-[#5b3a29]">Carrinho</h1>

      <div className="flex gap-4">
        <div className="flex flex-col gap-4 w-[300px]">
          {itens.length === 0 ? (
            <div className="p-4 bg-white rounded-md text-[#5b3a29]">
              Seu carrinho está vazio.
            </div>
          ) : (
            itens.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white rounded-md p-2"
              >
                <img src={item.img} alt={item.nome} className="w-16 h-16 rounded-md" />
                <div>
                  <p className="font-semibold text-[#5b3a29]">{item.nome}</p>
                  <p className="text-[#5b3a29]">R$ {item.preco.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="flex-1 flex flex-col justify-center items-center bg-white rounded-md p-4">
          <p className="text-lg font-semibold text-[#5b3a29]">Total: R$ {total.toFixed(2)}</p>
          <button
            onClick={() => navigate("/pagamento")}
            className="mt-4 bg-[#6b4f3b] text-white px-6 py-3 rounded-md hover:bg-[#5a3f2f]"
          >
            Finalizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
}