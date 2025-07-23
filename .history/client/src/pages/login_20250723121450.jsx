import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Mentorimg from "../../assets/LoginPage/Mentor.png";

const LoginPage = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [googleUser, setGoogleUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id:
          "752285667406-lblbh1eqcu9om2dlkbm9bsc10ob4659o.apps.googleusercontent.com",
        callback: handleGoogleResponse,
      });

      google.accounts.id.renderButton(
        document.getElementById("google-button"),
        {
          theme: "outline",
          size: "large",
        }
      );
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    const token = response.credential;
    try {
      const res = await fetch("http://localhost:8000/api/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        const role = data.user.Role.toLowerCase();

        // Navigate based on role
        if (role === "admin") {
          navigate("/Admin");
        } else if (role === "faculty") {
          navigate("/Faculty");
        } else {
          navigate("/Dashboard");
        }
      } else {
        alert(data.message || "Google sign-in failed");
      }
    } catch (err) {
      console.error("Google Login Error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#c8e9f7]">
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div className="bg-white p-10 shadow-lg w-[400px] h-[430px] text-center backdrop-blur-md rounded-l-[13px]">
          <h1 className="text-2xl font-semibold text-indigo-600 mb-6">
            LearnOnline
          </h1>
          <form className="flex flex-col gap-4 mb-5">
            <input
              className="bg-blue-100 text-slate-800 p-3 border border-slate-300 rounded-[13px] text-base outline-none focus:border-indigo-500 transition"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              className="bg-blue-100 text-slate-800 p-3 border border-slate-300 rounded-[13px] text-base outline-none focus:border-indigo-500 transition"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              className="bg-blue-400 text-white p-3 rounded-[13px] text-base font-medium hover:bg-blue-600 transition"
              type="submit"
            >
              Login
            </button>
          </form>
          <h2 className="text-slate-800 font-normal text-center">or</h2>
          <div
            id="google-button"
            className="flex justify-center rounded-[13px] p-5"
          ></div>
        </div>
        <img
          className="bg-[#85bddd] h-[430px] w-[430px] rounded-tr-[13px] rounded-br-[13px] shadow-lg"
          src={Mentorimg}
          alt="Mentor"
        />
      </div>
    </div>
  );
};

export default LoginPage;
