export default function TailwindTest() {
  return (
    <div className="bg-galaxy-orange text-white p-4 rounded-lg shadow-lg max-w-md mx-auto my-8">
      <h2 className="text-2xl font-bold mb-2">✅ Tailwind CSS v4 hoạt động!</h2>
      <p className="text-sm">
        Component này sử dụng Tailwind classes và custom Galaxy Cinema theme.
      </p>
      <button className="mt-4 bg-white text-galaxy-orange px-4 py-2 rounded hover:bg-gray-100 transition-colors font-semibold">
        Đặt vé ngay
      </button>
    </div>
  );
}
