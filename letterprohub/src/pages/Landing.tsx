import { Link } from 'react-router-dom'
import { CheckCircle, ArrowRight, Star } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FloatingNotifications from '../components/FloatingNotifications'

const testimonials = [
  { quote: "LetterProHub changed my life. I earn consistently just by writing letters from home.", name: "Marcus T.", role: "Freelance Writer" },
  { quote: "The platform is simple and the payments are always on time. Highly recommended!", name: "Priya S.", role: "Online Earner" },
  { quote: "I was skeptical at first but after my first withdrawal I was convinced. This is real!", name: "Daniel K.", role: "Content Writer" },
  { quote: "The admin team is professional and always assigns interesting letter topics.", name: "Sarah M.", role: "Writer" },
  { quote: "I've tried many platforms but LetterProHub pays the best per letter. Love it!", name: "James O.", role: "Freelancer" },
  { quote: "Fast withdrawals and great support. LetterProHub is exactly what writers need.", name: "Linda C.", role: "Remote Worker" },
  { quote: "LetterProHub changed my life. I earn consistently just by writing letters from home.", name: "Marcus T.", role: "Freelance Writer" },
  { quote: "The platform is simple and the payments are always on time. Highly recommended!", name: "Priya S.", role: "Online Earner" },
]

const features = [
  "Free to join",
  "$15 welcome bonus on signup",
  "Admin assigned letter topics",
  "Flexible earning per letter",
  "Fast withdrawals",
  "Secure and transparent",
  "Write from anywhere",
  "Professional support team",
]

const team = [
  { name: "Franklin Hart", role: "CEO & Founder", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face" },
  { name: "Olivia Bennett", role: "Head of Operations", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face" },
  { name: "Wei Zhang", role: "Senior Writing Manager", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&crop=face" },
  { name: "Jack Doe", role: "Growth Strategist", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face" },
]

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <FloatingNotifications />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1920&h=1080&fit=crop&crop=center')" }}/>
        <div className="absolute inset-0 bg-navy-900/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fadeInUp">
          <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 px-4 py-2 rounded-full text-sm font-body font-medium mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
            Trusted by 10,000+ Writers Worldwide
          </div>
          <h1 className="text-4xl md:text-6xl font-heading font-bold text-white leading-tight mb-6">
            Get Paid to Write<br />
            <span className="text-blue-400">Professional Letters</span>
          </h1>
          <p className="text-xl font-heading font-semibold text-blue-300 mb-4">
            Write. Earn. Withdraw. — The Smarter Way to Earn Online.
          </p>
          <p className="text-white/70 text-lg font-body mb-8 max-w-2xl mx-auto leading-relaxed">
            LetterProHub connects skilled writers with real earning opportunities. Write professional letters assigned by our team and get paid instantly to your wallet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-body font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:scale-105">
              Start Writing Today <ArrowRight size={20} />
            </Link>
            <a href="#how-it-works" className="border border-white/30 hover:border-white/60 text-white px-8 py-4 rounded-xl font-body font-semibold text-lg transition-all hover:bg-white/10">
              Learn More
            </a>
          </div>
          <div className="mt-12 flex justify-center gap-8 text-center">
            {[['$12M+', 'Paid Out'], ['10K+', 'Active Writers'], ['4.9/5', 'Satisfaction']].map(([num, label]) => (
              <div key={label}>
                <p className="text-2xl font-heading font-bold text-white">{num}</p>
                <p className="text-white/60 text-sm font-body">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-4">How It Works</h2>
            <p className="text-gray-600 font-body text-lg">Three simple steps to start earning</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Register', desc: 'Create your free account and instantly receive a $15 welcome bonus', icon: '📝' },
              { step: '02', title: 'Get Assigned', desc: 'Admin assigns you professional letter topics via WhatsApp', icon: '📬' },
              { step: '03', title: 'Get Paid', desc: 'Submit your completed letter and receive payment to your wallet', icon: '💰' },
            ].map(({ step, title, desc, icon }) => (
              <div key={step} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center">
                <div className="text-4xl mb-4">{icon}</div>
                <div className="text-blue-600 font-heading font-bold text-sm mb-2">STEP {step}</div>
                <h3 className="text-xl font-heading font-bold text-navy-900 mb-3">{title}</h3>
                <p className="text-gray-600 font-body leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=600&h=300&fit=crop" alt="Writing" className="rounded-2xl w-full object-cover h-48"/>
              <img src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&h=300&fit=crop" alt="Professional writing" className="rounded-2xl w-full object-cover h-48"/>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-6">Why LetterProHub?</h2>
              <p className="text-gray-600 font-body leading-relaxed mb-4">
                LetterProHub is designed to empower writers worldwide with real earning opportunities. Our platform connects skilled letter writers with clients who need professional correspondence — from business proposals to formal communications.
              </p>
              <p className="text-gray-600 font-body leading-relaxed mb-8">
                With LetterProHub, you earn on your own terms. Complete assigned letters, track your earnings, and withdraw directly to your wallet — anytime, anywhere.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={16} className="text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700 text-sm font-body">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy-900 mb-4">Meet Our Team</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map(({ name, role, img }) => (
              <div key={name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
                <img src={img} alt={name} className="w-20 h-20 rounded-full mx-auto mb-4 object-cover" />
                <h4 className="font-heading font-bold text-navy-900 text-sm">{name}</h4>
                <p className="text-gray-500 text-xs font-body mt-1">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-navy-900 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-white mb-4">Client Testimonials</h2>
        </div>
        <div className="relative">
          <div className="flex gap-6 animate-scroll w-max">
            {[...testimonials, ...testimonials].map(({ quote, name, role }, i) => (
              <div key={i} className="bg-white/10 backdrop-blur rounded-2xl p-6 w-72 flex-shrink-0 border border-white/10">
                <div className="text-yellow-400 text-3xl mb-3">"</div>
                <p className="text-white/80 text-sm font-body leading-relaxed mb-4">{quote}</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">{name[0]}</div>
                  <div>
                    <p className="text-white text-xs font-heading font-semibold">{name}</p>
                    <p className="text-white/50 text-xs font-body">{role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-4">
            Stay Informed And Never Miss A LetterProHub Update!
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <input type="email" placeholder="Enter your email address" className="flex-1 px-4 py-3 rounded-xl font-body text-gray-900 focus:outline-none"/>
            <button className="bg-navy-900 hover:bg-navy-800 text-white px-6 py-3 rounded-xl font-body font-semibold transition-colors">Subscribe Now</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Landing
