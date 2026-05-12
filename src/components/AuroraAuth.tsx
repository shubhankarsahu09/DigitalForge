import React, { useState } from "react";
import { motion } from "motion/react";
import { Chrome, Github, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";

// --- Types ---
interface StepItemProps {
  number: number;
  text: string;
  active?: boolean;
}

interface SocialButtonProps {
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}

interface InputGroupProps {
  label: string;
  placeholder: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

// --- Sub-components ---
const StepItem = ({ number, text, active }: StepItemProps) => (
  <div
    className={cn(
      "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
      active 
        ? "bg-foreground text-background shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
        : "liquid-glass text-muted-foreground opacity-60 hover:opacity-80"
    )}
  >
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
        active ? "bg-black text-white" : "bg-white/10 text-white/40"
      )}
    >
      {number}
    </div>
    <span className="text-sm font-medium tracking-tight">{text}</span>
  </div>
);

const SocialButton = ({ icon: Icon, label, onClick }: SocialButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center gap-3 liquid-glass rounded-xl py-3.5 hover:bg-white/5 transition-all active:scale-[0.98] group cursor-pointer pointer-events-auto relative z-[110]"
  >
    <Icon size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">{label}</span>
  </button>
);

const InputGroup = ({ label, placeholder, type, value, onChange, required }: InputGroupProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const id = React.useId();

  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="text-sm font-medium text-muted-foreground ml-1">{label}</label>
      <div className="relative group">
        <input
          id={id}
          name={label.toLowerCase().replace(/\s+/g, '_')}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          required={required}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-black/40 border border-white/10 rounded-xl h-12 px-4 text-foreground placeholder:text-white/20 focus:outline-none focus:ring-4 focus:ring-white/5 focus:border-white transition-all shadow-xl backdrop-blur-sm"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

// --- Main Component ---
export default function AuroraAuth({ 
  onClose, 
  initialView = "signup" 
}: { 
  onClose: () => void, 
  initialView?: "login" | "signup" | "forgot-password" | "update-password"
}) {
  const [view, setView] = useState<"login" | "signup" | "forgot-password" | "update-password">(initialView);

  // Sync internal view with initialView prop whenever it changes
  React.useEffect(() => {
    setView(initialView);
  }, [initialView]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (view === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
          },
        });
        if (signUpError) throw signUpError;
        setMessage("Registration successful! Please check your email for a confirmation link.");
      } else if (view === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (signInError) throw signInError;
        onClose();
      } else if (view === "forgot-password") {
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(formData.email, {
          redirectTo: `${window.location.origin}/dashboard`,
        });
        if (resetError) throw resetError;
        setMessage("Password reset link has been sent to your email.");
      } else if (view === "update-password") {
        const { error: updateError } = await supabase.auth.updateUser({
          password: formData.password,
        });
        if (updateError) throw updateError;
        setMessage("Password updated successfully! Redirecting...");
        setTimeout(() => onClose(), 2000);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <main className="flex min-h-screen w-full bg-black selection:bg-white/30 p-2 lg:h-screen lg:overflow-hidden lg:p-4 transition-all duration-500">
        
        {/* Left Column (Hero) */}
        <section className="relative hidden lg:flex w-[52%] flex-col items-center justify-end pb-32 px-12 rounded-3xl overflow-hidden shadow-2xl h-full border border-white/5">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover brightness-90"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260506_081238_406ed0e3-5d83-436e-a512-0bbff7ec5b95.mp4"
              type="video/mp4"
            />
          </video>
          
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
            className="relative z-10 w-full max-w-xs space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-white">
                <div className="w-3 h-3 rounded-full border border-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">DigitalForge</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-medium tracking-tight whitespace-nowrap text-white">
                {view === "signup" ? "Join DigitalForge" : view === "login" ? "Welcome Back" : view === "forgot-password" ? "Reset Access" : "New Password"}
              </h1>
              <p className="text-white/60 text-sm leading-relaxed">
                {view === "signup" 
                  ? "Follow these 3 quick phases to activate your space." 
                  : view === "login"
                  ? "Sign in to continue your journey into distilled knowledge."
                  : view === "forgot-password"
                  ? "We'll send you a secure link to regain access to your library."
                  : "Almost there! Choose a strong new password for your account."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <StepItem number={1} text="Register your identity" active={view === "signup"} />
              <StepItem number={2} text="Configure your studio" />
              <StepItem number={3} text="Finalize your profile" />
            </motion.div>
          </motion.div>
        </section>

        {/* Right Column (Form) */}
        <section className="flex-1 flex flex-col items-center justify-center py-12 lg:py-6 px-4 sm:px-12 lg:px-16 xl:px-24 overflow-y-auto lg:overflow-hidden bg-black">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-xl space-y-8 lg:space-y-6 sm:space-y-10"
          >
            {/* Header */}
            <div className="space-y-2">
              <h2 className="text-3xl font-medium tracking-tight text-foreground">
                {view === "signup" ? "Create New Profile" : view === "login" ? "Login to Profile" : view === "forgot-password" ? "Reset Password" : "Update Password"}
              </h2>
              <p className="text-muted-foreground text-sm">
                {view === "signup" 
                  ? "Input your basic details to begin the journey." 
                  : view === "login"
                  ? "Enter your credentials to access your library."
                  : view === "forgot-password"
                  ? "Enter your email to receive a password recovery link."
                  : "Create a new secure password for your account."}
              </p>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <SocialButton 
                icon={Chrome} 
                label="Google" 
                onClick={() => handleSocialLogin('google')} 
              />
              <SocialButton 
                icon={Github} 
                label="Github" 
                onClick={() => handleSocialLogin('github')} 
              />
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative bg-black px-4 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {view === "forgot-password" ? "Security Verification" : view === "update-password" ? "New Credentials" : "Or"}
              </span>
            </div>

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-5 lg:space-y-4">
              {view === "signup" && (
                <div className="grid grid-cols-2 gap-4">
                  <InputGroup
                    label="First Name"
                    placeholder="John"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <InputGroup
                    label="Last Name"
                    placeholder="Doe"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
              )}
              
              {view !== "forgot-password" && view !== "update-password" && (
                <InputGroup
                  label="Email Address"
                  placeholder="name@example.com"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              )}

              {view !== "forgot-password" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <InputGroup
                      label="Password"
                      placeholder="••••••••"
                      type={view === "update-password" ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[10px] text-muted-foreground/60 italic tracking-wide">
                      Requires at least 8 symbols.
                    </p>
                    {view === "login" && (
                      <button
                        type="button"
                        onClick={() => setView("forgot-password")}
                        className="text-[10px] text-foreground/40 hover:text-foreground font-medium transition-colors"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                </div>
              )}

              {error && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-red-400 bg-red-400/10 p-4 rounded-xl border border-red-400/20"
                >
                  {error}
                </motion.p>
              )}

              {message && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20"
                >
                  {message}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-foreground text-background font-bold rounded-xl hover:bg-foreground/90 active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.05)]"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    {view === "signup" ? "Create Account" : view === "login" ? "Log In" : view === "forgot-password" ? "Send Reset Link" : "Update Password"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            {view !== "update-password" && (
              <p className="text-center text-sm text-muted-foreground">
                {view === "signup" ? "Member of the team?" : view === "login" ? "New to DigitalForge?" : "Remember your password?"}{" "}
                <button
                  type="button"
                  onClick={() => setView(view === "signup" ? "login" : "signup")}
                  className="text-foreground font-medium hover:underline underline-offset-4"
                >
                  {view === "signup" ? "Log in" : view === "login" ? "Sign up" : "Back to login"}
                </button>
              </p>
            )}
          </motion.div>
        </section>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 z-[110] text-muted-foreground/30 hover:text-foreground transition-colors"
        >
          <X size={24} />
        </button>
      </main>
    </div>
  );
}

const X = ({ size, className }: { size: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
