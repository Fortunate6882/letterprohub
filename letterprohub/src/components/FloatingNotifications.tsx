import { useEffect, useState } from 'react'

const notifications = [
  { msg: (u: string, a: number) => `${u} just requested a $${a.toLocaleString()} withdrawal`, type: 'withdraw' },
  { msg: (u: string) => `${u}'s KYC has been verified and is ready for withdrawal`, type: 'kyc' },
  { msg: (u: string, a: number) => `${u}'s withdrawal of $${a.toLocaleString()} has been confirmed`, type: 'confirm' },
  { msg: (u: string) => `${u} just received a $15 sign up bonus`, type: 'bonus' },
  { msg: (u: string, a: number) => `${u} just completed a letter and earned $${a.toLocaleString()}`, type: 'letter' },
]

const usernames = ['James_W', 'Sarah_M', 'Daniel_K', 'Priya_S', 'Marcus_T', 'Linda_C', 'John_D', 'Emma_R', 'Chris_P', 'Amara_N']
const amounts = [32500, 45800, 61200, 38900, 52400, 47100, 33600, 58300, 42700, 67500]

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const FloatingNotifications = () => {
  const [current, setCurrent] = useState<{ msg: string; visible: boolean }>({ msg: '', visible: false })
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const show = () => {
      const notif = notifications[index % notifications.length]
      const username = getRandomItem(usernames)
      const amount = getRandomItem(amounts)
      const msg = notif.msg(username, amount)
      setCurrent({ msg, visible: true })

      setTimeout(() => {
        setCurrent(prev => ({ ...prev, visible: false }))
        setTimeout(() => {
          setIndex(prev => prev + 1)
        }, 600)
      }, 4000)
    }

    const timer = setTimeout(show, 1500)
    return () => clearTimeout(timer)
  }, [index])

  if (!current.msg) return null

  return (
    <div
      className={`fixed bottom-6 left-4 z-50 max-w-xs transition-all duration-500 ${
        current.visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'
      }`}
    >
      <div className="bg-white rounded-xl shadow-2xl p-3 flex items-center gap-3 border border-gray-100">
        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 animate-pulse"></div>
        <p className="text-xs text-gray-700 font-body font-medium leading-tight">{current.msg}</p>
      </div>
    </div>
  )
}

export default FloatingNotifications
