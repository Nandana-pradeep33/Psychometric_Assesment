import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SendResponse = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const quizid = searchParams.get("quizid");
  const email = searchParams.get("emails");

  useEffect(() => {
    const sendResponse = async () => {
      setLoading(true);
      try {
        const response = await axiosPrivate.post(
          "/manager/sendscore",
          JSON.stringify({
            quizid: quizid,
            emails: [email],
          })
        );
        setLoading(false);
        setSuccess(true);
      } catch (err) {
        setLoading(false);
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
    sendResponse();
  }, []);

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Send Response</h1>
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 py-2 px-4 mb-4">
          Emails sent successfully.
        </div>
      )}
      {loading && (
        <div className="bg-green-100 text-green-700 py-2 px-4 mb-4">
          Please wait...
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

export default SendResponse;
