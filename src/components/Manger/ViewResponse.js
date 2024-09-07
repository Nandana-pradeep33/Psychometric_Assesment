import React, { useState, useEffect } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useLocation } from "react-router-dom";

const ViewResponse = () => {
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  const [responseDetails, setResponseDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponseDetails = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const quizid = searchParams.get("quizid");
        const participantEmail = searchParams.get("user");

        const response = await axiosPrivate.post(
          "/manager/viewresponse",
          JSON.stringify({
            quizid,
            user: participantEmail,
          })
        );

        setResponseDetails(response.data);
        setError("");
      } catch (err) {
        console.error(err);
        if (err?.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to fetch response details");
        }
        setResponseDetails(null);
      }
    };

    fetchResponseDetails();
  }, [axiosPrivate]);

  return (
    <div
      className="bg-white p-2 min-h-screen flex items-center mt-5 justify-center py-12 px-4 sm:px-6 lg:px-4 text-black lg:w-3/6"
      style={{ marginTop: "4rem" }}
    >
      <div className="max-w-md w-full space-y-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}
        {responseDetails && (
          <div>
            <h1 className="text-2xl font-bold text-center pb-5">
              Participant Responses
            </h1>
            <div>
              <h2 className="text-lg font-semibold mb-2 pt-4">
                Participant Details
              </h2>
              <p>Name: {responseDetails.participantDetails.name}</p>
              <p>Email: {responseDetails.participantDetails.email}</p>
              <p>Phone: {responseDetails.participantDetails.phone}</p>
              <p>Age: {responseDetails.participantDetails.age}</p>
              <p>Sex: {responseDetails.participantDetails.sex}</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mt-4 mb-2">Score</h2>
              <ul>
                {/* {responseDetails.score.map((score, index) => (
                  <li key={index}>Question {index + 1}: {score}</li>
                ))} */}
                <li>F = {responseDetails.score[0]}%</li>
                <li>A = {responseDetails.score[1]}%</li>
                <li>C = {responseDetails.score[2]}%</li>
                <li>E = {responseDetails.score[3]}%</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mt-4 pt-4 mb-2">
                Questions & Responses
              </h2>

              {responseDetails.questions.map((question, index) => (
                <div key={index}>
                  <h3 className="text-base font-semibold mt-3">
                    {question.questionText}
                  </h3>

                  <table className="border-collapse w-full mt-2">
                    <tbody>
                      {question.options.map((option, optionIndex) => (
                        <tr key={optionIndex} className="border-b">
                          <td className="py-2 px-4">{option.optionText}</td>
                          <td className="py-2 px-4">
                            <span className="text-green-500 font-semibold">
                              {option.response}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <hr className="mt-4 mb-4 block border-t border-gray-400" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponse;
