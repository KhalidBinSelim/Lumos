import { type FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api";

type LoginProps = {
  onClose?: () => void;
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

      // Call real API
      console.log('🔐 Attempting login with:', { email: email.trim() });

      const response = await authApi.login({
        email: email.trim(),
        password: password,
      });

      console.log('✅ Login successful! Response:', response);

      // Store token and user data
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('💾 Token and user data saved to localStorage');
      } else {
        console.warn('⚠️ No token in response:', response);
      }

      setFeedbackMessage("Welcome back! Redirecting to your dashboard...");

      // Redirect to /phome after 1 second
      setTimeout(() => {
        navigate("/phome");
      }, 1000);
    } catch (error: any) {
      console.error("❌ Login failed - Full error:", error);
      console.error("Error details:", {
        message: error?.message,
        status: error?.status,
        data: error?.data,
        isNetworkError: error?.isNetworkError,
      });

      let errorMessage = "Invalid email or password. Please try again.";

      if (error?.isNetworkError) {
        errorMessage = "Cannot connect to server. Please make sure the backend is running.";
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.data?.message) {
        errorMessage = error.data.message;
      }

      setFeedbackMessage(errorMessage);
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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  return (
    <div className="relative flex flex-col gap-6 bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-3xl p-8 shadow-2xl max-w-lg w-full">
      <button
        type="button"
        onClick={handleClose}
        className="absolute top-7 right-7 p-1.5 rounded-full bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-primary-500)] transition"
        aria-label="Close login"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>

      <button
        type="button"
        onClick={handleClose}
        className="flex items-center gap-3 text-[var(--color-text-primary)] hover:text-[var(--color-primary-500)] w-fit transition"
        aria-label="Back to landing page"
      >
        <span className="inline-block w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-primary-600)] to-[var(--color-primary-500)] shadow-lg shadow-[var(--color-primary-500)]/20" />
        <span className="text-lg font-bold tracking-tight">Lumos</span>
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Welcome Back</h2>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Sign in to access your scholarship dashboard and continue your
          journey.
        </p>
      </div>

      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-[var(--color-text-secondary)]"
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
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 transition"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-medium text-[var(--color-text-secondary)]"
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
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-3 pr-11 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary-500)] focus:ring-2 focus:ring-[var(--color-primary-500)]/40 transition"
              autoComplete="current-password"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-medium"
          >
            Forgot password?
          </button>
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
              Signing In...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      {feedbackMessage && (
        <div className="rounded-xl border border-[var(--color-primary-500)]/40 bg-[var(--color-primary-500)]/10 px-4 py-3 text-sm text-[var(--color-primary-500)]">
          {feedbackMessage}
        </div>
      )}

      <div className="text-sm text-[var(--color-text-secondary)] text-center">
        Don't have an account?
        <button
          type="button"
          onClick={handleSignUp}
          className="ml-1 text-[var(--color-primary-500)] hover:text-[var(--color-primary-600)] font-semibold"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
