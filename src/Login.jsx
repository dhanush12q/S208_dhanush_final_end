import React, { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // strong password validation
  const isStrongPassword = (str) => {
    return (
      str.length >= 10 &&
      /[A-Z]/.test(str) &&
      /[a-z]/.test(str) &&
      /[0-9]/.test(str) &&
      /[\W_]/.test(str)
    );
  };

  // email validation for students
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = () => {
    setError("");

    if (!role || !username || !password) {
      setError("Please fill all fields.");
      return;
    }

    // ADMIN LOGIN LOCKED (strict check)
    if (role === "admin") {
      if (username !== "dhanush" || password !== "Dhanush@gmail.com12") {
        setError("Invalid admin credentials!");
        return;
      }
      navigate("/admin-dashboard");
      return;
    }

    // STUDENT LOGIN VALIDATION
    if (role === "student") {
      if (!isValidEmail(username)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!isStrongPassword(password)) {
        setError(
          "Password must be at least 10 characters and include upper, lower, number & symbol."
        );
        return;
      }

      navigate("/student-dashboard");
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-bg">
      <div className="login-card" role="region">
        <header className="login-header">
          <h1 className="login-title">Login</h1>
          <p className="login-sub">Choose role and sign in to continue</p>
        </header>

        <form
          className="login-table-form"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <table className="login-table">
            <tbody>
              <tr>
                <th>
                  <label htmlFor="roleSelect">Role</label>
                </th>
                <td>
                  <select
                    id="roleSelect"
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      setError("");
                    }}
                  >
                    <option value="">Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </select>
                </td>
              </tr>

              {role && (
                <>
                  <tr>
                    <th>
                      <label htmlFor="username">
                        {role === "admin" ? "Username" : "Email"}
                      </label>
                    </th>
                    <td>
                      <input
                        id="username"
                        type="text"
                        placeholder={
                          role === "admin"
                            ? "Enter admin username"
                            : "Enter student email"
                        }
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </td>
                  </tr>

                  <tr>
                    <th>
                      <label htmlFor="password">Password</label>
                    </th>
                    <td>
                      <input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      {role === "admin" && (
                        <p className="hint">Admin password is fixed.</p>
                      )}
                      {role === "student" && (
                        <p className="hint">
                          Must include: uppercase, lowercase, number, symbol.
                        </p>
                      )}
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>

          <div className="login-actions">
            <button
              id="loginBtn"
              className="login-btn"
              type="submit"
              disabled={!role || !username || !password}
            >
              Login
            </button>

            <button
              type="button"
              className="forgot-btn"
              onClick={handleForgotPassword}
            >
              Forgot Password?
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}
