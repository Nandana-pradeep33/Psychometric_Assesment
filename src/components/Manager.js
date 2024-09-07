import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";
import Navbar from "./Navbar";

const Manager = () => {
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
  };
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [quizzes, setQuizzes] = useState([]);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState("");
  const [logout, setLogout] = useState(false);

  const handleLogout = async (e) => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) {
      return;
    }
    e.preventDefault();
    localStorage.removeItem("user");
    try {
      const response = await axiosPrivate.get("/logout");

      setLogout(true);
    } finally {
      navigate("/login");
    }
  };

  const handleUpdateProfile = async () => {
    const newname = prompt("Enter your name");
    if (newname) {
      try {
        const response = await axiosPrivate.post(
          "/updateprofile",
          JSON.stringify({ newname })
        );

        alert("Profile updated successfully");
        // Refresh page
        window.location.reload();
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 400) {
          setErrMsg("Missing or invalid parameters");
        } else if (err?.response?.status === 401) {
          setErrMsg("Invalid or missing authorization token");
        } else if (err?.response?.status === 500) {
          setErrMsg("Failed to update profile due to an internal error");
        } else {
          setErrMsg(err?.response?.data?.message || err?.message);
        }
      }
    }
  };

  const handleViewCredits = async () => {
    try {
      const response = await axiosPrivate.get("/manager/credits");

      alert("Credits: " + response?.data?.credits);
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("Missing or invalid parameters");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to view credits due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    }
  };

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await axiosPrivate.get("/manager/quizzes");

        setSuccess(true);
        setQuizzes(response?.data?.quizzes);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 404) {
          setErrMsg("No quizzes found for the manager");
        } else if (err?.response?.status === 401) {
          setErrMsg("Unauthorized access");
        } else {
          setErrMsg(err?.response?.data?.message || err?.message);
        }
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    setStatus(localStorage.getItem("userstatus"));
  }, []);

  const handleDeleteQuiz = async (quizid) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete the quiz?"
      );
      if (!confirmDelete) {
        // If the user cancels the action, do nothing
        return;
      }
      localStorage.setItem("quizid", quizid);

      const response = await axiosPrivate.post(
        "/manager/deletequiz",
        JSON.stringify({
          quizid,
        })
      );

      // update the quizzes list
      setQuizzes((prev) => prev.filter((quiz) => quiz.quizid !== quizid));

      if (response.status === 200) {
        // alert("Quiz deleted successfully");
      }
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("No emails sent or incorrect request format.");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token.");
      } else if (err?.response?.status === 404) {
        setErrMsg("Quiz not found or unauthorized access.");
      } else {
        setErrMsg("Failed to send emails due to an internal error.");
      }
      alert(errMsg);
    }
  };

  return (
    <>
      {status === "complete" || status === "verified" ? (
        <div style={{ width: "89%" }}>
          <div style={navbarStyle}>
            <Navbar
              handleUpdateProfile={handleUpdateProfile}
              handleLogout={handleLogout}
            />
          </div>
          <section className="p-10 mx-auto" style={{ width: "94%" }}>
            <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>
            <div>
              {success && quizzes.length > 0 && (
                <>
                  <h1 className="text-2xl font-medium mb-4 pt-2">Quizzes</h1>
                  <div className="flex justify-center">
                    <Table
                      className="min-w-full mx-auto"
                      style={{ width: "95%" }}
                    >
                      <thead
                        className=" text-gray-100"
                        style={{ backgroundColor: "#173119f1" }}
                      >
                        <tr>
                          <th className="px-4 py-2">S.No</th>
                          <th className="px-4 py-2">Quiz Name</th>
                          <th className="px-4 py-2">Quiz Type</th>
                          <th className="px-4 py-2">Number of Participants</th>
                          <th className="px-4 py-2">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {quizzes.map((quiz, index) => (
                          <tr key={quiz.quizid}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">
                              {quiz.quizname}
                            </td>
                            <td className="border px-4 py-2">
                              {quiz.quiztype}
                            </td>
                            <td className="border px-4 py-2">
                              {quiz.numParticipants}
                            </td>
                            <td className="border px-4 py-2">
                              <button
                                className=" newbtn font-bold"
                                style={{
                                  width: "9.5rem",
                                  marginBottom: "0.5rem",
                                  height: "2.5rem",
                                }}
                                onClick={() => {
                                  localStorage.setItem("quizid", quiz.quizid);
                                  navigate("/manager/quizdetails");
                                }}
                              >
                                View Quiz Details
                              </button>
                              <br />
                              <button
                                className=" newbtn1 font-bold"
                                style={{
                                  width: "9.5rem",
                                  marginBottom: "0.5rem",
                                  height: "2.5rem",
                                }}
                                onClick={handleDeleteQuiz.bind(
                                  this,
                                  quiz.quizid
                                )}
                              >
                                Delete Quiz
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </div>
            <button
              className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl "
              style={{ width: "28rem" }}
              onClick={() => navigate("/manager/createquiz")}
            >
              Create Quiz
            </button>

            <button
              className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl "
              style={{ width: "28rem" }}
              onClick={() => handleUpdateProfile()}
            >
              Update Profile
            </button>

            <button
              className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl "
              style={{ width: "28rem" }}
              onClick={handleViewCredits}
            >
              View Credits
            </button>
          </section>
        </div>
      ) : (
        <section className="p-8">
          <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>
          <p>Update your profile details to continue </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
            onClick={() => handleUpdateProfile()}
          >
            Update Profile
          </button>
        </section>
      )}
    </>
  );
};

export default Manager;
