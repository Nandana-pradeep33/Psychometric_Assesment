import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const RegisterManager = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState("");
  const [credits, setCredits] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);

    try {
      const response = await axiosPrivate.post(
        "/admin/register",
        JSON.stringify({ user, credits })
      );

      setSuccess(true);
      setUser("");
      setCredits("");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 409) {
        setErrMsg("Username already exists");
      } else if (err?.response?.status === 400) {
        setErrMsg("Missing or invalid parameters");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token");
      } else if (err?.response?.status === 500) {
        setErrMsg(
          "Failed to register the new manager due to an internal error"
        );
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    }
  };

  return (
    <section className="p-8 lg:w-3/5">
      <h1 className="text-3xl font-bold mb-5">Manager Registration</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="user" className="block text-sm font-semibold mb-1">
            Manager e-mail
          </label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border rounded-md py-3 px-5  focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4 pb-5">
          <label
            htmlFor="credits"
            className="block text-sm font-semibold mb-1 "
          >
            Credits
          </label>
          <input
            type="number"
            id="credits"
            value={credits}
            onChange={(e) => setCredits(e.target.value)}
            className="border rounded-md py-2 px-5 w-96 focus:outline-none focus:border-blue-400 text-black"
          />
        </div>
        <button
          type="submit"
          className=" newbtn pt-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 "
        >
          Register Manager
        </button>
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {success && (
        <div>
          <p className="bg-green-100 text-green-700 py-2 px-4">
            Manager registered successfully
          </p>
          {navigate("/admin")}
        </div>
      )}
    </section>
  );
};

export default RegisterManager;
