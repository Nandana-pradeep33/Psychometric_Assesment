import React from "react";

import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const QuizHome = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [quizid, setQuizid] = useState("");
  const [participantEmail, setParticipantEmail] = useState("");

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const quizid = searchParams.get("q");
    const participantEmail = searchParams.get("p");

    setQuizid(quizid || "");
    setParticipantEmail(participantEmail || "");

    // save quizid and participantEmail to localstorage
    localStorage.setItem("quizid", quizid);
    localStorage.setItem("participantEmail", participantEmail);
  }, [location.search]);

  return (
    <div
      className="bg-white min-h-screen mt-2 pt-4 flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 text-black lg:w-1/2"
      style={{ fontSize: "18px" }}
    >
      <div className="max-w-2xl mx-auto pt-3">
        <h1 className="text-2xl font-bold mb-5">Quiz Instructions</h1>
        <p className="mb-4 pt-3">
          Please donot refresh or press F5 tab during the assessment.
        </p>
        <p className="mb-4">
          There are <b>20</b> situations for this assessment. Each situation has
          4 responses each.
          <br />
          Rank all four responses following the parameters given below:-
        </p>

        <ol className="lg:pl-8  mb-6 list-disc  ">
          <li>
            <b>1</b> - Most Like You
          </li>
          <li>
            <b>2</b> - Tend To Be More Like You
          </li>
          <li>
            <b>3</b> - Tend To Be Least Like You
          </li>
          <li>
            <b>4</b> - Least Like You
          </li>
        </ol>
        <p className="mb-4">
          You have <b>30 minutes</b> to complete the assessment.
        </p>
        <p className="mb-4">
          Each of the four multiple choices should get a <b>1 </b>or <b>2 </b>or{" "}
          <b>3 </b>or <b>4</b> in the order that you decide.
          <br />
          The result from adding all the four scores given for the responses,
          under each situation, should be 10 ie.{" "}
          <b>
            Only one response under each sentence can be ranked 1, 2, 3, or 4
          </b>
        </p>
        <p className="mb-4">No answer is right or wrong in this assessment.</p>
        <ul className="lg:pl-8  mb-6 list-disc  ">
          <li className="pb-2">
            • You have to rank them according to what response stands close to
            how you might respond at the given situations.
          </li>
          <li className="pb-2">
            • Careful analysis is not needed and you needn't think what is the
            right answer, all answers are right.
          </li>
          <li className="pb-2">
            • These are just preferences to understand how you are likely to act
            at certain circumstances so as to find out your personality type.
          </li>
          <li className="pb-2">
            • Once you have ranked a response from 1-4, the number will be
            disabled to prevent you from grading another response under the same
            situation with the same number. If you feel like changing the order
            of your possible responses for a situation, click the <b>RESET </b>
            button below the situation. This will enable you to re-rank the
            choices.
          </li>
          <li className="pb-2">
            • After ranking the options for all <b>20 situations</b>, Click{" "}
            <b>SUMBIT</b> to complete the assessment.
          </li>
        </ul>
        <div className="text-center">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto newbtn"
            style={{ width: "90%" }}
            onClick={() => navigate("/quiz/start")}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizHome;

// onClick={() => navigate(`/quiz/updateparticipant?q=${quizid}&p=${participantEmail}`)}
