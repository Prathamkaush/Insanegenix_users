"use client";

import { FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import {
  getGoogleAuthUrl,
  loginCustomer,
  registerCustomer,
  requestPasswordReset,
  resetCustomerPassword,
  storeCustomerSession,
  verifyPasswordResetCode,
} from "@/lib/auth";
import { AuthMode } from "@/lib/auth-modal";
import { syncGuestCartToServer } from "@/lib/cart";

type AuthView = AuthMode | "forgot-email" | "forgot-code" | "forgot-reset";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthView>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ mode?: AuthMode }>).detail;
      setMode(detail?.mode || "login");
      setOpen(true);
      setMessage("");
    };

    window.addEventListener("auth:open", onOpen);
    return () => window.removeEventListener("auth:open", onOpen);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("ig-auth-lock", open);
    return () => document.body.classList.remove("ig-auth-lock");
  }, [open]);

  const close = () => {
    setOpen(false);
    // Reset form fields when closing
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setRegisterEmail("");
    setPassword("");
    setRegisterPassword("");
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowRegisterPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setMessage("");
  };

  const handleModeChange = (newMode: AuthView) => {
    setMode(newMode);
    setShowPassword(false);
    setShowRegisterPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setMessage(""); // Clear messages when switching modes
  };

  const continueWithGoogle = () => {
    setLoading(true);
    setMessage("");
    window.location.href = getGoogleAuthUrl();
  };

  const submitLogin = async (event: FormEvent) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setMessage("Email and password are required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const data = await loginCustomer(trimmedEmail, trimmedPassword);
      storeCustomerSession(data);
      await syncGuestCartToServer();
      resetForm();
      close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const submitRegister = async (event: FormEvent) => {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = registerEmail.trim();
    const cleanPassword = registerPassword.trim();

    // Validate all fields are filled
    if (!cleanName || !cleanEmail || !cleanPassword) {
      setMessage("Name, email and password are required");
      return;
    }

    if (cleanPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const data = await registerCustomer(cleanName, cleanEmail, cleanPassword);
      storeCustomerSession(data);
      await syncGuestCartToServer();
      resetForm();
      close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const submitForgotEmail = async (event: FormEvent) => {
    event.preventDefault();
    await sendResetCode();
  };

  const sendResetCode = async () => {
    const cleanEmail = forgotEmail.trim();

    if (!cleanEmail) {
      setMessage("Email is required");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const data = await requestPasswordReset(cleanEmail);
      setMode("forgot-code");
      setMessage(data.message || "If this email is registered, we sent a password reset code.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const submitResetCode = async (event: FormEvent) => {
    event.preventDefault();
    const cleanCode = resetCode.trim();

    if (!/^\d{6}$/.test(cleanCode)) {
      setMessage("Enter the 6 digit reset code");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      await verifyPasswordResetCode(forgotEmail, cleanCode);
      setMode("forgot-reset");
      setMessage("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Invalid reset code");
    } finally {
      setLoading(false);
    }
  };

  const submitNewPassword = async (event: FormEvent) => {
    event.preventDefault();

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const data = await resetCustomerPassword(forgotEmail, resetCode, newPassword);
      resetForm();
      setMode("login");
      setEmail(forgotEmail);
      setMessage(data.message || "Password reset successfully. Please login with your new password.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="ig-auth-modal" role="dialog" aria-modal="true" aria-label="Customer authentication">
      <button type="button" className="ig-auth-modal__backdrop" aria-label="Close authentication modal" onClick={close} />
      <div className="ig-auth-modal__panel">
        <button type="button" className="ig-auth-modal__close" onClick={close} aria-label="Close">
          <X size={20} />
        </button>

        <div className="ig-auth-tabs" role="tablist">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => handleModeChange("login")}>
            Login
          </button>
          <button type="button" className={mode === "register" ? "active" : ""} onClick={() => handleModeChange("register")}>
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="ig-auth-form" onSubmit={submitLogin}>
            <h3>Customer Login</h3>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" placeholder="Email address" required />
            <div className="ig-auth-password-field">
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {message ? <p className="ig-auth-message">{message}</p> : null}
            <button className="ig-auth-forgot-link" type="button" onClick={() => {
              setForgotEmail(email);
              handleModeChange("forgot-email");
            }}>
              Forgot password?
            </button>
            <button className="eg-btn" type="submit" disabled={loading}>
              <span>{loading ? "Logging in..." : "Login"}</span>
            </button>
            <div className="ig-auth-divider">
              <span>or</span>
            </div>
            <button className="ig-google-auth-btn" type="button" onClick={continueWithGoogle} disabled={loading}>
              <img src="/assets/img/icon/login/google.svg" alt="" />
              <span>Continue with Google</span>
            </button>
            <p>
              New here? <button type="button" onClick={() => handleModeChange("register")}>Create an account</button>
            </p>
          </form>
        ) : mode === "register" ? (
          <form className="ig-auth-form" onSubmit={submitRegister}>
            <h3>Create Account</h3>
            <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full name" required />
            <input value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} type="email" placeholder="Email address" required />
            <div className="ig-auth-password-field">
              <input
                value={registerPassword}
                onChange={(event) => setRegisterPassword(event.target.value)}
                type={showRegisterPassword ? "text" : "password"}
                placeholder="Password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowRegisterPassword((value) => !value)}
                aria-label={showRegisterPassword ? "Hide password" : "Show password"}
              >
                {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {message ? <p className="ig-auth-message">{message}</p> : null}
            <button className="eg-btn" type="submit" disabled={loading}>
              <span>{loading ? "Creating..." : "Register"}</span>
            </button>
            <div className="ig-auth-divider">
              <span>or</span>
            </div>
            <button className="ig-google-auth-btn" type="button" onClick={continueWithGoogle} disabled={loading}>
              <img src="/assets/img/icon/login/google.svg" alt="" />
              <span>Continue with Google</span>
            </button>
            <p>
              Already registered? <button type="button" onClick={() => handleModeChange("login")}>Login</button>
            </p>
          </form>
        ) : mode === "forgot-email" ? (
          <form className="ig-auth-form" onSubmit={submitForgotEmail}>
            <h3>Reset Password</h3>
            <p className="ig-auth-help">Enter your account email and we will send a 6 digit verification code.</p>
            <input value={forgotEmail} onChange={(event) => setForgotEmail(event.target.value)} type="email" placeholder="Email address" required />
            {message ? <p className="ig-auth-message">{message}</p> : null}
            <button className="eg-btn" type="submit" disabled={loading}>
              <span>{loading ? "Sending..." : "Send Code"}</span>
            </button>
            <p>
              Remembered it? <button type="button" onClick={() => handleModeChange("login")}>Login</button>
            </p>
          </form>
        ) : mode === "forgot-code" ? (
          <form className="ig-auth-form" onSubmit={submitResetCode}>
            <h3>Verify Code</h3>
            <p className="ig-auth-help">Enter the 6 digit code sent to {forgotEmail || "your email"}.</p>
            <input
              value={resetCode}
              onChange={(event) => setResetCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
              type="text"
              inputMode="numeric"
              placeholder="Verification code"
              required
            />
            {message ? <p className="ig-auth-message">{message}</p> : null}
            <button className="eg-btn" type="submit" disabled={loading}>
              <span>{loading ? "Verifying..." : "Verify Code"}</span>
            </button>
            <p>
              Did not get it? <button type="button" onClick={sendResetCode}>Resend code</button>
            </p>
          </form>
        ) : (
          <form className="ig-auth-form" onSubmit={submitNewPassword}>
            <h3>New Password</h3>
            <div className="ig-auth-password-field">
              <input
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                type={showNewPassword ? "text" : "password"}
                placeholder="New password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword((value) => !value)}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="ig-auth-password-field">
              <input
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {message ? <p className="ig-auth-message">{message}</p> : null}
            <button className="eg-btn" type="submit" disabled={loading}>
              <span>{loading ? "Resetting..." : "Reset Password"}</span>
            </button>
            <p>
              Back to <button type="button" onClick={() => handleModeChange("login")}>Login</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
