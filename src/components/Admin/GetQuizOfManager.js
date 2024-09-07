import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";

const GetQuizOfManager = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();

  const [quizDetails, setQuizDetails] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        // take manager username from url params
        const searchParams = new URLSearchParams(location.search);
        const manager = searchParams.get("manager");
        const quizid = searchParams.get("quizid");

        const response = await axiosPrivate.post(
          "/admin/getquiz",
          JSON.stringify({
            quizid,
            manager,
          })
        );

        setSuccess(true);
        setQuizDetails(response?.data?.quizDetails);
      } catch (err) {
        if (err?.response?.status === 404) {
          setErrMsg(
            "Manager not found or unauthorized access, or the specified quiz not found."
          );
        } else if (err?.response?.status === 401) {
          setErrMsg("Invalid or missing authorization token.");
        } else {
          setErrMsg(
            "Failed to retrieve quiz details due to an internal error."
          );
        }
      }
    };
    fetchQuizDetails();
  }, []);

  return (
    <section className="p-8" style={{ width: "94%" }}>
      <h1 className="text-3xl font-bold mb-4">Quiz Details</h1>
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <div className=" text-white-700 py-4 px-6 mb-8 rounded-lg">
          <div className=" text-sm mb-4 items-start justify-start m-0  w-60">
            <p className="mb-2">
              <span className="font-bold mb-4">Quiz Name:</span>{" "}
              {quizDetails?.quizname}
            </p>
            <p className="mb-2">
              <span className="font-bold mb-4">Quiz Type:</span>{" "}
              {quizDetails?.quiztype}
            </p>
            <p className="mb-2">
              <span className="font-bold mb-4">Credit Limit:</span>{" "}
              {quizDetails?.creditlimit}
            </p>
            <p className="mb-2">
              <span className="font-bold mb-4">Status:</span>{" "}
              {quizDetails?.status}
            </p>
          </div>
          {quizDetails?.participants?.length > 0 && (
            <>
              <h1 className="text-2xl font-medium mb-4 pt-3">Participants</h1>
              <Table className="min-w-full">
                <thead className="bg-gray-700 text-gray-100">
                  <tr>
                    <th className="px-4 py-2">S.No</th>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {quizDetails?.participants?.map((participant, index) => (
                    <tr key={participant.user}>
                      <td className="border px-4 py-2">{index + 1}</td>
                      <td className="border px-4 py-2">{participant.user}</td>
                      <td className="border px-4 py-2">{participant.name}</td>
                      <td className="border px-4 py-2">
                        {participant.scores[0] == "NA" ? (
                          "Not Attempted"
                        ) : (
                          <>
                            F={participant.scores[0] + " "}
                            A={participant.scores[1] + " "}
                            C={participant.scores[2] + " "}
                            E={participant.scores[3] + " "}
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </div>
      )}
      <button
        className="hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/admin/getquizzes")}
      >
        Back
      </button>
    </section>
  );
};

export default GetQuizOfManager;
