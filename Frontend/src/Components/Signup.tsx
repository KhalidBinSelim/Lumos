import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

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

  const navigate = useNavigate();

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

      // Call real API
      console.log('📝 Attempting registration with:', {
        email: email.trim(),
        fullName: fullName.trim()
      });

      const response = await authApi.register({
        email: email.trim(),
        password: password,
        fullName: fullName.trim(),
      });

      console.log('✅ Registration successful! Response:', response);

      // Store token and user data
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        const userObject = JSON.parse(localStorage.getItem('user') || '{}');
        console.log('💾 Token and user data saved to localStorage',userObject);
      } else {
        console.warn('⚠️ No token in response:', response);
      }

      setFeedbackMessage(
        "Account created successfully! Redirecting to onboarding..."
      );

      // Redirect to onboarding or home after 1 second
      setTimeout(() => {
        navigate("/phome"); // or navigate to onboarding if you have that route
      }, 1000);
    } catch (error: any) {
      console.error("❌ Registration failed - Full error:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        isNetworkError: error?.isNetworkError,
      });

      let errorMessage = "We ran into an issue creating your account. Please try again.";

      if (error?.isNetworkError) {
        errorMessage = "Cannot connect to server. Please make sure the backend is running.";
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      } else if (error?.data?.errors && Array.isArray(error.data.errors)) {
        // Handle validation errors from backend
        const validationErrors = error.data.errors.map((err: any) => err.msg || err.message).join(', ');
        errorMessage = validationErrors || errorMessage;
      }

      setFeedbackMessage(errorMessage);
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
    <div className="relative flex flex-col gap-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl max-w-lg w-full">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-7 right-7 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition"
        aria-label="Close signup"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>

      <button
        type="button"
        onClick={onClose}
        className="flex items-center gap-3 text-[var(--color-text-primary)] hover:text-[var(--color-primary-500)] w-fit transition"
        aria-label="Back to landing page"
      >
        <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-primary-500)] shadow-lg shadow-[var(--color-primary-500)]/20" />
        <span className="text-lg font-bold tracking-tight">Lumos</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">
          Create Your Free Account
        </h2>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Unlock personalized scholarship matches, AI application help, and
          deadline tracking.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-[var(--color-text-secondary)]"
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
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 transition"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-[var(--color-text-secondary)]"
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
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 transition"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-[var(--color-text-secondary)]"
            htmlFor="signup-password"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="signup-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 8 characters"
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 pr-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 transition"
              autoComplete="new-password"
            />
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Use 8+ characters with a mix of letters, numbers, or symbols for a
            stronger password.
          </p>
        </div>

        <div>
          <label className="flex items-start gap-3 text-sm text-[var(--color-text-secondary)]">
            <input
              type="checkbox"
              checked={agreeToTerms}
              onChange={(event) => setAgreeToTerms(event.target.checked)}
              className="mt-3 h-4 w-4 rounded border-[var(--color-border)] bg-[var(--color-bg-primary)] text-[var(--color-primary-500)] focus:ring-[var(--color-primary-500)]/60"
            />
            <span>
              I agree to the{" "}
              <button
                type="button"
                className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] underline"
                onClick={() => console.info("View Terms of Service")}
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] underline"
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
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[var(--color-primary-600)] to-[var(--color-primary-500)] px-6 py-3 text-white font-semibold shadow-lg shadow-[var(--color-primary-500)]/20 transition disabled:cursor-not-allowed disabled:opacity-50 hover:enabled:scale-[1.02]"
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
        <div className="rounded-xl border border-[var(--color-primary-500)]/40 bg-[var(--color-primary-500)]/10 px-4 py-3 text-sm text-[var(--color-primary-500)]">
          {feedbackMessage}
        </div>
      )}

      <div className="text-sm text-[var(--color-text-secondary)] text-center">
        Already have an account?
        <button
          type="button"
          onClick={handleSignIn}
          className="ml-1 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-semibold"
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
