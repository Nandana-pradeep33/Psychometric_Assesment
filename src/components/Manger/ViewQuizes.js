import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";

const ViewQuizzes = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axiosPrivate.get("/manager/quizzes");

        setSuccess(true);
        setQuizzes(response?.data?.quizzes);
      } catch (err) {
        console.error(err);
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    };
    fetchQuizzes();
  }, []);

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">View Quizzes</h1>
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <Table className="min-w-full">
          <thead>
            <tr>
              <th className="px-4 py-2">Quiz ID</th>
              <th className="px-4 py-2">Quiz Name</th>
              <th className="px-4 py-2">Quiz Type</th>
              <th className="px-4 py-2">Number of Participants</th>
              <th className="px-4 py-2">View Quiz Details</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.map((quiz) => (
              <tr key={quiz.quizid}>
                <td className="border px-4 py-2">{quiz.quizid}</td>
                <td className="border px-4 py-2">{quiz.quizname}</td>
                <td className="border px-4 py-2">{quiz.quiztype}</td>
                <td className="border px-4 py-2">{quiz.numParticipants}</td>
                <td className="border px-4 py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => {
                      localStorage.setItem("quizid", quiz.quizid);
                      navigate("/manager/quizdetails");
                    }}
                  >
                    View Quiz Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      <button
        className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/manager")}
      >
        Back
      </button>
    </section>
  );
};

export default ViewQuizzes;
