import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom'
import { Home, FileText, History, User, LogOut, Eye, EyeOff, DollarSign, Gift, FileCheck, ArrowUpRight, Upload, ChevronDown, Copy, CheckCircle2, Wallet, Camera } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { supabase, Letter, Withdrawal } from '../lib/supabase'
import { Logo } from '../components/Navbar'

const BTC_ADDRESS = 'bc1qy3n22f3cxklakcua0mek4x0k5a9qyn2j6qmal8kqlee6583gvajs3zqmys'
const WA_NUMBER = '18262460563'
const WA_MESSAGE = 'This is LetterHub Support how can we be of help?'

const KycBadge = ({ status }: { status: string }) => {
  const config = {
    not_submitted: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: '🔴 KYC Not Submitted' },
    pending: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: '🟡 KYC Pending' },
    verified: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: '🟢 KYC Verified' },
    rejected: { color: 'bg-red-500/20 text-red-400 border-red-500/30', label: '🔴 KYC Rejected' },
  }
  const c = config[status as keyof typeof config] || config.not_submitted
  return (
    <Link to="/dashboard/kyc">
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-body font-medium border ${c.color}`}>
        {c.label}
      </span>
    </Link>
  )
}

const DashboardHome = () => {
  const { profile } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  if (!profile) return null
  return (
    <div className="space-y-6">
      <div>
        <p className="text-gray-500 text-sm font-body">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <h1 className="text-2xl font-heading font-bold text-navy-900 mt-1">Hello {profile.username} 👋</h1>
        <div className="mt-2"><KycBadge status={profile.kyc_status} /></div>
      </div>
      <div className="bg-navy-900 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white/60 text-sm font-body">Account Balance</p>
          <button onClick={() => setShowBalance(!showBalance)} className="text-white/60 hover:text-white">
            {showBalance ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
        <p className="text-3xl font-heading font-bold mb-1">
          {showBalance ? `$${Number(profile.balance).toFixed(2)}` : '••••••'}
        </p>
        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full font-body">Available for Withdrawal</span>
        <p className="text-white/40 text-xs font-body mt-2">Last updated: {new Date().toLocaleString()}</p>
        <div className="flex gap-3 mt-4">
          <Link to="/dashboard/deposit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-xl text-sm font-body font-medium text-center transition-colors flex items-center justify-center gap-1">
            <Wallet size={16} /> Deposit
          </Link>
          <Link to="/dashboard/withdraw" className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-sm font-body font-medium text-center transition-colors flex items-center justify-center gap-1">
            <ArrowUpRight size={16} /> Withdraw
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Total Earnings</p>
            <DollarSign size={16} className="text-green-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">${Number(profile.balance).toFixed(2)}</p>
          <p className="text-green-500 text-xs font-body mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Bonus</p>
            <Gift size={16} className="text-yellow-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">${Number(profile.bonus).toFixed(2)}</p>
          <p className="text-yellow-600 text-xs font-body mt-1">Welcome Bonus</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Letters Done</p>
            <FileCheck size={16} className="text-blue-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">{profile.letters_completed}</p>
          <p className="text-gray-400 text-xs font-body mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <p className="text-gray-500 text-xs font-body">Withdrawals</p>
            <ArrowUpRight size={16} className="text-blue-500" />
          </div>
          <p className="text-xl font-heading font-bold text-navy-900">$0.00</p>
          <p className="text-gray-400 text-xs font-body mt-1">All time</p>
        </div>
      </div>
    </div>
  )
}

const DepositPage = () => {
  const { user } = useAuth()
  const [copied, setCopied] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [amount, setAmount] = useState('')
  const copyAddress = () => {
    navigator.clipboard.writeText(BTC_ADDRESS)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!amount || !proofFile) { setError('Please enter amount and upload payment proof.'); return }
    setLoading(true)
    try {
      const filePath = `${user?.id}/proof-${Date.now()}-${proofFile.name}`
      const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(filePath, proofFile)
      if (uploadError) throw uploadError
      const { error: insertError } = await supabase.from('deposits').insert({ user_id: user?.id, amount: parseFloat(amount), proof_url: filePath, status: 'pending' })
      if (insertError) throw insertError
      setSuccess(true); setAmount(''); setProofFile(null)
    } catch { setError('Failed to submit. Please try again.') }
    finally { setLoading(false) }
  }
  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Make a Deposit</h2>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body">✅ Deposit submitted! Admin will confirm and update your balance shortly.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm font-body">{error}</div>}
      <div className="bg-navy-900 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-4"><Wallet size={20} className="text-blue-400" /><p className="font-body font-semibold">Wallet Address</p></div>
        <div className="bg-white/10 rounded-xl p-3 mb-3">
          <p className="text-xs font-body text-white/60 mb-1">Send payment to this address:</p>
          <p className="text-white text-xs font-body break-all leading-relaxed">{BTC_ADDRESS}</p>
        </div>
        <button onClick={copyAddress} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-body font-semibold transition-colors w-full justify-center">
          {copied ? <><CheckCircle2 size={16} /> Copied!</> : <><Copy size={16} /> Copy Address</>}
        </button>
        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
          <p className="text-yellow-300 text-xs font-body leading-relaxed">⚠️ Send payment to the address above then fill the form below and upload your payment proof.</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Amount Sent ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount you sent" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-medium block mb-1">Upload Payment Proof</label>
          <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
            <Upload size={24} className="text-gray-400" />
            <span className="text-sm font-body text-gray-500">{proofFile ? proofFile.name : 'Click to upload screenshot/receipt'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={e => setProofFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors">
          {loading ? 'Submitting...' : 'Submit Deposit'}
        </button>
      </form>
    </div>
  )
}

const LettersPage = () => {
  const { user } = useAuth()
  const [letters, setLetters] = useState<Letter[]>([])
  const [title, setTitle] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      supabase.from('letters').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
        .then(({ data }) => { if (data) setLetters(data) })
    }
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = ev => setPreview(ev.target?.result as string)
      reader.readAsDataURL(file)
    } else { setPreview(null) }
  }

  const submitLetter = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!title.trim()) { setError('Please enter a letter title.'); return }
    if (!imageFile) { setError('Please upload an image of your letter.'); return }
    setSubmitting(true)
    try {
      const filePath = `letters/${user?.id}/${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage.from('kyc-documents').upload(filePath, imageFile)
      if (uploadError) throw uploadError
      const { data, error: insertError } = await supabase.from('letters').insert({
        user_id: user?.id, title: title.trim(), content: '',
        image_url: filePath, status: 'submitted', payment_amount: 0
      }).select().single()
      if (insertError) throw insertError
      if (data) setLetters(prev => [data, ...prev])
      setTitle(''); setImageFile(null); setPreview(null)
      setSubmitted(true); setTimeout(() => setSubmitted(false), 5000)
    } catch { setError('Failed to submit. Please try again.') }
    finally { setSubmitting(false) }
  }

  const statusColors: Record<string, string> = {
    assigned: 'bg-blue-100 text-blue-700', submitted: 'bg-yellow-100 text-yellow-700',
    approved: 'bg-green-100 text-green-700', paid: 'bg-purple-100 text-purple-700', rejected: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">My Letters</h2>
      <form onSubmit={submitLetter} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <h3 className="font-heading font-bold text-navy-900 text-lg">Submit Your Letter Here</h3>
        {submitted && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body">✅ Your submission is pending and will be approved by our team.</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-body">{error}</div>}
        <div>
          <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Letter Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter your letter title" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Upload Letter Image</label>
          <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
            <Camera size={28} className="text-blue-500" />
            <span className="text-sm font-body text-gray-600 font-medium">Snap or Upload Letter Image</span>
            <span className="text-xs font-body text-gray-400">Take a photo or choose from gallery</span>
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
          </label>
          {preview && (
            <div className="mt-3 relative">
              <img src={preview} alt="Preview" className="w-full max-h-64 object-contain rounded-xl border border-gray-200" />
              <button type="button" onClick={() => { setImageFile(null); setPreview(null) }} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">✕</button>
            </div>
          )}
        </div>
        <button type="submit" disabled={submitting} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors flex items-center justify-center gap-2">
          {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Submitting...</> : 'Submit Letter'}
        </button>
      </form>
      {letters.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-heading font-semibold text-navy-900">Submission History</h3>
          {letters.map(letter => (
            <div key={letter.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-heading font-bold text-navy-900 text-sm">{letter.title}</h4>
                  <p className="text-gray-400 text-xs font-body mt-0.5">{new Date(letter.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {letter.payment_amount > 0 && <span className="text-green-600 font-body font-bold text-sm">${letter.payment_amount}</span>}
                  <span className={`px-2 py-1 rounded-full text-xs font-body font-medium ${statusColors[letter.status]}`}>{letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const WithdrawPage = () => {
  const { profile, refreshProfile, user } = useAuth()
  const [paymentType, setPaymentType] = useState<'bank' | 'crypto' | ''>('')
  const [method, setMethod] = useState('')
  const [amount, setAmount] = useState('')
  const [details, setDetails] = useState<Record<string, string>>({})
  const [walletType, setWalletType] = useState('')
  const [walletAddress, setWalletAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const PAYMENT_METHODS = [
    { id: 'bank_transfer', label: '🏦 Bank Transfer', fields: ['Account Name', 'Account Number', 'Bank Name', 'Sort Code / Routing Number', 'SWIFT / IBAN'] },
    { id: 'paypal', label: '💸 PayPal', fields: ['PayPal Email'] },
    { id: 'cashapp', label: '💵 Cash App', fields: ['$Cashtag'] },
    { id: 'venmo', label: '💳 Venmo', fields: ['Venmo Username'] },
    { id: 'revolut', label: '🔄 Revolut', fields: ['Revolut Username or Phone'] },
    { id: 'wise', label: '🌍 Wise', fields: ['Wise Email or Account Number'] },
    { id: 'zelle', label: '📱 Zelle', fields: ['Zelle Email or Phone Number'] },
    { id: 'payoneer', label: '💳 Payoneer', fields: ['Payoneer Email'] },
    { id: 'opay', label: '🏧 Opay', fields: ['Opay Phone Number'] },
    { id: 'palmpay', label: '🌴 Palmpay', fields: ['Palmpay Phone Number'] },
    { id: 'gtbank', label: '🏦 GTBank', fields: ['Account Name', 'Account Number'] },
    { id: 'access_bank', label: '🏦 Access Bank', fields: ['Account Name', 'Account Number'] },
  ]

  const WALLET_TYPES = ['BTC', 'ETH', 'USDT (TRC20)', 'USDT (ERC20)', 'BNB', 'USDC']
  const selectedMethod = PAYMENT_METHODS.find(m => m.id === method)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!amount || parseFloat(amount) <= 0) { setError('Please enter a valid amount.'); return }
    if (profile && parseFloat(amount) > profile.balance) { setError('Insufficient balance.'); return }
    if (!paymentType) { setError('Please select a payment type.'); return }
    if (paymentType === 'bank') {
      if (!method) { setError('Please select a payment method.'); return }
      if (selectedMethod) {
        for (const field of selectedMethod.fields) {
          if (!details[field]?.trim()) { setError(`Please fill in ${field}.`); return }
        }
      }
    }
    if (paymentType === 'crypto') {
      if (!walletType) { setError('Please select a wallet type.'); return }
      if (!walletAddress.trim()) { setError('Please enter your wallet address.'); return }
    }
    setLoading(true)
    const { error: err } = await supabase.from('withdrawals').insert({
      user_id: user?.id, amount: parseFloat(amount),
      payment_method: paymentType === 'bank' ? method : 'crypto',
      payment_details: paymentType === 'bank' ? details : {},
      wallet_type: paymentType === 'crypto' ? walletType : null,
      wallet_address: paymentType === 'crypto' ? walletAddress : null,
      status: 'pending'
    })
    setLoading(false)
    if (err) { setError('Failed. Please try again.'); return }
    setSuccess(true)
    setAmount(''); setPaymentType(''); setMethod(''); setDetails({}); setWalletType(''); setWalletAddress('')
    refreshProfile()
  }

  return (
    <div className="space-y-6 max-w-lg">
      <h2 className="text-2xl font-heading font-bold text-navy-900">Request Withdrawal</h2>
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
        <p className="text-gray-400 text-sm font-body">Available Balance</p>
        <p className="text-2xl font-heading font-bold text-navy-900">${Number(profile?.balance || 0).toFixed(2)}</p>
      </div>
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm font-body">✅ Withdrawal request submitted! Admin will review shortly.</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-body">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Amount ($)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter withdrawal amount" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500" />
        </div>
        <div>
          <label className="text-gray-700 text-sm font-body font-semibold block mb-2">Payment Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button type="button" onClick={() => { setPaymentType('bank'); setWalletType(''); setWalletAddress('') }}
              className={`py-3 rounded-xl text-sm font-body font-semibold border-2 transition-colors ${paymentType === 'bank' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}>
              🏦 Bank / Payment App
            </button>
            <button type="button" onClick={() => { setPaymentType('crypto'); setMethod(''); setDetails({}) }}
              className={`py-3 rounded-xl text-sm font-body font-semibold border-2 transition-colors ${paymentType === 'crypto' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-500'}`}>
              💰 Crypto Wallet
            </button>
          </div>
        </div>
        {paymentType === 'bank' && (
          <div>
            <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Select Payment Method</label>
            <select value={method} onChange={e => { setMethod(e.target.value); setDetails({}) }} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 bg-white">
              <option value="">Choose payment method</option>
              {PAYMENT_METHODS.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
        )}
        {paymentType === 'bank' && method && selectedMethod && selectedMethod.fields.map(field => (
          <div key={field}>
            <label className="text-gray-700 text-sm font-body font-semibold block mb-1">{field}</label>
            <input type="text" value={details[field] || ''} onChange={e => setDetails(p => ({ ...p, [field]: e.target.value }))} placeholder={`Enter ${field}`} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500" />
          </div>
        ))}
        {paymentType === 'crypto' && (
          <div className="space-y-4">
            <div>
              <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Select Wallet Type</label>
              <select value={walletType} onChange={e => setWalletType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 bg-white">
                <option value="">Choose wallet type</option>
                {WALLET_TYPES.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            {walletType && (
              <div>
                <label className="text-gray-700 text-sm font-body font-semibold block mb-1">Wallet Address</label>
                <input type="text" value={walletAddress} onChange={e => setWalletAddress(e.target.value)} placeholder="Enter your wallet address" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500" />
              </div>
            )}
          </div>
        )}
        <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-bold text-sm transition-colors">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </div>
  )
}

const KycPage = () => {
  const { profile, user, refreshProfile } = useAuth()
  const [docType, setDocType] = useState('')
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  if (profile?.kyc_status === 'pending') return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
        <p className="text-yellow-800 font-body leading-relaxed">Your KYC documents have been submitted and are under review. Our compliance team will verify your identity within 24-48 hours.</p>
      </div>
    </div>
  )
  if (profile?.kyc_status === 'verified') return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
        <p className="text-green-800 font-body font-semibold">✅ Your identity has been verified!</p>
      </div>
    </div>
  )
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError('')
    if (!docType || !frontFile || !backFile) { setError('Please select document type and upload both front and back.'); return }
    setLoading(true)
    try {
      const uploadFile = async (file: File, path: string) => {
        const { data, error } = await supabase.storage.from('kyc-documents').upload(path, file)
        if (error) throw error; return data.path
      }
      const frontPath = await uploadFile(frontFile, `${user?.id}/front-${Date.now()}`)
      const backPath = await uploadFile(backFile, `${user?.id}/back-${Date.now()}`)
      await supabase.from('kyc_submissions').insert({ user_id: user?.id, document_type: docType, front_url: frontPath, back_url: backPath, status: 'pending' })
      await supabase.from('profiles').update({ kyc_status: 'pending' }).eq('id', user?.id)
      setSuccess(true); refreshProfile()
    } catch { setError('Upload failed. Please try again.') }
    finally { setLoading(false) }
  }
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">KYC Verification</h2>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm font-body">{error}</div>}
      {success ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
          <p className="text-green-800 font-body leading-relaxed">Documents submitted successfully. Our team will verify within 24-48 hours.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
          <div>
            <label className="text-gray-700 text-sm font-body font-medium block mb-1">Document Type</label>
            <div className="relative">
              <select value={docType} onChange={e => setDocType(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-body focus:outline-none focus:border-blue-500 appearance-none">
                <option value="">Select document type</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {docType && (
            <>
              <div>
                <label className="text-gray-700 text-sm font-body font-medium block mb-1">Front of Document</label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-body text-gray-500">{frontFile ? frontFile.name : 'Click to upload front'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setFrontFile(e.target.files?.[0] || null)} />
                </label>
              </div>
              <div>
                <label className="text-gray-700 text-sm font-body font-medium block mb-1">Back of Document</label>
                <label className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-blue-400 transition-colors">
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm font-body text-gray-500">{backFile ? backFile.name : 'Click to upload back'}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => setBackFile(e.target.files?.[0] || null)} />
                </label>
              </div>
            </>
          )}
          <button type="submit" disabled={loading || !docType} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-body font-semibold text-sm transition-colors">
            {loading ? 'Submitting...' : 'Submit KYC'}
          </button>
        </form>
      )}
    </div>
  )
}

const HistoryPage = () => {
  const { user } = useAuth()
  const [tab, setTab] = useState<'earnings' | 'withdrawals' | 'deposits'>('earnings')
  const [letters, setLetters] = useState<Letter[]>([])
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [deposits, setDeposits] = useState<any[]>([])
  useEffect(() => {
    if (user) {
      supabase.from('letters').select('*').eq('user_id', user.id).in('status', ['approved', 'paid']).order('created_at', { ascending: false }).then(({ data }) => { if (data) setLetters(data) })
      supabase.from('withdrawals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => { if (data) setWithdrawals(data) })
      supabase.from('deposits').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => { if (data) setDeposits(data) })
    }
  }, [user])
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700', approved: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700', paid: 'bg-purple-100 text-purple-700',
  }
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">History</h2>
      <div className="flex gap-2 bg-gray-100 rounded-xl p-1 w-fit">
        {(['earnings', 'deposits', 'withdrawals'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-colors capitalize ${tab === t ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500'}`}>{t}</button>
        ))}
      </div>
      <div className="space-y-3">
        {tab === 'earnings' ? (
          letters.length === 0 ? <p className="text-gray-500 font-body text-sm">No earnings yet.</p> :
          letters.map(l => (
            <div key={l.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div><p className="font-body font-medium text-navy-900 text-sm">{l.title}</p><p className="text-gray-400 text-xs font-body">{new Date(l.created_at).toLocaleDateString()}</p></div>
              <div className="flex items-center gap-3"><p className="text-green-600 font-heading font-bold">${l.payment_amount}</p><span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[l.status]}`}>{l.status}</span></div>
            </div>
          ))
        ) : tab === 'deposits' ? (
          deposits.length === 0 ? <p className="text-gray-500 font-body text-sm">No deposits yet.</p> :
          deposits.map(d => (
            <div key={d.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div><p className="font-body font-medium text-navy-900 text-sm">Deposit</p><p className="text-gray-400 text-xs font-body">{new Date(d.created_at).toLocaleDateString()}</p></div>
              <div className="flex items-center gap-3"><p className="text-navy-900 font-heading font-bold">${d.amount}</p><span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[d.status]}`}>{d.status}</span></div>
            </div>
          ))
        ) : (
          withdrawals.length === 0 ? <p className="text-gray-500 font-body text-sm">No withdrawals yet.</p> :
          withdrawals.map(w => (
            <div key={w.id} className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between">
              <div><p className="font-body font-medium text-navy-900 text-sm">Withdrawal Request</p><p className="text-gray-400 text-xs font-body">{new Date(w.created_at).toLocaleDateString()}</p></div>
              <div className="flex items-center gap-3"><p className="text-navy-900 font-heading font-bold">${w.amount}</p><span className={`px-2 py-1 rounded-full text-xs font-body ${statusColors[w.status]}`}>{w.status}</span></div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

const ProfilePage = () => {
  const { profile } = useAuth()
  if (!profile) return null
  return (
    <div className="max-w-lg space-y-6">
      <h2 className="text-2xl font-heading font-bold text-navy-900">My Profile</h2>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-gray-100">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-heading font-bold">{profile.username?.[0]?.toUpperCase()}</div>
          <div><p className="font-heading font-bold text-navy-900 text-lg">{profile.full_name}</p><p className="text-gray-500 text-sm font-body">@{profile.username}</p><KycBadge status={profile.kyc_status} /></div>
        </div>
        {[['Username', profile.username], ['Full Name', profile.full_name], ['Email', profile.email], ['Phone', profile.phone], ['Country', profile.country], ['Member Since', new Date(profile.created_at).toLocaleDateString()], ['Account Balance', `$${Number(profile.balance).toFixed(2)}`], ['Welcome Bonus', `$${Number(profile.bonus).toFixed(2)}`], ['Letters Completed', String(profile.letters_completed)]].map(([label, value]) => (
          <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50">
            <span className="text-gray-500 text-sm font-body">{label}</span>
            <span className="text-navy-900 text-sm font-body font-medium">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/dashboard/letters', label: 'Letters', icon: FileText },
  { to: '/dashboard/history', label: 'History', icon: History },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
]

const Dashboard = () => {
  const { profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-navy-900 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4">
        <Logo white />
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-heading font-bold">{profile?.username?.[0]?.toUpperCase() || 'U'}</div>
          <button onClick={signOut} className="flex items-center gap-1 text-white/60 hover:text-white text-sm font-body transition-colors"><LogOut size={16} /><span className="hidden sm:inline">Logout</span></button>
        </div>
      </header>

      <main className="pt-16 pb-20 px-4 max-w-2xl mx-auto">
        <div className="py-6">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="deposit" element={<DepositPage />} />
            <Route path="letters" element={<LettersPage />} />
            <Route path="withdraw" element={<WithdrawPage />} />
            <Route path="kyc" element={<KycPage />} />
            <Route path="history" element={<HistoryPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 flex justify-around z-50">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to))
          return (
            <Link key={to} to={to} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
              <Icon size={20} /><span className="text-xs font-body">{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* WhatsApp Floating Support Button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(WA_MESSAGE)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-24 right-4 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
        style={{ background: '#25D366' }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  )
}

export default Dashboard
