import { type FormEvent, useMemo, useState } from "react";

type SignupProps = {
  onClose: () => void;
  onSignIn?: () => void;
};

export default function Signup({ onClose, onSignIn }: SignupProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const isFormValid = useMemo(() => {
    return (
      fullName.trim().length > 1 &&
      /.+@.+\..+/.test(email.trim()) &&
      password.length >= 8 &&
      agreeToTerms
    );
  }, [fullName, email, password, agreeToTerms]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setFeedbackMessage(null);

      // Placeholder for actual API call
      await new Promise((resolve) => setTimeout(resolve, 900));

      setFeedbackMessage(
        "Almost there! Check your email to verify your account."
      );
    } catch (error) {
      console.error("Signup failed", error);
      setFeedbackMessage(
        "We ran into an issue creating your account. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignIn = () => {
    if (onSignIn) {
      onSignIn();
      return;
    }
    console.info("Redirect to sign in");
  };

  return (
    <div className="relative flex flex-col gap-6 bg-slate-900/80 border border-slate-700 rounded-3xl p-8 shadow-[0_40px_120px_-30px_rgba(37,99,235,0.55)] max-w-lg w-full">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-7 right-7 p-1.5 rounded-full bg-slate-800/60 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:bg-slate-700/60 transition"
        aria-label="Close signup"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-3 text-slate-200 hover:text-white w-fit transition"
        aria-label="Back to landing page"
      >
        <span className="inline-block w-6 h-6 rounded-full bg-linear-to-tr from-blue-500 to-indigo-500 shadow-lg" />
        <span className="text-lg font-bold tracking-tight">Lumos</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">
          Create Your Free Account
        </h2>
        <p className="text-slate-400 text-sm">
          Unlock personalized scholarship matches, AI application help, and
          deadline tracking.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-300"
            htmlFor="signup-fullname"
          >
            Full Name
          </label>
          <input
            id="signup-fullname"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Your Name"
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-slate-300"
            htmlFor="signup-email"
          >
            Email
          </label>
          <input
            id="signup-email"
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
            htmlFor="signup-password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              // type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 pr-11 text-slate-100 placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition"
              autoComplete="new-password"
            />
            {/* <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center justify-center text-slate-400 hover:text-slate-100 transition"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <span className="material-symbols-outlined text-sm">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button> */}
          </div>
          <p className="text-xs text-slate-500">
            Use 8+ characters with a mix of letters, numbers, or symbols for a
            stronger password.
          </p>
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(event) => setAgreeToTerms(event.target.checked)}
              className="mt-3 h-4 w-4 rounded border-slate-600 bg-slate-900/60 text-blue-500 focus:ring-blue-500/60"
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 underline"
                onClick={() => console.info("View Terms of Service")}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-400 hover:text-blue-300 underline"
                onClick={() => console.info("View Privacy Policy")}
              >
                Privacy Policy
              </button>
            </span>
          </label>
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
              Creating Account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      {feedbackMessage && (
        <div className="rounded-xl border border-blue-700/40 bg-blue-900/10 px-4 py-3 text-sm text-blue-200">
          {feedbackMessage}
        </div>
      )}

      <div className="text-sm text-slate-400 text-center">
        Already have an account?
        <button
          type="button"
          onClick={handleSignIn}
          className="ml-1 text-blue-400 hover:text-blue-300 font-semibold"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
