import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  X, 
  ShieldCheck, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CmsUser } from '../../types/cms';
import { AuthService } from '../../services/authService';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: CmsUser) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Reset all fields whenever the login dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setPassword('');
      setErrorMessage('');
      setShowPassword(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await AuthService.authenticate(email, password);
      if (res.success && res.user) {
        onLoginSuccess(res.user);
        setEmail('');
        setPassword('');
      } else {
        setErrorMessage(res.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'A security connection error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#090D16] text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden animate-scaleIn relative border-t-2 border-t-amber-400"
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-10 cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Branding */}
        <div className="bg-gradient-to-b from-emerald-950/50 via-slate-900/50 to-transparent p-7 text-center space-y-3 border-b border-slate-800/80">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-900/90 to-[#090D16] border-2 border-amber-400/60 shadow-xl mx-auto flex items-center justify-center text-amber-300">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-slate-900 border border-emerald-500/30 text-[10px] font-bold text-amber-300 uppercase tracking-widest mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Restricted Editorial Access</span>
            </div>
            <h3 className="font-serif font-extrabold text-2xl text-white tracking-tight">
              Editorial CMS Portal
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Voice of Sufism Digital Archives & Heritage Suite
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-semibold flex items-start space-x-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">{errorMessage}</div>
            </div>
          )}

          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Registered Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                required
                autoComplete="off"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter your registered email"
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#131926] text-white border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-xs font-medium placeholder-slate-500"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorMessage('');
                }}
                placeholder="Enter your password"
                className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#131926] text-white border border-slate-700/80 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-xs font-medium placeholder-slate-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-amber-300 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl flex items-center justify-center space-x-2 transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          {/* Footer Security Guarantee */}
          <div className="pt-3 border-t border-slate-800/80 text-center">
            <p className="text-[10px] text-slate-400 flex items-center justify-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 inline" />
              <span>Protected by SHA-256 Cryptographic Authentication</span>
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
