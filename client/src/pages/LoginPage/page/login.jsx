import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const clientId = "752285667406-lblbh1eqcu9om2dlkbm9bsc10ob4659o.apps.googleusercontent.com";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleResponse,
      });
      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        { theme: "outline", size: "large", width: 280 }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const token = response.credential;

      const res = await fetch("http://localhost:8000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();

      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));

        const role = data.user.role.toLowerCase();
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "faculty") {
          navigate("/faculty");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Login error");
    }
  };

  // Dummy submit handler, does nothing
  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 to-blue-400">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-semibold mb-8 text-center text-blue-700">Welcome Back</h1>
        <form onSubmit={onSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled
          />
          <button
            type="submit"
            disabled
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold cursor-not-allowed opacity-60"
          >
            Login
          </button>
        </form>

        <p className="my-6 text-center text-gray-500 font-medium">or</p>

        <div id="google-button" className="flex justify-center"></div>
      </div>
    </div>
  );
};

export default LoginPage;
