import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";

const QuizDetails = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();

  const quizid = localStorage.getItem("quizid");
  const [quizDetails, setQuizDetails] = useState({});
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [registrationStatus, setRegistrationStatus] = useState("close");
  const [apiSuccessMsg, setApiSuccessMsg] = useState("");
  const [quizStatus, setQuizStatus] = useState("stop");

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const response = await axiosPrivate.post(
          "/manager/quizdetails",
          JSON.stringify({
            quizid,
          })
        );

        
        setSuccess(true);
        setQuizDetails(response?.data?.quizDetails);
        setRegistrationStatus(
          response?.data?.quizDetails?.regstatus === "no" ? "close" : "open"
        );
      } catch (err) {
        console.error(err);
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    };
    fetchQuizDetails();
  }, [axiosPrivate, quizid]);

//   Start/Stop Quiz
// Endpoint: POST /api/manager/quizstatus
// Description:
// This route allows managers to start or stop a specific quiz. It requires a valid authorization token in the header for authentication.

// Headers:
// Authorization (string, required): The manager's authentication token.
// Body Parameters:
// quizid (string, required): The unique identifier of the quiz for which the status will be updated.
// status (string, required): The status to set for the quiz. Valid values are "start" or "stop".
// Responses:
// 200 OK: Quiz status updated successfully. Returns a message, the quiz ID, and the updated status.
// 400 Bad Request: Invalid status value or other request parameters.
// 404 Not Found: Quiz not found or unauthorized access.
// 500 Internal Server Error: Failed to update quiz status due to an internal error.
// Example Request:
// POST /manager/quizstatus
// {
//   "quizid": "12345abcdef",
//   "status": "start"
// }
// Example Response (Success):
// {
//   "message": "Quiz started successfully",
//   "quizId": "12345abcdef",
//   "status": "start"
// }


  const handleChangeQuizStatus = async () => {
    try {
      const confirmChange = window.confirm(
        "Are you sure you want to change the status of the quiz?"
      );
      if (!confirmChange) {
        // If the user cancels the action, do nothing
        return;
      }
      const status = quizStatus === "stop" ? "start" : "stop";
      const response = await axiosPrivate.post(
        "/manager/quizstatus",
        JSON.stringify({
          quizid,
          status,
        })
      );

      // update the quiz status
      setQuizStatus(status);

      //update the quiz details
      setQuizDetails((prev) => ({
        ...prev,
        status,
      }));

      if (response.status === 200) {
        // alert("Quiz status updated successfully");
      }
    } catch (err) {
      //console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("Invalid status value or missing required fields.");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token.");
      } else if (err?.response?.status === 404) {
        setErrMsg("Quiz not found or unauthorized access.");
      } else {
        setErrMsg("Failed to update quiz status due to an internal error.");
      }
      alert(errMsg);
    }
  };




  const handleRemoveParticipant = async () => {
    try {
      const confirmRemove = window.confirm(
        "Are you sure you want to remove the selected participant(s)?"
      );

      if (!confirmRemove) {
        return;
      }

      const users = selectedParticipants;
      const response = await axiosPrivate.post(
        "/manager/removeparticipant",
        JSON.stringify({
          quizid,
          users,
        })
      );

      // update the participants list
      setQuizDetails((prev) => ({
        ...prev,
        participants: prev.participants.filter(
          (participant) => !users.includes(participant.user)
        ),
      }));
      setSelectedParticipants([]);

    } catch (err) {
      console.error(err);

      setErrMsg(err?.response?.data?.message || err?.message);

      
    }
  };
  const handleChangeRegistrationStatus = async () => {
    try {
      const confirmChange = window.confirm(
        "Are you sure you want to change the registration status of the quiz?"
      );
      if (!confirmChange) {
        // If the user cancels the action, do nothing
        return;
      }
      const status = registrationStatus === "close" ? "yes" : "no";
      const response = await axiosPrivate.post(
        "/manager/regstatus",
        JSON.stringify({
          quizid,
          status,
        })
      );

      // update the registration status
      setRegistrationStatus(status === "yes" ? "open" : "close");

      //update the quiz details
      setQuizDetails((prev) => ({
        ...prev,
        regstatus: status,
      }));

      if (response.status === 200) {
        // alert("Registration status updated successfully");
      }
    } catch (err) {
      //console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("Invalid status value or missing required fields.");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token.");
      } else if (err?.response?.status === 404) {
        setErrMsg("Quiz not found or unauthorized access.");
      } else {
        setErrMsg(
          "Failed to update registration status due to an internal error."
        );
      }
      alert(errMsg);
    }
  };
  const handleSendAllScores = async () => {
    try {
      const confirmChange = window.confirm(
        "Are you sure you want to send scores to all participants?"
      );
      if (!confirmChange) {
        // If the user cancels the action, do nothing
        return;
      }

      const response = await axiosPrivate.post(
        "/manager/sendallscores",
        JSON.stringify({
          quizid,
        })
      );

      if (response.status === 200) {
        setApiSuccessMsg(response.data.message);
      }
    } catch (err) {
      //console.error(err);
      if (err?.response?.data?.error) {
        setErrMsg(err.response.data.error);
      } else {
        setErrMsg("Failed to send scores due to an internal error.");
      }
    }
  };

  return (
    <section className="p-8 " style={{ width: "87%" }}>
      <h1 className="text-3xl font-bold mb-4">Quiz Details</h1>
      {apiSuccessMsg && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {apiSuccessMsg}
        </div>
      )}
      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <div className=" text-white-700 py-4 px-6  rounded-lg">
          <div className=" text-sm mb-1 items-start justify-start m-0  w-60">
            <p className="mb-2 flex">
              <span className="font-bold">Quiz Code:</span> {quizDetails?.code}
            </p>
            <p className="mb-2 flex">
              <span className="font-bold">Quiz Name:</span>{" "}
              {quizDetails?.quizname}
            </p>
            <p className="mb-2 flex">
              <span className="font-bold ">Quiz Type:</span>{" "}
              {quizDetails?.quiztype}
            </p>
            <p className="mb-2 flex">
              <span className="font-bold ">Credit Limit:</span>{" "}
              {quizDetails?.creditlimit}
            </p>
            <p className="mb-2 flex ">
              <span className="font-bold">Status:</span> {quizDetails?.status}
              <button
                className="bg-gray-500 hover:bg-blue-700 text-white text-sm font-semibold rounded newbtn"
                style={{ width: "3rem", height: ".5rem", fontSize: ".5rem", padding:".5rem" ,marginLeft:".5rem", lineHeight:"0"}}
                onClick={handleChangeQuizStatus}
              >
                Change
              </button>
            </p>
            <p className="mb-2 flex ">
              <span className="font-bold ">Registration Status:</span>{" "}
              {registrationStatus}

              <button
                className="bg-gray-500 hover:bg-blue-700 font-semibold rounded newbtn"
                style={{ width: "3rem", height: ".5rem", fontSize: ".5rem", padding:".5rem", marginLeft:".5rem", lineHeight:"0"}}
                onClick={handleChangeRegistrationStatus}
              >
                Change
              </button>
            </p>
          </div>
          {quizDetails?.participants?.length > 0 && (
            <div className="mt-8">
              <h4 className="font-bold text-lg mb-4">Participants</h4>
              <div className="flex justify-center">
                <Table className="min-w-full ">
                  <thead
                    className="text-gray-100"
                    style={{ backgroundColor: "#173119f1" }}
                  >
                    <tr
                      className=" text-gray-100"
                      style={{ backgroundColor: "#173119f1" }}
                    >
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Email</th>
                      <th className="px-4 py-2">Scores</th>
                      <th className="px-4 py-2">Action</th>
                      <th className="px-4 py-2">Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizDetails?.participants?.map((participant) => (
                      <tr key={participant.user}>
                        <td className="border px-4 py-2">{participant.name}</td>
                        <td className="border px-4 py-2">{participant.user}</td>
                        <td className="border px-4 py-2">
                          {participant.scores[0] === "NA"
                            ? "Not Attempted"
                            : `F=${participant.scores[0]}
                      A=${participant.scores[1]} 
                      C=${participant.scores[2]} 
                      E=${participant.scores[3]}`}
                        </td>

                        {participant.scores[0] == "NA" ? (
                          <td className="border px-4 py-2 ">
                            <button
                              className=" text-white font-bold py-2 px-4 mr-1 newbtn "
                              style={{
                                width: "7rem",
                                marginBottom: "0.5rem",
                                height: "2.5rem",
                              }}
                              onClick={() => {
                                localStorage.setItem("user", participant?.user);
                                navigate("/manager/viewparticipanturl");
                              }}
                            >
                              View URL
                            </button>
                            <br />
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 newbtn"
                              style={{ width: "7rem", height: "2.5rem" }}
                              onClick={() => {
                                localStorage.setItem("user", participant?.user);
                                navigate("/manager/sendparticipanturl");
                              }}
                            >
                              Send URL
                            </button>
                          </td>
                        ) : (
                          <td className="border px-4 py-2">
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-1 newbtn"
                              onClick={() => {
                                localStorage.setItem("user", participant?.user);
                                navigate(
                                  `/manager/viewresponse?quizid=${quizid}&user=${participant?.user} `
                                );
                              }}
                            >
                              View Response
                            </button>
                            <button
                              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded newbtn"
                              style={{ marginTop: "1rem" }}
                              onClick={() => {
                                localStorage.setItem("user", participant?.user);
                                navigate(
                                  `/manager/sendresponse?quizid=${quizid}&emails=${participant?.user} `
                                );
                              }}
                            >
                              Send Response to user
                            </button>
                          </td>
                        )}
                        <td className="border px-4 py-2">
                          <input
                            type="checkbox"
                            onChange={() => {
                              const isSelected = selectedParticipants.includes(
                                participant.user
                              );
                              if (isSelected) {
                                setSelectedParticipants((prev) =>
                                  prev.filter(
                                    (email) => email !== participant.user
                                  )
                                );
                              } else {
                                setSelectedParticipants((prev) => [
                                  ...prev,
                                  participant.user,
                                ]);
                              }
                            }}
                            checked={selectedParticipants.includes(
                              participant.user
                            )}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          <div className="mt-8">
          {selectedParticipants.length > 0 && (
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4  newbtn1"
                style={{ width: "29rem", marginBottom: "0.5rem" }}
                onClick={handleRemoveParticipant}
              >
                Remove Selected Participant
              </button>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 newbtn "
              style={{ width: "29rem", marginBottom: "0.5rem" }}
              onClick={() => {
                localStorage.setItem("quizid", quizid);
                navigate("/manager/addparticipant");
              }}
            >
              Add Participant
            </button>
            <br />
            
         
            {/* <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 newbtn"
              style={{ width: "29rem", marginBottom: "0.5rem" }}
              onClick={() => {
                localStorage.setItem("quizid", quizid);
                navigate("/manager/setquizstatus");
              }}
            >
              Set Quiz Status
            </button>
            <br></br>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 newbtn"
              style={{ width: "29rem", marginBottom: "0.5rem" }}
              onClick={handleChangeRegistrationStatus}
            >
              Change Registration Status
            </button> */}
         
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4 newbtn"
              style={{ width: "29rem", marginBottom: "0.5rem" }}
              onClick={handleSendAllScores}
            >
              Send Scores to All Participants
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizDetails;
