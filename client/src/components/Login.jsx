import React, { useState } from "react";
import { useAppContext } from "../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { setShowUserLogin, setUser, axios } = useAppContext();
  const [state, setState] = useState("login"); // 'login' or 'register'
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || (state === "register" && !name)) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const endpoint = state === "login" ? "/api/user/login" : "/api/user/register";

      const { data } = await axios.post(
        endpoint,
        { name, email, password },
        { withCredentials: true } // make sure cookies sent
      );

      if (!data.success) {
        toast.error(data.message || (state === "login" ? "Invalid credentials" : "Registration failed"));
        return;
      }

      setUser(data.user); // update user in context
      localStorage.setItem("user", JSON.stringify(data.user)); // optional: keep local copy

      setShowUserLogin(false);
      toast.success(state === "login" ? "Login successful" : "Account created!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  return (
    <div
      onClick={() => setShowUserLogin(false)}
      className="fixed inset-0 z-30 flex items-center justify-center text-sm text-gray-600 bg-black/50"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
      >
        <p className="m-auto text-2xl font-medium">
          <span className="text-primary">User</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register" && (
          <div className="w-full">
            <p>Name</p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary"
            />
          </div>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary"
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="w-full p-2 mt-1 border border-gray-200 rounded outline-primary"
          />
        </div>

        <div className="w-full text-sm">
          {state === "register" ? (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setState("login")}
                className="cursor-pointer text-primary"
              >
                Login here
              </span>
            </p>
          ) : (
            <p>
              Don't have an account?{" "}
              <span
                onClick={() => setState("register")}
                className="cursor-pointer text-primary"
              >
                Sign up here
              </span>
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 text-white transition-all rounded-md bg-primary hover:bg-primary-dull"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
