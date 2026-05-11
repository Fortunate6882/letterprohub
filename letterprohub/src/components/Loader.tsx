const Loader = () => {
  return (
    <div className="loader-overlay">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin-slow"></div>
          <div className="absolute inset-3 flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-blue-400" fill="currentColor">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-white font-heading font-bold text-lg">LetterProHub</p>
          <p className="text-blue-400 text-sm font-body">Write. Earn. Withdraw.</p>
        </div>
      </div>
    </div>
  )
}

export default Loader
