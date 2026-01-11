export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Test 1: Basic Tailwind Classes */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">
            ✅ Tailwind CSS Test Page
          </h1>
          <p className="text-gray-700 text-lg">
            Nếu bạn thấy các màu sắc, spacing, và typography đẹp như dưới đây, 
            Tailwind đã hoạt động!
          </p>
        </div>

        {/* Test 2: Custom Galaxy Theme Colors */}
        <div className="bg-galaxy-orange text-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-3xl font-bold mb-3">
            🎬 Galaxy Cinema Theme
          </h2>
          <p className="text-lg opacity-90">
            Component này sử dụng custom color: bg-galaxy-orange (#f58020)
          </p>
          <button className="mt-4 bg-white text-galaxy-orange px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
            Đặt Vé Ngay
          </button>
        </div>

        {/* Test 3: Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-red-500 text-white p-6 rounded-lg text-center">
            <div className="text-2xl font-bold">Red</div>
            <div className="text-sm mt-2">bg-red-500</div>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg text-center">
            <div className="text-2xl font-bold">Green</div>
            <div className="text-sm mt-2">bg-green-500</div>
          </div>
          <div className="bg-blue-500 text-white p-6 rounded-lg text-center">
            <div className="text-2xl font-bold">Blue</div>
            <div className="text-sm mt-2">bg-blue-500</div>
          </div>
        </div>

        {/* Test 4: Hover Effects */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-4">Hover Effects Test</h3>
          <div className="flex gap-4 flex-wrap">
            <button className="px-6 py-3 bg-galaxy-orange text-white rounded hover:bg-orange-600 transition-colors">
              Hover Me
            </button>
            <button className="px-6 py-3 bg-blue-500 text-white rounded hover:shadow-xl transition-shadow">
              Shadow Effect
            </button>
            <button className="px-6 py-3 bg-purple-500 text-white rounded hover:scale-110 transition-transform">
              Scale Effect
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded">
          <h3 className="text-xl font-bold text-yellow-800 mb-2">
            📝 Hướng dẫn
          </h3>
          <ul className="text-yellow-700 space-y-2">
            <li>• Nếu thấy màu sắc và styling → Tailwind hoạt động ✅</li>
            <li>• Nếu chỉ thấy text đen trắng → Tailwind chưa load ❌</li>
            <li>• Thử hard refresh: Ctrl + Shift + R (Windows) hoặc Cmd + Shift + R (Mac)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
