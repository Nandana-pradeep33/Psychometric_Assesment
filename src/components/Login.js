import { useRef, useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "../api/axios";
const LOGIN_URL = "/auth";

const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const userRef = useRef();
  const errRef = useRef();

  const [user, setUser] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = useState(
    localStorage.getItem("persist") === "true"
  );
  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [user, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({ user, pwd }),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const accessToken = response?.data?.accessToken;
      const roles = response?.data?.roles;
      const status = response?.data?.status;

      setAuth({ user, pwd, roles, accessToken });
      setUser("");
      setPwd("");
      setErrMsg("");

      localStorage.setItem("userstatus", status);

      if (roles?.find((role) => role === 1984)) {
        navigate("/manager");
      } else if (roles?.find((role) => role === 5150)) {
        navigate("/admin");
      } else {
        navigate(from);
      }
    } catch (err) {
      if (!err?.response) {
        setErrMsg("No Server Response");
      } else if (err.response?.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.response?.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg("Login Failed");
      }
      errRef.current.focus();
    }
  };

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <section className="lg:w-3/5">
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <h1 className="text-3xl font-bold mb-4">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Email:</label>
        <input
          type="text"
          id="username"
          ref={userRef}
          autoComplete="off"
          onChange={(e) => setUser(e.target.value)}
          value={user}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          onChange={(e) => setPwd(e.target.value)}
          value={pwd}
          required
        />
        <div className="mt-4">
          <button className="btn newbtn" type="submit">
            Sign In
          </button>
        </div>
        <label
          htmlFor="persist"
          style={{ fontSize: "19px", color: "rgb(65,60,60)" }}
        >
          <input
            type="checkbox"
            id="persist"
            checked={persist}
            onChange={togglePersist}
          />
          Remember Me
        </label>
      </form>
      <Link to="/resetpassword">
        <p
          className="text-black"
          style={{ fontSize: "18px", color: "rgb(65,60,60)" }}
        >
          Forgot Password?
        </p>
      </Link>
    </section>
  );
};

export default Login;
