import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const ResetPassword = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [user, setUser] = useState("");
  const [otp, setOtp] = useState("");
  const [pwd, setPwd] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOTP = async (e) => {
    setLoading(true);
    e.preventDefault();
    setErrMsg("");
    try {
      const response = await axiosPrivate.post(`/requestotp/${user}`);

      alert("OTP sent to your email");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("OTP already requested. Wait for 3 mins before trying again");
      } else if (err?.response?.status === 401) {
        setErrMsg("User not found");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to send OTP due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/resetpassword",
        JSON.stringify({ user, otp, pwd })
      );

      alert("Password reset successfully");
      navigate("/login");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("Missing or invalid parameters");
      } else if (err?.response?.status === 401) {
        setErrMsg("User not found or OTP doesn't match");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to update the password due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    }
    setLoading(false);
  };

  return (
    <section className="p-8 lg:w-3/5">
      <h1 className="text-3xl font-bold mb-5">Reset Password</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-3">
          <label htmlFor="user" className="block text-sm font-semibold mb-1">
            User Email :
          </label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border rounded-md py-3 px-5  focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="otp" className="block text-sm font-semibold mb-1">
            OTP:
          </label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border rounded-md py-3 px-5 mb-5  focus:outline-none focus:border-blue-400"
          />
        </div>
        {!otp && (
          <button type="submit" className=" pt-5 newbtn" onClick={handleOTP}>
            Request OTP
          </button>
        )}
        {otp && (
          <div>
            <div className="mb-4">
              <label htmlFor="pwd" className="block text-sm font-semibold mb-1">
                New Password
              </label>
              <input
                type="password"
                id="pwd"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                className="border rounded-md py-3 px-5  focus:outline-none focus:border-blue-400"
              />
            </div>
            <button type="submit" className="pt-5 newbtn">
              Reset Password
            </button>
          </div>
        )}
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {loading && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Please wait...
        </div>
      )}
    </section>
  );
};

export default ResetPassword;
