const ModernLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm z-50">
      
      <div className="flex flex-col items-center gap-6">
        
        <h1 className="text-xl font-semibold text-white tracking-wide">
          Loading
        </h1>

        {/* Animated Dots */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
        </div>

      </div>

    </div>
  );
};

export default ModernLoader;