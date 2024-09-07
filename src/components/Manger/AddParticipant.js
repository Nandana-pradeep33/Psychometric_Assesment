import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const AddParticipant = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizid, setQuizid] = useState("");
  const [participants, setParticipants] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuizid(localStorage.getItem("quizid"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);
    setLoading(true);

    try {
      const response = await axiosPrivate.post(
        "/manager/addparticipant",
        JSON.stringify({
          quizid,
          participants: participants.split(",").map((p) => p.trim()),
        })
      );
      setLoading(false);
      setSuccess(true);
      setParticipants("");
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Add Participant</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label
            htmlFor="participants"
            className="block text-sm font-semibold mb-1"
          >
            Participants e-mail (comma separated)
          </label>
          <input
            type="text"
            id="participants"
            value={participants}
            onChange={(e) => setParticipants(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <button type="submit" className=" newbtn" style={{ width: "50%" }}>
          Add Participants
        </button>
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 py-2 px-4">
          Participants added successfully
        </p>
      )}
      {loading && (
        <p className="bg-green-100 text-green-700 py-2 px-4">Please wait...</p>
      )}
    </section>
  );
};

export default AddParticipant;
