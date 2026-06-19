import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialView?: 'login' | 'signup'
}

export default function AuthModal({ isOpen, onClose, initialView = 'login' }: AuthModalProps) {
  const [view, setView] = useState<'login' | 'signup'>(initialView)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setMessage(null)

    try {
      if (view === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        })
        if (signUpError) throw signUpError
        setMessage('Check your email for the confirmation link!')
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        onClose()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md liquid-glass p-8 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="relative inline-flex items-center justify-center w-10 h-10 rounded-full border-2 border-foreground/60 mb-4 mx-auto">
                <div className="w-5 h-5 rounded-full border border-foreground/60" />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {view === 'login' ? 'Welcome Back' : 'Join DigitalForge'}
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                {view === 'login' 
                  ? 'Sign in to access your tool workspace' 
                  : 'Create an account to forge your workflow'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-x-0 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/20 transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                  {error}
                </p>
              )}

              {message && (
                <p className="text-xs text-green-400 bg-green-400/10 p-3 rounded-lg border border-green-400/20">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-foreground text-background font-bold py-3.5 rounded-xl hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {view === 'login' ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-sm text-muted-foreground">
                {view === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
                <button
                  onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                  className="text-foreground font-semibold hover:underline underline-offset-4"
                >
                  {view === 'login' ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
