import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

interface SubscriptionUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  onTrialActivated?: () => void;
}

export default function SubscriptionUpgradeModal({
  isOpen,
  onClose,
  courseTitle,
  onTrialActivated,
}: SubscriptionUpgradeModalProps) {
  const { switchRole } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStartTrial = () => {
    // Instantly activates student 3-day free trial
    switchRole("student");
    if (onTrialActivated) {
      onTrialActivated();
    }
    onClose();
  };

  const handleViewPricing = () => {
    onClose();
    navigate("/pricing");
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-3xl bg-[var(--surface)] border border-slate-200 dark:border-slate-800 shadow-2xl p-6 text-[var(--text)] overflow-hidden animate-scale-in"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer text-sm font-bold"
          title="Close modal"
        >
          ✕
        </button>

        {/* Header Icon & Title */}
        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0 text-xl font-black">
            ⚡
          </div>
          <div className="pr-6">
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              Subscription Required
            </span>
            <h3 className="text-lg font-black tracking-tight leading-snug">
              Unlock Astra Pro Access
            </h3>
            <p className="text-xs text-[var(--muted)] mt-1 leading-relaxed">
              To enroll in <strong className="text-[var(--text)]">{courseTitle || "this course"}</strong>, start your 3-day free trial or choose a membership pass.
            </p>
          </div>
        </div>

        {/* Feature Checkmarks */}
        <div className="my-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span className="text-slate-700 dark:text-slate-200">Unlimited access to 50+ engineering masterclasses</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span className="text-slate-700 dark:text-slate-200">620+ Pattern-Wise DSA Sheet with video solutions</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span className="text-slate-700 dark:text-slate-200">Contest Arena & Speed Hackathon XP leaderboards</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-500 font-bold">✓</span>
            <span className="text-slate-700 dark:text-slate-200">Shareable verified completion certificates</span>
          </div>
        </div>

        {/* Primary Action: Free Trial (Instant) */}
        <div className="space-y-2.5 pt-1">
          <button
            onClick={handleStartTrial}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-black text-xs shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start 3-Day Free Trial ($0 Today)</span>
            <span>→</span>
          </button>

          {/* Secondary Action: View Pricing Plans */}
          <button
            onClick={handleViewPricing}
            className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[var(--text)] font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>View All Membership Plans</span>
            <span>↗</span>
          </button>
        </div>

        <p className="text-[10px] text-center text-slate-400 mt-3">
          No credit card required for trial • Cancel anytime with one click
        </p>
      </div>
    </div>
  );
}
