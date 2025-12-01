import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartDrawer({ isOpen, onClose }) {
  const { cartItems, total, removeItem } = useCart();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-[#f8f5e4] shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-xl font-bold">Carrinho</h2>
        <button onClick={onClose} className="text-2xl">×</button>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
              <div>
                <p className="font-semibold">{item.nome}</p>
                <p>R$ {item.preco.toFixed(2)}</p>
              </div>
              <button
                onClick={() => removeItem(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remover
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="p-4 border-t">
          <p className="font-semibold mb-2">Total: R$ {total.toFixed(2)}</p>
          <button
            onClick={() => navigate("/pagamento")}
            className="w-full bg-[#6b4f3b] text-white py-3 rounded-md hover:bg-[#5a3f2f]"
          >
            Finalizar Pedido
          </button>
        </div>
      )}
    </div>
  );
}