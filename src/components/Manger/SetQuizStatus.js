import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SetQuizStatus = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizid, setQuizid] = useState("");
  const [status, setStatus] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setQuizid(localStorage.getItem("quizid"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);

    if (status !== "start" && status !== "stop") {
      setErrMsg("Please provide 'start' or 'stop' as the status.");
      return;
    }

    try {
      const response = await axiosPrivate.post(
        "/manager/quizstatus",
        JSON.stringify({ quizid, status })
      );

      setSuccess(true);
      setStatus("");
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Set Quiz Status</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-md py-2 px-3 w-50 focus:outline-none focus:border-blue-400 text-black"
          >
            <option value="">Select status</option>
            <option value="start">Start</option>
            <option value="stop">Stop</option>
          </select>
        </div>
        <button type="submit" className=" newbtn" style={{ width: "50%" }}>
          Set Quiz Status
        </button>
      </form>
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mt-4 mb-4">
          {errMsg}
        </div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 py-2 px-4 mb-4">
          Quiz status updated successfully
        </div>
      )}
      <button
        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </section>
  );
};

export default SetQuizStatus;
