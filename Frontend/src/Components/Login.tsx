import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

type LoginProps = {
  onClose: () => void;
  onSignUp?: () => void;
};

export default function Login({ onClose, onSignUp }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const isFormValid = useMemo(() => {
    return /.+@.+\..+/.test(email.trim()) && password.length >= 8;
  }, [email, password]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFeedbackMessage(null);

      // Simulate async API call
      await new Promise((resolve) => setTimeout(resolve, 900));

      setFeedbackMessage("Welcome back! Redirecting to your dashboard...");

      // Redirect to /phome after 1 second
      setTimeout(() => {
        navigate("/phome");
      }, 1000);
    } catch (error) {
      console.error("Login failed", error);
      setFeedbackMessage("Invalid email or password. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = () => {
    if (onSignUp) {
      onSignUp();
      return;
    }
    console.info("Redirect to sign up");
  };

  const handleForgotPassword = () => {
    console.info("Redirect to forgot password");
  };

  return (
    <div className="relative flex flex-col gap-6 bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-[0_40px_120px_-30px_rgba(37,99,235,0.55)] max-w-lg w-full">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-7 right-7 p-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition"
        aria-label="Close login"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-3 text-slate-200 hover:text-white w-fit transition"
        aria-label="Back to landing page"
      >
        <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg" />
        <span className="text-lg font-bold tracking-tight">Lumos</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
        <p className="text-slate-400 text-sm">
          Sign in to access your scholarship dashboard and continue your
          journey.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-300"
            htmlFor="login-email"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@email.com"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-300"
            htmlFor="login-password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 pr-11 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-blue-400 hover:text-blue-300 font-medium"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={!isFormValid || isSubmitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 px-6 py-3 text-white font-semibold shadow-lg shadow-blue-900/40 transition disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-[1.02]"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin text-lg">
                progress_activity
              </span>
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {feedbackMessage && (
        <div className="rounded-xl border border-blue-700/40 bg-blue-900/10 px-4 py-3 text-sm text-blue-200">
          {feedbackMessage}
        </div>
      )}

      <div className="text-sm text-slate-400 text-center">
        Don't have an account?
        <button
          type="button"
          onClick={handleSignUp}
          className="ml-1 text-blue-400 hover:text-blue-300 font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
