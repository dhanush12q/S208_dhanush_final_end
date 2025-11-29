import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

/* ---------- validators ---------- */
function hasUpper(s) { return /[A-Z]/.test(s); }
function hasLower(s) { return /[a-z]/.test(s); }
function hasNumber(s) { return /[0-9]/.test(s); }
function hasSymbol(s) { return /[\W_]/.test(s); }
function isMinLen(s) { return (s || "").length >= 10; }
function isAlphaOnly(s) { return /^[A-Za-z]{1,20}$/.test(s); }

/**
 * Returns true if email is allowed:
 * - exactly gmail.com OR
 * - any domain that is not in the disallowed free-mail list
 */
function isProfessionalOrGmail(rawEmail) {
  if (!rawEmail || typeof rawEmail !== "string") return false;
  const email = rawEmail.trim().toLowerCase();
  // basic email format check
  const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basicEmailRegex.test(email)) return false;

  const domain = email.split("@")[1];
  if (!domain) return false;

  if (domain === "gmail.com") return true;

  // common free email providers we disallow as "professional"
  const disallowed = [
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "rediffmail.com",
    "protonmail.com",
    "icloud.com",
    "mail.com",
    "yandex.com",
    "gmx.com"
  ];

  return !disallowed.includes(domain);
}

/* ---------- component ---------- */
export default function Registration() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [success, setSuccess] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const openSnackbar = (msg, duration = 3000) => {
    setSnackbarMessage(msg);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), duration);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      openSnackbar("Please fill all fields!", 3000);
      return;
    }
    if (!isAlphaOnly(form.name)) {
      openSnackbar("Name must be alphabets only and max 20 letters!", 3000);
      return;
    }

    if (!isProfessionalOrGmail(form.email)) {
      openSnackbar("Only Gmail or professional email allowed!", 3500);
      return;
    }

    if (!isMinLen(form.password) || !hasUpper(form.password) || !hasLower(form.password) || !hasNumber(form.password) || !hasSymbol(form.password)) {
      openSnackbar("Password does not meet the requirements.", 3500);
      return;
    }
    if (form.role !== "student") {
      openSnackbar("Only 'Student' role can register.", 3000);
      return;
    }

    // success (replace with real signup action)
    setSuccess(true);
    openSnackbar("Registration Successful!", 2200);
  };

  const handleNext = () => navigate("/login");

  // password rule flags
  const pwd = form.password || "";
  const rules = [
    { id: "len", ok: isMinLen(pwd), label: "≥10 chars" },
    { id: "upper", ok: hasUpper(pwd), label: "Uppercase" },
    { id: "lower", ok: hasLower(pwd), label: "Lowercase" },
    { id: "number", ok: hasNumber(pwd), label: "Number" },
    { id: "symbol", ok: hasSymbol(pwd), label: "Symbol" },
  ];

  const inlineHelper = rules.map(r => `${r.ok ? "✔" : "✖"} ${r.label}`).join("  •  ");

  return (
    <div className="register-bg">
      <main className="main-container">
        <form
          className="registration-form table-form"
          onSubmit={handleSubmit}
          autoComplete="off"
          aria-label="Create student account"
        >
          <h2><span className="icon">📝</span> Create Student Account</h2>

          <table className="form-table" role="presentation">
            <tbody>
              <tr>
                <th><label htmlFor="name">Username</label></th>
                <td>
                  <input
                    id="name"
                    type="text"
                    required
                    maxLength={20}
                    value={form.name}
                    onChange={handleChange}
                    pattern="[A-Za-z]{1,20}"
                    autoComplete="off"
                    placeholder="Alphabets only"
                    title="Alphabets only, max 20 letters"
                    disabled={success}
                  />
                </td>
              </tr>

              <tr>
                <th><label htmlFor="email">Email</label></th>
                <td>
                  <input
                    id="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="student@company.com or student@gmail.com"
                    autoComplete="off"
                    disabled={success}
                  />
                </td>
              </tr>

              <tr>
                <th><label htmlFor="password">Password</label></th>
                <td>
                  <input
                    id="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    minLength={10}
                    placeholder="Enter a strong password"
                    title="At least 10 characters, upper, lower, number & symbol"
                    autoComplete="new-password"
                    disabled={success}
                    aria-describedby="pwd-inline"
                  />

                  <div id="pwd-inline" className="pwd-inline" aria-live="polite">
                    {inlineHelper}
                  </div>
                </td>
              </tr>

              <tr>
                <th><label htmlFor="role">Register as</label></th>
                <td>
                  <select id="role" required value={form.role} onChange={handleChange} disabled>
                    <option value="student">Student</option>
                  </select>
                </td>
              </tr>

              <tr>
                <th />
                <td className="actions-td">
                  {!success ? (
                    <button type="submit" className="btn primary-btn">Sign Up</button>
                  ) : (
                    <>
                      <span className="success-message">Signup Successful!</span>
                      <button type="button" onClick={handleNext} className="btn next-btn">Next</button>
                    </>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </form>

        <div id="snackbar" className={showSnackbar ? "show" : ""} role="status" aria-live="polite">
          {snackbarMessage}
        </div>
      </main>
    </div>
  );
}
