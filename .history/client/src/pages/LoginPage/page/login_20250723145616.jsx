import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const clientId = "752285667406-lblbh1eqcu9om2dlkbm9bsc10ob4659o.apps.googleusercontent.com";

const LoginPage = ({ setUser }) => {
  const navigate = useNavigate();

  useEffect(() => {
    /* global google */
    if (window.google) {
      google.accounts.id.initialize({
        client_id: clientId,
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

  return (
    <div>
      <h1>Login with Google</h1>
      <div id="google-button"></div>
    </div>
  );
};

export default LoginPage;
