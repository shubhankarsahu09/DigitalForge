import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Lock, Loader2, Check, ArrowRight } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const [step, setStep] = useState<"verify" | "settings">("verify");
  const [currentPassword, setCurrentPassword] = useState("");
  const [displayName, setDisplayName] = useState(user?.user_metadata?.first_name || "");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email!,
        password: currentPassword,
      });

      if (signInError) {
        throw new Error("Incorrect current password. Please try again.");
      }

      setStep("settings");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      // 1. Update Display Name (Metadata)
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { first_name: displayName }
      });
      if (metadataError) throw metadataError;

      // 2. Update Password if provided
      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password must be at least 6 characters");
        const { error: passwordError } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (passwordError) throw passwordError;
      }

      setMessage("Profile updated successfully!");
      setNewPassword("");
      setTimeout(() => {
        setMessage(null);
        window.location.reload(); // Refresh to sync all UI components
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              onClose();
              setStep("verify");
              setCurrentPassword("");
            }}
            className="absolute inset-0 bg-black/40 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-zinc-950 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-white/10 text-white"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-white shadow-lg shadow-black/50">
                  {step === "verify" ? <Lock size={22} /> : <User size={22} />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    {step === "verify" ? "Identity Check" : "Profile Settings"}
                  </h2>
                  <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] mt-0.5">
                    {step === "verify" ? "Security Required" : "Update Identity"}
                  </p>
                </div>
              </div>
                <button
                onClick={() => {
                  onClose();
                  setStep("verify");
                  setCurrentPassword("");
                }}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === "verify" ? (
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-white/60 font-medium leading-relaxed mb-6">
                      For your security, please verify your current password before managing your account.
                    </p>
                    <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                      Current Password
                    </label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                        <input
                        type="password"
                        required
                        autoFocus
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder:text-white/30"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-3"
                    >
                      <X size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        Verify Account
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-6">
                    {/* Display Name */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                        New Display Name
                      </label>
                      <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-white/60 uppercase tracking-widest ml-1">
                        New Password
                      </label>
                      <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-white transition-colors" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="•••••••• (Optional)"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-white/30 transition-all placeholder:text-white/30"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] flex items-center gap-3"
                    >
                      <X size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[13px] flex items-center gap-3"
                    >
                      <Check size={16} className="shrink-0" />
                      {message}
                    </motion.div>
                  )}

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-white text-black font-bold py-4 rounded-2xl hover:bg-white/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(255,255,255,0.1)] disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" size={20} />
                      ) : (
                        <>
                          Apply Changes
                          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStep("verify");
                        setCurrentPassword("");
                      }}
                      className="px-8 bg-white/5 text-white/60 font-semibold py-4 rounded-2xl hover:bg-white/10 hover:text-white active:scale-[0.98] transition-all text-sm"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-white/5 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                {user?.email}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
                  Encrypted
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
