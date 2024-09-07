import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ViewParticipantUrl = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizid, setQuizid] = useState("");
  const [user, setUser] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [participantUrl, setParticipantUrl] = useState("");

  useEffect(() => {
    setQuizid(localStorage.getItem("quizid"));
    setUser(localStorage.getItem("user"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);
    try {
      const response = await axiosPrivate.post(
        "/manager/viewurl",
        JSON.stringify({ quizid, user })
      );

      setSuccess(true);
      setParticipantUrl(response?.data?.participantUrl);

      localStorage.setItem("participantUrl", response?.data?.participantUrl);
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">View Participant URL</h1>
      <p className="mb-4">
        Use this page to view the unique URL for a participant in a quiz
        session.
      </p>

      <button
        className=" newbtn"
        style={{ width: "50%" }}
        onClick={handleSubmit}
      >
        View Participant URL
      </button>

      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">
          Please Check the entered Mail id
        </div>
      )}
      {success && (
        <textarea
          className="bg-green-100 text-green-700 border border-green-400 rounded-md py-2 px-4 mb-4"
          value={participantUrl}
          readOnly
        />
      )}
    </section>
  );
};

export default ViewParticipantUrl;
