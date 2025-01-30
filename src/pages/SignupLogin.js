import React, { useState } from "react";

// SignupLogin Component
const SignupLogin = ({ onLogin, onSignup, errorMessage }) => {
    const [formState, setFormState] = useState("login"); // "login" or "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // Toggle between Login and Sign Up
    const toggleFormState = () => {
        setFormState(formState === "login" ? "signup" : "login");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!email || !password) {
            return;
        }

        if (formState === "signup" && password !== confirmPassword) {
            return;
        }

        // Call the appropriate function based on the form state (login or signup)
        if (formState === "signup") {
            await onSignup(email, password); // Call signup handler from App component
        } else {
            await onLogin(email, password); // Call login handler from App component
        }
    };

    return (
        <div className="form-container">
            <div className="toggle-form">
                <button onClick={toggleFormState}>
                    {formState === "login"
                        ? "Don't have an account? Sign Up"
                        : "Already have an account? Log In"}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="form">
                <h2>{formState === "login" ? "Login" : "Sign Up"}</h2>

                {/* Show error message */}
                {errorMessage && <div className="error">{errorMessage}</div>}

                <div className="input-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                {formState === "signup" && (
                    <div className="input-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm your password"
                            required
                        />
                    </div>
                )}

                <button type="submit" className="submit-btn">
                    {formState === "login" ? "Login" : "Sign Up"}
                </button>
            </form>
        </div>
    );
};

export default SignupLogin;
