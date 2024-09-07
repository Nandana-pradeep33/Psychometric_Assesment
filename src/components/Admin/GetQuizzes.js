import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";

const GetQuizzes = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizzes, setQuizzes] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const searchParams = new URLSearchParams(location.search);
  const manager = searchParams.get("manager");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        // take manager username from url params

        const response = await axiosPrivate.post(
          "/admin/getquizzes",
          JSON.stringify({
            manager: manager,
          })
        );

        setSuccess(true);
        setQuizzes(response?.data?.quizzes);
      } catch (err) {
        if (err?.response?.status === 404) {
          setErrMsg(
            "Manager not found or unauthorized access, or no quizzes found for the manager."
          );
        } else if (err?.response?.status === 401) {
          setErrMsg("Invalid or missing authorization token.");
        } else {
          setErrMsg("Failed to retrieve quizzes due to an internal error.");
        }
      }
    };
    fetchQuizzes();
  }, []);
  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Get Quizzes</h1>
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded newbtn mt-2"
                    onClick={() => {
                      navigate(
                        "/admin/quizdetails/?quizid=" +
                          quiz.quizid +
                          "&manager=" +
                          manager
                      );
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
        className="hover:bg-green-800 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/admin")}
      >
        Back
      </button>
    </section>
  );
};

export default GetQuizzes;
