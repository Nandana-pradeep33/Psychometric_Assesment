import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const DeleteQuiz = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const quizid = localStorage.getItem("quizid");

  useEffect(() => {
    const deleteQuiz = async () => {
      try {
        const response = await axiosPrivate.post(
          "/manager/deletequiz",
          JSON.stringify({
            quizid: quizid,
          })
        );

        setSuccess(true);
      } catch (err) {
        if (err?.response?.status === 400) {
          setErrMsg("No emails sent or incorrect request format.");
        } else if (err?.response?.status === 401) {
          setErrMsg("Invalid or missing authorization token.");
        } else if (err?.response?.status === 404) {
          setErrMsg("Quiz not found or unauthorized access.");
        } else {
          setErrMsg("Failed to send emails due to an internal error.");
        }
      }
    };
    deleteQuiz();
  }, []);

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Delete Quiz</h1>
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 py-2 px-4 mb-4">
          Quiz deleted successfully.
        </div>
      )}
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
    </section>
  );
};

export default DeleteQuiz;
