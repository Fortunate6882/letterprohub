import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'
import { Logo } from './Navbar'

const Footer = () => {
  const openSmartsupp = () => {
    if (typeof window !== 'undefined') {
      if ((window as any).smartsupp) {
        (window as any).smartsupp('chat:open')
      } else if ((window as any).$crisp) {
        (window as any).$crisp.push(['do', 'chat:open'])
      } else {
        window.open('https://tawk.to', '_blank')
      }
  }
  return (
    <footer className="bg-navy-900 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1 */}
          <div className="space-y-4">
            <Logo white />
            <p className="text-white/60 text-sm font-body leading-relaxed">
              Connecting professional writers with real earning opportunities worldwide.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-white/10 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[['Home', '/'], ['About Us', '/#about'], ['How It Works', '/#how-it-works']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/60 hover:text-white text-sm font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2">
              {[['Login', '/login'], ['Register', '/register']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/60 hover:text-white text-sm font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <h4 className="font-heading font-semibold text-white mt-4 mb-2">Legal</h4>
              </li>
              {[['Terms of Service', '/terms'], ['Privacy Policy', '/privacy'], ['Cookie Policy', '/cookies']].map(([label, href]) => (
                <li key={label}>
                  <Link to={href} className="text-white/60 hover:text-white text-sm font-body transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-heading font-semibold text-white mb-4">Support & Contact</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={openSmartsupp}
                  className="text-blue-400 hover:text-blue-300 text-sm font-body font-semibold transition-colors flex items-center gap-2"
                >
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  Contact Support (Live Chat)
                </button>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm font-body">
                <Phone size={14} />
                <span>+1 (800) 000-0000</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm font-body">
                <Mail size={14} />
                <span>support@letterprohub.com</span>
              </li>
              <li className="flex items-start gap-2 text-white/60 text-sm font-body">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <span>123 Business Avenue, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs font-body">© 2026 LetterProHub. All Rights Reserved.</p>
          <p className="text-white/40 text-xs font-body">🔒 Your earnings and data are always secure</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
