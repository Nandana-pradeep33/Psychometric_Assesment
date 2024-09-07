import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { InfinitySpin } from "react-loader-spinner";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const LoadingPage = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizResponse, setQuizResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const encryptedQuizId = localStorage.getItem("quizid");
  const encryptedParticipantEmail = localStorage.getItem("participantEmail");
  

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axiosPrivate.post("/participate/start", {
          encryptedQuizId,
          encryptedParticipantEmail,
        });

        setQuizResponse(response.data);
        
        setError("");
        setLoading(false);
      } catch (err) {
        handleRequestError(err);
      }
    };

    fetchQuizDetails();
  }, [axiosPrivate, encryptedQuizId, encryptedParticipantEmail]);

  const handleRequestError = (err) => {
    console.error(err);
    if (err?.response?.status === 400) {
      setError("Invalid or missing parameters");
    } else if (err?.response?.status === 401) {
      setError("Invalid or missing authorization token");
    } else if (err?.response?.status === 500) {
      setError("Failed to start the quiz due to an internal error");
    } else {
      setError(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex bg-white w-full  h-screen">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <InfinitySpin
              visible={true}
              width="150"
              color="black"
              ariaLabel="infinity-spin-loading"
              className=" justify-center items-center   w-full h-full"
            />
            <h3 className="text-black  ">Loading...</h3>
          </div>
        </div>
      ) : (
        <div className="flex bg-white w-full  h-screen">
          <div className="flex flex-col items-center justify-center w-full h-full">
            <h3 className="text-black  ">{error}</h3>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingPage;
