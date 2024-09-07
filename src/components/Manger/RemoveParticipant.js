import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const RemoveParticipant = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizid, setQuizid] = useState("");
  const [user, setUser] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setQuizid(localStorage.getItem("quizid"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);
    try {
      const response = await axiosPrivate.post(
        "/manager/removeparticipant",
        JSON.stringify({ quizid, user })
      );

      setSuccess(true);
      setUser("");
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Remove Participant</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="user" className="block text-sm font-semibold mb-1">
            Participant e-mail
          </label>
          <input
            type="text"
            id="user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <button type="submit" className=" newbtn" style={{ width: "50%" }}>
          Remove Participant
        </button>
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 py-2 px-4">
          Participant removed successfully
        </p>
      )}
      <button
        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-6"
        onClick={() => navigate("/manager")}
      >
        Back
      </button>
    </section>
  );
};

export default RemoveParticipant;
