import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Logo = ({ white = false }: { white?: boolean }) => (
  <Link to="/" className="flex items-center gap-2">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${white ? 'bg-blue-500' : 'bg-blue-600'}`}>
      <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
      </svg>
    </div>
    <span className={`font-heading font-bold text-lg ${white ? 'text-white' : 'text-navy-900'}`}>
      LetterPro<span className="text-blue-500">Hub</span>
    </span>
  </Link>
)

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isLanding = location.pathname === '/'

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isLanding ? 'glass' : 'bg-navy-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo white />
          <div className="hidden md:flex items-center gap-8">
            {['Home', 'About', 'Contact'].map(item => (
              <Link
                key={item}
                to={item === 'Home' ? '/' : `/#${item.toLowerCase()}`}
                className="text-white/80 hover:text-white text-sm font-body font-medium transition-colors"
              >
                {item}
              </Link>
            ))}
            <Link to="/login" className="text-white/80 hover:text-white text-sm font-body font-medium transition-colors">
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-body font-semibold transition-colors"
            >
              Register
            </Link>
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden bg-navy-900 border-t border-white/10 px-4 py-4 space-y-3">
          {['Home', 'About', 'Contact', 'Login'].map(item => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : item === 'Login' ? '/login' : `/#${item.toLowerCase()}`}
              className="block text-white/80 hover:text-white py-2 text-sm font-body"
              onClick={() => setOpen(false)}
            >
              {item}
            </Link>
          ))}
          <Link
            to="/register"
            className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-body font-semibold text-center"
            onClick={() => setOpen(false)}
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  )
}

export { Logo }
export default Navbar
