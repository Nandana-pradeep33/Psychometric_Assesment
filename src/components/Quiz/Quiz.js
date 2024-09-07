import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const StartQuiz = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const [quizDetails, setQuizDetails] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [responses, setResponses] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [formResponses, setFormResponses] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const encryptedQuizId = localStorage.getItem("quizid");
  const encryptedParticipantEmail = localStorage.getItem("participantEmail");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axiosPrivate.post("/participate/start", {
          encryptedQuizId,
          encryptedParticipantEmail,
        });

        setQuizStarted(true);
        setQuizDetails(response.data);
        setError("");
        setSuccess("");
        setErrMsg("");
      } catch (err) {
        handleRequestError(err);
      }
    };

    fetchQuizDetails();
  }, [axiosPrivate, encryptedQuizId, encryptedParticipantEmail]);

  const handleOptionSelect = (questionIndex, optionIndex, choice) => {
    const newResponses = [...responses];
    if (!newResponses[questionIndex]) {
      newResponses[questionIndex] = [];
    }
    newResponses[questionIndex][optionIndex] = choice;
    setResponses(newResponses);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const isCurrentQuestionAnswered = () => {
    return (
      responses[currentQuestionIndex] &&
      responses[currentQuestionIndex].filter(Boolean).length === 4
    );
  };
  const handleSubmit = async (e) => {
    setErrMsg("");
    e.preventDefault();
    try {
      const formattedResponses = responses.map((questionResponse) =>
        questionResponse.map((choice) => 5 - parseInt(choice))
      );

    
      const response = await axiosPrivate.post("/participate/submit", {
        responses: formattedResponses,
        encryptedQuizId,
        encryptedParticipantEmail,
      });

      setFormResponses(formattedResponses);
      setSuccess(true);
      setResponses([]);
      navigate("/quiz/thankyou");
    } catch (err) {
      handleRequestError(err);
    }
  };

  const handleRequestError = (err) => {
    //console.error(err);
    if (err?.response?.data?.error) {
      if (
        err.response.data.error ===
        "Incomplete profile, please provide details."
      ) {
        navigate(
          `/quiz/updateparticipant?q=${encryptedQuizId}&p=${encryptedParticipantEmail}`
        );
      }
      setErrMsg(err.response.data.error);
    } else {
      setErrMsg("Something went wrong. Please try again.");
    }
  };

  const handleCheckboxToggle = (currentChoice, optionIndex) => {
    const newResponses = [...responses];

    if (!newResponses[currentQuestionIndex]) {
      newResponses[currentQuestionIndex] = [];
    }

    // Check if the current choice is already selected in other options
    const isChoiceSelectedInOtherOptions = newResponses[
      currentQuestionIndex
    ].some(
      (response, index) =>
        index !== optionIndex && response !== null && response === currentChoice
    );

    // If the choice is selected in other options, disable it in this option
    if (isChoiceSelectedInOtherOptions) {
      newResponses[currentQuestionIndex][optionIndex] = null;
    } else {
      // If the choice is not selected in other options, toggle its state
      newResponses[currentQuestionIndex][optionIndex] =
        newResponses[currentQuestionIndex][optionIndex] === currentChoice
          ? null
          : currentChoice;
    }

    setResponses(newResponses);
  };

  const handlePreviousQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleResetQuestion = () => {
    const newResponses = [...responses];

    if (newResponses[currentQuestionIndex]) {
      newResponses[currentQuestionIndex] = newResponses[
        currentQuestionIndex
      ].map(() => null);
      setResponses(newResponses);
    }
  };

  return (
    <section className="bg-white min-h-screen flex items-center justify-center py-12 px-4 sm:px-8 lg:px-8 text-black">
      <div className="max-w-md w-full space-y-8">
        <h1 className="lg:text-2xl text-xl font-bold text-center">
          Psychometric
          <br />
          Assessment Quiz
        </h1>
        {errMsg && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errMsg}
          </div>
        )}
        {quizDetails && currentQuestionIndex < quizDetails.questions.length && (
          <form className="mt-5 space-y-6" onSubmit={handleSubmit}>
            <div className="bg-red-100 border border-gray-400 text-gray-700 rounded relative">
              <h2 className="text-md font-semibold mb-2">Instructions</h2>
              <ul className="list-disc pl-4 " style={{ fontSize: "17px" }}>
                <li>1 - Most Like You</li>
                <li>2 - Tend To Be More Like You</li>
                <li>3 - Tend To Be Least Like You</li>
                <li>4 - Least Like You</li>
              </ul>
            </div>
            <div key={currentQuestionIndex} className="space-y-4">
              <h3 className="lg:text-xl font-semibold pb-2">
                {currentQuestionIndex + 1}. &nbsp;
                {quizDetails.questions[currentQuestionIndex].questionText}
              </h3>
              <div className="space-y-2 ">
                <p className="text-lg font-medium ">
                  {quizDetails.questions[currentQuestionIndex].questionType}
                </p>
                {quizDetails.questions[currentQuestionIndex].options.map(
                  (option, optionIndex) => (
                    <div key={optionIndex} className="lg:flex items-center">
                      <hr className="mt-4 mb-4 block lg:hidden border-t border-gray-400" />
                      <p className="mr-4">{option}</p>
                      {[1, 2, 3, 4].map((choice) => (
                        <label
                          key={choice}
                          className="inline-flex items-center mr-2 text-red"
                        >
                          <input
                            type="checkbox"
                            name={`question-${currentQuestionIndex}-option-${optionIndex}`}
                            value={choice}
                            checked={
                              responses[currentQuestionIndex] &&
                              responses[currentQuestionIndex].includes(choice)
                            }
                            onChange={() =>
                              handleCheckboxToggle(choice, optionIndex)
                            }
                            className="form-checkbox h-4 w-4 text-indigo-600"
                            disabled={
                              responses[currentQuestionIndex] &&
                              responses[currentQuestionIndex].some(
                                (chosenChoice) =>
                                  chosenChoice === choice &&
                                  chosenChoice !==
                                    responses[currentQuestionIndex][optionIndex]
                              )
                            }
                          />
                          <span className="ml-1 text-black">{choice}</span>
                        </label>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-between">
              {/* Previous Question button */}
              {currentQuestionIndex === 0 ? (
                <button
                  type="button"
                  disabled
                  className="w-1/2 py-2 px-4 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-300 cursor-not-allowed"
                >
                  Previous Question
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  className="w-1/2 mr-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Previous Question
                </button>
              )}

              {/* Next Question button */}
              {currentQuestionIndex === quizDetails.questions.length - 1 ? (
                <button
                  type="submit"
                  disabled={!isCurrentQuestionAnswered()}
                  className={`w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isCurrentQuestionAnswered()
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Submit Quiz
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  disabled={!isCurrentQuestionAnswered()}
                  className={`w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isCurrentQuestionAnswered()
                      ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  Next Question
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleResetQuestion()}
              className="w-1/2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Reset
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default StartQuiz;
