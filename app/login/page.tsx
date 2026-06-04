"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X } from "lucide-react";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("Email is required!");
      return;
    }

    if (!password) {
      setErrorMessage("Password is required!");
      return;
    }

    try {
      setLoading(true);

      const supabase = createClient();

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      const {
        data: { user: loggedInUser },
      } = await supabase.auth.getUser();

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", loggedInUser?.id ?? "")
        .single();

      setSuccessMessage("Login successful! Redirecting...");

      setTimeout(() => {
        if (profile?.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = redirectTo ?? "/my-szn";
        }
      }, 800);
    } catch {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        background: "#1E1E1A",
      }}
    >
      {/* Background */}
      <img
        src="/IMG_9600%201.svg"
        alt="Flowszn yoga background"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center center",
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(30, 30, 26, 0.62)",
          zIndex: 1,
        }}
      />

      {/* Logo atas */}
      <div
        style={{
          position: "absolute",
          top: "34px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
        }}
      >
        <img
          src="/LOGO%20FLOWSZN%20PUTIH.svg"
          alt="Flowszn logo"
          style={{
            width: "78px",
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Login wrapper */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 20px 100px",
        }}
      >
        <div
          className="login-box-wrapper"
          style={{
            position: "relative",
            width: "100%",
            maxWidth: "625px",
          }}
        >
          {/* Close button */}
          <Link
            href="/"
            style={{
              position: "absolute",
              top: "-26px",
              left: "-24px",
              width: "52px",
              height: "52px",
              borderRadius: "999px",
              border: "1.5px solid #F3EEE5",
              background: "#4C4A45",
              color: "#F3EEE5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 5,
              textDecoration: "none",
              boxShadow: "0 6px 16px rgba(0,0,0,0.22)",
            }}
          >
            <X size={25} />
          </Link>

          {/* Login card */}
          <section
            className="login-card"
            style={{
              width: "100%",
              background: "#F3EEE5",
              borderRadius: "18px",
              padding: "56px 64px 70px",
              boxShadow: "0 18px 50px rgba(0,0,0,0.2)",
            }}
          >
            <form onSubmit={handleLogin}>
              {/* Email */}
              <div style={{ marginBottom: "24px" }}>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "18px",
                    color: "#1E1E1A",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Insert your email here"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorMessage("");
                    setSuccessMessage("");
                  }}
                  style={{
                    width: "100%",
                    height: "46px",
                    borderRadius: "10px",
                    border: "1px solid #5F5D58",
                    background: "transparent",
                    padding: "0 14px",
                    outline: "none",
                    fontSize: "18px",
                    color: "#1E1E1A",
                    fontFamily: "var(--font-playfair)",
                  }}
                />
              </div>

              {/* Password */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  htmlFor="password"
                  style={{
                    display: "block",
                    marginBottom: "12px",
                    fontSize: "18px",
                    color: "#1E1E1A",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Password
                </label>

                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    className="password-input"
                    type={showPassword ? "text" : "password"}
                    placeholder="Insert your password here"
                    value={password}
                    onChange={(event) => {
                      setPassword(event.target.value);
                      setErrorMessage("");
                      setSuccessMessage("");
                    }}
                    style={{
                      width: "100%",
                      height: "46px",
                      borderRadius: "10px",
                      border: "1px solid #5F5D58",
                      background: "transparent",
                      padding: "0 48px 0 14px",
                      outline: "none",
                      fontSize: "18px",
                      color: "#1E1E1A",
                      fontFamily: "var(--font-playfair)",
                    }}
                  />

                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      top: "50%",
                      right: "14px",
                      transform: "translateY(-50%)",
                      background: "transparent",
                      border: "none",
                      color: "#4C4A45",
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div
                style={{
                  marginBottom:
                    errorMessage || successMessage ? "18px" : "56px",
                }}
              >
                <Link
                  href="/forgot-password"
                  style={{
                    color: "#1E1E1A",
                    fontSize: "16px",
                    textDecoration: "underline",
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  Forgot password
                </Link>
              </div>

              {/* Message */}
              {errorMessage && (
                <p
                  style={{
                    color: "#D94436",
                    fontSize: "16px",
                    fontFamily: "var(--font-playfair)",
                    marginBottom: "28px",
                  }}
                >
                  {errorMessage}
                </p>
              )}

              {successMessage && (
                <p
                  style={{
                    color: "#4C7A4C",
                    fontSize: "16px",
                    fontFamily: "var(--font-playfair)",
                    marginBottom: "28px",
                  }}
                >
                  {successMessage}
                </p>
              )}

              {/* Register */}
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "10px",
                  color: "#1E1E1A",
                  fontSize: "17px",
                  fontFamily: "var(--font-playfair)",
                }}
              >
                Not a Flowies yet?{" "}
                <Link
                  href="/register"
                  style={{
                    color: "#1E1E1A",
                    textDecoration: "underline",
                  }}
                >
                  Register here
                </Link>
              </p>

              {/* Login button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  height: "48px",
                  borderRadius: "10px",
                  border: "none",
                  background: loading ? "#77746D" : "#4C4A45",
                  color: "#F3EEE5",
                  fontSize: "20px",
                  fontFamily: "var(--font-playfair)",
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                }}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          </section>
        </div>
      </div>

      {/* Tagline bawah */}
      <p
        style={{
          position: "absolute",
          bottom: "58px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 3,
          color: "#F3EEE5",
          fontSize: "18px",
          fontStyle: "italic",
          fontFamily: "var(--font-playfair)",
          whiteSpace: "nowrap",
        }}
      >
        Find your flow, Feel your season
      </p>

      {/* Responsive + hide browser default password eye */}
      <style>
        {`
          .password-input::-ms-reveal,
          .password-input::-ms-clear {
            display: none;
          }

          .password-input::-webkit-credentials-auto-fill-button {
            visibility: hidden;
            display: none !important;
            pointer-events: none;
          }

          @media (max-width: 767px) {
            .login-box-wrapper {
              max-width: 92vw !important;
            }

            .login-card {
              padding: 44px 24px 48px !important;
              border-radius: 18px !important;
            }
          }

          @media (max-width: 480px) {
            .login-card {
              padding: 42px 20px 44px !important;
            }

            .login-box-wrapper a[href="/"] {
              left: -12px !important;
              top: -24px !important;
            }

            main p {
              font-size: 14px !important;
            }
          }
        `}
      </style>
    </main>
  );
}

export default function LoginPageWrapper() {
  return (
    <Suspense>
      <LoginPage />
    </Suspense>
  );
}
