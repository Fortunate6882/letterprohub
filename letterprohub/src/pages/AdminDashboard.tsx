import { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Users, FileText, ArrowUpRight, ShieldCheck, LayoutDashboard, LogOut, CheckCircle, XCircle, Eye } from 'lucide-react'
import { supabase, Profile, Letter, Withdrawal, KycSubmission } from '../lib/supabase'

const useAdminAuth = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth')
    const loginTime = sessionStorage.getItem('admin_login_time')
    if (!auth || !loginTime) { navigate('/admin/login'); return }
    const elapsed = (Date.now() - parseInt(loginTime)) / 1000 / 60
    if (elapsed > 30) { sessionStorage.clear(); navigate('/admin/login') }
  }, [navigate])
}

// Overview
const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, pendingKyc: 0, pendingWithdrawals: 0, letters: 0 })

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('id', { count: 'exact' }),
      supabase.from('kyc_submissions').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('withdrawals').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('letters').select('id', { count: 'exact' }).eq('status', 'submitted'),
    ]).then(([u, k, w, l]) => {
      setStats({ users: u.count || 0, pendingKyc: k.count || 0, pendingWithdrawals: w.count || 0, letters: l.count || 0 })
    })
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Dashboard Overview</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: stats.users, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Pending KYC', value: stats.pendingKyc, icon: ShieldCheck, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Pending Withdrawals', value: stats.pendingWithdrawals, icon: ArrowUpRight, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Letters Submitted', value: stats.letters, icon: FileText, color: 'text-green-600', bg: 'bg-green-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-heading font-bold text-navy-900">{value}</p>
            <p className="text-gray-500 text-xs font-body mt-1">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/admin/users" className="bg-blue-600 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-blue-700 transition-colors">
          <Users size={20} />
          <span className="font-body font-semibold">Manage Users</span>
        </Link>
        <Link to="/admin/withdrawals" className="bg-navy-900 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-navy-800 transition-colors">
          <ArrowUpRight size={20} />
          <span className="font-body font-semibold">Review Withdrawals</span>
        </Link>
        <Link to="/admin/kyc" className="bg-yellow-500 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-yellow-600 transition-colors">
          <ShieldCheck size={20} />
          <span className="font-body font-semibold">Review KYC</span>
        </Link>
        <Link to="/admin/letters" className="bg-green-600 text-white rounded-2xl p-4 flex items-center gap-3 hover:bg-green-700 transition-colors">
          <FileText size={20} />
          <span className="font-body font-semibold">Review Letters</span>
        </Link>
      </div>
    </div>
  )
}

