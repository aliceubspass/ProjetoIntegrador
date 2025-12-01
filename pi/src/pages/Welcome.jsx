import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import xicara from "../assets/img/xicara-de-cafe.png";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#fdf6e3]">
      <div className="text-center bg-white p-8 rounded-lg shadow-md max-w-sm w-full">
        {/* imagem reduzida */}
        <img
          className="w-16 h-16 mb-4 mx-auto"
          src={xicara}
          alt="Xícara de café"
        />
        <h1 className="text-3xl font-bold mb-2 text-[#6b4f4f]">CAFETERIA</h1>
        <p className="text-lg mb-6 text-gray-700">Bem-Vindo!</p>
        <div className="flex flex-col gap-4">
          {/* Botão para entrar como aluno */}
          <Button onClick={() => navigate("/login")}>
            Entrar como Aluno
          </Button>

          {/* Botão para entrar como administrador */}
          <Button onClick={() => navigate("/login2")}>
            Entrar como Administrador
          </Button>

          {/* Botão para cadastro */}
          <Button onClick={() => navigate("/register")}>Cadastro</Button>
        </div>
      </div>
    </div>
  );
}
