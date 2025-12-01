import { useNavigate } from "react-router-dom";

export default function ChooseInstitution() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fdf6e3]">
      {/* seta personalizada para voltar (igual à do Menu) */}
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/login")}
          className="p-2 rounded hover:bg-[#efe9d8] focus:outline-none"
          aria-label="Voltar"
        >
          {/* seta minimalista com cor marrom cafeteria (mesma usada no Menu) */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M15 18L9 12L15 6" stroke="#5b3a29" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md max-w-sm w-full text-center">
        <h1 className="text-2xl font-bold mb-6 text-[#6b4f4f]">Escolha a instituição</h1>
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#6b4f4f] text-white px-6 py-3 rounded hover:bg-[#5a3f3f] transition duration-300"
          >
            Sesc
          </button>
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#6b4f4f] text-white px-6 py-3 rounded hover:bg-[#5a3f3f] transition duration-300"
          >
            Senac
          </button>
        </div>
      </div>
    </div>
  );
}