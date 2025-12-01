import { useParams } from "react-router-dom";

export default function Instituicao() {
  const { nome } = useParams();

  return (
    <div className="min-h-screen bg-[#f8f5e4] flex items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800">
        {nome.toUpperCase()}
      </h1>
    </div>
  );
}