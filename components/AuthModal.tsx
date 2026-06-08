"use client";

import { FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { getGoogleAuthUrl, loginCustomer, registerCustomer, storeCustomerSession } from "@/lib/auth";
import { AuthMode } from "@/lib/auth-modal";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
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
    setMessage("");
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
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
      resetForm();
      close();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
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
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" placeholder="Password" required />
            {message ? <p className="ig-auth-message">{message}</p> : null}
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
        ) : (
          <form className="ig-auth-form" onSubmit={submitRegister}>
            <h3>Create Account</h3>
            <input value={name} onChange={(event) => setName(event.target.value)} type="text" placeholder="Full name" required />
            <input value={registerEmail} onChange={(event) => setRegisterEmail(event.target.value)} type="email" placeholder="Email address" required />
            <input value={registerPassword} onChange={(event) => setRegisterPassword(event.target.value)} type="password" placeholder="Password" required minLength={6} />
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
        )}
      </div>
    </div>
  );
}