// Users
const AdminUsers = () => {
  const [users, setUsers] = useState<Profile[]>([])
  const [selected, setSelected] = useState<Profile | null>(null)
  const [editBalance, setEditBalance] = useState('')
  const [addEarning, setAddEarning] = useState({ amount: '', title: '' })
  const [swiftCode, setSwiftCode] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false }).then(({ data }) => { if (data) setUsers(data) })
  }, [])

  const saveBalance = async () => {
    if (!selected) return
    setSaving(true)
    await supabase.from('profiles').update({ balance: parseFloat(editBalance) }).eq('id', selected.id)
    setUsers(prev => prev.map(u => u.id === selected.id ? { ...u, balance: parseFloat(editBalance) } : u))
    setSelected(prev => prev ? { ...prev, balance: parseFloat(editBalance) } : null)
    setMsg('Balance updated!')
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  const addLetterEarning = async () => {
    if (!selected || !addEarning.amount || !addEarning.title) return
    setSaving(true)
    const amount = parseFloat(addEarning.amount)
    await supabase.from('letters').insert({ user_id: selected.id, title: addEarning.title, payment_amount: amount, status: 'paid' })
    await supabase.from('profiles').update({ balance: (selected.balance || 0) + amount, letters_completed: (selected.letters_completed || 0) + 1 }).eq('id', selected.id)
    setSelected(prev => prev ? { ...prev, balance: (prev.balance || 0) + amount } : null)
    setAddEarning({ amount: '', title: '' })
    setMsg('Earning added!')
    setSaving(false)
    setTimeout(() => setMsg(''), 2000)
  }

  const sendSwiftCode = async () => {
    if (!selected || !swiftCode) return
    setSaving(true)
    await supabase.from('profiles').update({ referral_code: `SWIFT:${swiftCode}` }).eq('id', selected.id)
    setMsg(`Swift code sent to ${selected.username}!`)
    setSwiftCode('')
    setSaving(false)
    setTimeout(() => setMsg(''), 3000)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">User Management</h2>
      {msg && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-body">{msg}</div>}
      {selected ? (
        <div className="space-y-4">
          <button onClick={() => setSelected(null)} className="text-blue-600 text-sm font-body flex items-center gap-1">← Back to users</button>
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-heading font-bold text-navy-900 text-lg mb-4">{selected.full_name} (@{selected.username})</h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[['Email', selected.email], ['Phone', selected.phone], ['Country', selected.country], ['KYC', selected.kyc_status], ['Balance', `$${selected.balance}`], ['Bonus', `$${selected.bonus}`], ['Letters', String(selected.letters_completed)], ['Joined', new Date(selected.created_at).toLocaleDateString()]].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-gray-400 text-xs font-body">{k}</p>
                  <p className="text-navy-900 text-sm font-body font-medium">{v}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-gray-100 pt-4">
              <div>
                <p className="font-body font-semibold text-navy-900 text-sm mb-2">Edit Balance</p>
                <div className="flex gap-2">
                  <input type="number" value={editBalance} onChange={e => setEditBalance(e.target.value)} placeholder="New balance" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-blue-500" />
                  <button onClick={saveBalance} disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold">Save</button>
                </div>
              </div>
              <div>
                <p className="font-body font-semibold text-navy-900 text-sm mb-2">Add Letter Earning</p>
                <div className="space-y-2">
                  <input type="text" value={addEarning.title} onChange={e => setAddEarning(p => ({ ...p, title: e.target.value }))} placeholder="Letter title" className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-blue-500" />
                  <div className="flex gap-2">
                    <input type="number" value={addEarning.amount} onChange={e => setAddEarning(p => ({ ...p, amount: e.target.value }))} placeholder="Amount ($)" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-blue-500" />
                    <button onClick={addLetterEarning} disabled={saving} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold">Add</button>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-body font-semibold text-navy-900 text-sm mb-2">Send Swift Code</p>
                <div className="flex gap-2">
                  <input type="text" value={swiftCode} onChange={e => setSwiftCode(e.target.value)} placeholder="Enter Swift Code" className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-blue-500" />
                  <button onClick={sendSwiftCode} disabled={saving} className="bg-navy-900 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.length === 0 ? <p className="text-gray-500 font-body text-sm">No users yet.</p> :
            users.map(u => (
              <div key={u.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="font-body font-semibold text-navy-900">{u.full_name}</p>
                  <p className="text-gray-500 text-xs font-body">@{u.username} · {u.email}</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-green-600 text-xs font-body">${u.balance}</span>
                    <span className={`text-xs font-body ${u.kyc_status === 'verified' ? 'text-green-600' : 'text-yellow-600'}`}>{u.kyc_status}</span>
                  </div>
                </div>
                <button onClick={() => { setSelected(u); setEditBalance(String(u.balance)) }} className="bg-blue-50 text-blue-600 px-3 py-2 rounded-xl text-xs font-body font-semibold flex items-center gap-1">
                  <Eye size={14} /> Manage
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

// Letters
const AdminLetters = () => {
  const [letters, setLetters] = useState<(Letter & { profiles: { username: string; email: string } })[]>([])
  const [payAmount, setPayAmount] = useState<{ [key: string]: string }>({})

  useEffect(() => {
    supabase.from('letters').select('*, profiles(username, email)').eq('status', 'submitted').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setLetters(data as any) })
  }, [])

  const approve = async (letter: any) => {
    const amount = parseFloat(payAmount[letter.id] || '0')
    await supabase.from('letters').update({ status: 'paid', payment_amount: amount }).eq('id', letter.id)
    await supabase.from('profiles').update({ balance: supabase.rpc('increment', { x: amount }), letters_completed: supabase.rpc('increment', { x: 1 }) }).eq('id', letter.user_id)
    // Simple balance update
    const { data: prof } = await supabase.from('profiles').select('balance, letters_completed').eq('id', letter.user_id).single()
    if (prof) {
      await supabase.from('profiles').update({ balance: (prof.balance || 0) + amount, letters_completed: (prof.letters_completed || 0) + 1 }).eq('id', letter.user_id)
    }
    setLetters(prev => prev.filter(l => l.id !== letter.id))
  }

  const reject = async (id: string) => {
    await supabase.from('letters').update({ status: 'rejected' }).eq('id', id)
    setLetters(prev => prev.filter(l => l.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Submitted Letters</h2>
      {letters.length === 0 ? <p className="text-gray-500 font-body text-sm">No submitted letters.</p> :
        letters.map(letter => (
          <div key={letter.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading font-bold text-navy-900">{letter.title}</p>
                <p className="text-gray-500 text-xs font-body">by @{(letter as any).profiles?.username} · {new Date(letter.created_at).toLocaleDateString()}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-body">Submitted</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm font-body whitespace-pre-wrap">{letter.content}</p>
            </div>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={payAmount[letter.id] || ''}
                onChange={e => setPayAmount(p => ({ ...p, [letter.id]: e.target.value }))}
                placeholder="Pay amount ($)"
                className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm font-body focus:outline-none focus:border-blue-500"
              />
              <button onClick={() => approve(letter)} className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold flex items-center gap-1">
                <CheckCircle size={14} /> Approve & Pay
              </button>
              <button onClick={() => reject(letter.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-xl text-sm font-body font-semibold flex items-center gap-1">
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

// KYC
const AdminKYC = () => {
  const [submissions, setSubmissions] = useState<(KycSubmission & { profiles: { username: string; email: string } })[]>([])

  useEffect(() => {
    supabase.from('kyc_submissions').select('*, profiles(username, email)').eq('status', 'pending').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSubmissions(data as any) })
  }, [])

  const updateKyc = async (sub: any, status: 'approved' | 'rejected') => {
    await supabase.from('kyc_submissions').update({ status }).eq('id', sub.id)
    await supabase.from('profiles').update({ kyc_status: status === 'approved' ? 'verified' : 'rejected' }).eq('id', sub.user_id)
    setSubmissions(prev => prev.filter(s => s.id !== sub.id))
  }

  const getUrl = (path: string) => {
    const { data } = supabase.storage.from('kyc-documents').getPublicUrl(path)
    return data.publicUrl
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Submissions</h2>
      {submissions.length === 0 ? <p className="text-gray-500 font-body text-sm">No pending KYC submissions.</p> :
        submissions.map(sub => (
          <div key={sub.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-navy-900">@{(sub as any).profiles?.username}</p>
                <p className="text-gray-500 text-xs font-body">{(sub as any).profiles?.email} · {sub.document_type?.replace('_', ' ')}</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-body">Pending</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs font-body text-gray-500 mb-1">Front</p>
                <img src={getUrl(sub.front_url)} alt="Front" className="w-full h-32 object-cover rounded-xl border" />
              </div>
              <div>
                <p className="text-xs font-body text-gray-500 mb-1">Back</p>
                <img src={getUrl(sub.back_url)} alt="Back" className="w-full h-32 object-cover rounded-xl border" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateKyc(sub, 'approved')} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => updateKyc(sub, 'rejected')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-1">
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

// Withdrawals
const AdminWithdrawals = () => {
  const [withdrawals, setWithdrawals] = useState<(Withdrawal & { profiles: { username: string } })[]>([])

  useEffect(() => {
    supabase.from('withdrawals').select('*, profiles(username)').eq('status', 'pending').order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setWithdrawals(data as any) })
  }, [])

  const updateWithdrawal = async (id: string, status: 'approved' | 'rejected') => {
    await supabase.from('withdrawals').update({ status }).eq('id', id)
    setWithdrawals(prev => prev.filter(w => w.id !== id))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Withdrawal Requests</h2>
      {withdrawals.length === 0 ? <p className="text-gray-500 font-body text-sm">No pending withdrawals.</p> :
        withdrawals.map(w => (
          <div key={w.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-heading font-bold text-navy-900">@{(w as any).profiles?.username}</p>
                <p className="text-gray-500 text-xs font-body">{new Date(w.created_at).toLocaleDateString()}</p>
              </div>
              <p className="text-2xl font-heading font-bold text-navy-900">${w.amount}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-body">BTC Address</span>
                <span className="text-navy-900 text-xs font-body font-medium break-all text-right max-w-xs">{w.btc_address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 text-xs font-body">Swift Code</span>
                <span className="text-navy-900 text-xs font-body font-medium">{w.swift_code}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => updateWithdrawal(w.id, 'approved')} className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-1">
                <CheckCircle size={14} /> Approve
              </button>
              <button onClick={() => updateWithdrawal(w.id, 'rejected')} className="flex-1 bg-red-50 text-red-600 py-2 rounded-xl text-sm font-body font-semibold flex items-center justify-center gap-1">
                <XCircle size={14} /> Reject
              </button>
            </div>
          </div>
        ))}
    </div>
  )
}

const adminNav = [
  { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/letters', label: 'Letters', icon: FileText },
  { to: '/admin/kyc', label: 'KYC', icon: ShieldCheck },
  { to: '/admin/withdrawals', label: 'Withdrawals', icon: ArrowUpRight },
]

const AdminDashboard = () => {
  useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const logout = () => {
    sessionStorage.clear()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-navy-900 fixed top-0 left-0 bottom-0 z-50">
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-white" fill="currentColor">
                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
              </svg>
            </div>
            <span className="text-white font-heading font-bold text-sm">LetterProHub</span>
          </div>
          <p className="text-white/40 text-xs font-body mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link key={to} to={to} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body transition-colors ${active ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-3">
          <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-navy-900 z-50 h-14 flex items-center justify-between px-4">
        <span className="text-white font-heading font-bold text-sm">LetterProHub Admin</span>
        <button onClick={logout} className="text-white/60 hover:text-white">
          <LogOut size={18} />
        </button>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around px-2 py-2 z-50">
        {adminNav.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl ${active ? 'text-blue-600' : 'text-gray-400'}`}>
              <Icon size={18} />
              <span className="text-xs font-body">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Content */}
      <main className="flex-1 md:ml-56 pt-14 md:pt-0 pb-20 md:pb-0 px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <Routes>
            <Route path="dashboard" element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="letters" element={<AdminLetters />} />
            <Route path="kyc" element={<AdminKYC />} />
            <Route path="withdrawals" element={<AdminWithdrawals />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
