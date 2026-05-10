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
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden border border-black/5 text-[#1d1d1f]"
          >
            {/* Header */}
            <div className="p-8 border-b border-black/5 flex items-center justify-between bg-[#fbfbfd]">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-lg shadow-black/10">
                  {step === "verify" ? <Lock size={22} /> : <User size={22} />}
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-[#1d1d1f]">
                    {step === "verify" ? "Identity Check" : "Profile Settings"}
                  </h2>
                  <p className="text-[10px] font-bold text-black/50 uppercase tracking-[0.2em] mt-0.5">
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
                className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-black/40 hover:text-black transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {step === "verify" ? (
                <form onSubmit={handleVerify} className="space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-[#424245] font-medium leading-relaxed mb-6">
                      For your security, please verify your current password before managing your account.
                    </p>
                    <label className="text-[11px] font-bold text-black/60 uppercase tracking-widest ml-1">
                      Current Password
                    </label>
                    <div className="relative group">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
                      <input
                        type="password"
                        required
                        autoFocus
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all placeholder:text-black/20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] flex items-center gap-3"
                    >
                      <X size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-black/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50"
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
                      <label className="text-[11px] font-bold text-black/60 uppercase tracking-widest ml-1">
                        New Display Name
                      </label>
                      <div className="relative group">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all placeholder:text-black/20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-3">
                      <label className="text-[11px] font-bold text-black/60 uppercase tracking-widest ml-1">
                        New Password
                      </label>
                      <div className="relative group">
                        <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" />
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="•••••••• (Optional)"
                          className="w-full bg-white border border-black/10 rounded-2xl py-4 pl-12 pr-6 text-sm text-[#1d1d1f] focus:outline-none focus:ring-4 focus:ring-black/5 focus:border-black transition-all placeholder:text-black/20 shadow-[0_2px_4px_rgba(0,0,0,0.02)]"
                        />
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-[13px] flex items-center gap-3"
                    >
                      <X size={16} className="shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  {message && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-2xl bg-green-50 border border-green-100 text-green-600 text-[13px] flex items-center gap-3"
                    >
                      <Check size={16} className="shrink-0" />
                      {message}
                    </motion.div>
                  )}

                  <div className="pt-4 flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 bg-black text-white font-bold py-4 rounded-2xl hover:bg-black/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group shadow-xl shadow-black/10 disabled:opacity-50"
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
                      className="px-8 bg-black/5 text-black/60 font-semibold py-4 rounded-2xl hover:bg-black/10 active:scale-[0.98] transition-all text-sm"
                    >
                      Back
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Footer */}
            <div className="px-8 py-6 bg-[#fbfbfd] border-t border-black/5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">
                {user?.email}
              </span>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                <span className="text-[10px] font-bold text-black/40 uppercase tracking-[0.2em]">
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
