export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#6b4f4f] text-white px-6 py-2 rounded hover:bg-[#5a3f3f] transition duration-300 w-full"
    >
      {children}
    </button>
  );
}