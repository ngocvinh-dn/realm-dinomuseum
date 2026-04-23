import React from 'react';

const CallToAction = () => {
  return (
    <section className="h-screen w-full flex items-center justify-center text-center px-4 bg-gradient-to-t from-[#0a0a0a] to-transparent">
      <div>
        <h2 className="text-5xl md:text-7xl font-serif mb-8">Một thế giới mới <br/> đang chờ đón</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10 text-lg">
          Bí ẩn lớn nhất của lịch sử Trái Đất. Cảm nhận sức mạnh nguyên thủy thông qua bộ sưu tập 3D của chúng tôi.
        </p>
        <button className="px-8 py-4 bg-green-500 text-black font-bold tracking-widest uppercase rounded-full hover:bg-green-400 transition-colors">
          Khám phá Ngay
        </button>
      </div>
    </section>
  );
};

export default CallToAction;