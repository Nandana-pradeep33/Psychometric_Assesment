import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { Table } from "react-bootstrap";
import Navbar from "./Navbar";

const Admin = () => {
  const navbarStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    // Add other styles as needed
  };
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [logout, setLogout] = useState(false);
  const [managers, setManagers] = useState([]);
  const [credits, setCredits] = useState("");
  const [creditsUpdate, setCreditsUpdate] = useState(false);

  const axiosPrivate = useAxiosPrivate();

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

  useEffect(() => {
    const getManagers = async () => {
      try {
        const response = await axiosPrivate.get("/admin/getmanagers");

        setManagers(response?.data);
      } catch (err) {
        console.error(err);
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    };
    getManagers();
  }, []);

  const handleUpdateCredits = async (username) => {
    const credits = prompt("Enter manger credits");
    try {
      const response = await axiosPrivate.post(
        "/admin/updatecredits",
        JSON.stringify({ manager: username, newcredits: credits })
      );

      setCreditsUpdate(true);
      // alert("Credits updated successfully");
      setCredits("");

      // update setmanager with new credits
      setManagers((prev) =>
        prev.map((manager) => {
          if (manager.user === username) {
            return {
              ...manager,
              credits,
            };
          }
          return manager;
        })
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 404) {
        setErrMsg("No matching manager found to update credits");
      } else if (err?.response?.status === 400) {
        setErrMsg("Missing or invalid parameters");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to update credits due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
      alert(errMsg);
    }
  };

  const handleDeleteManager = async (username) => {
    try {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the manager ${username}?`
      );
      if (!confirmDelete) {
        return;
      }

      const response = await axiosPrivate.post(
        "/admin/deletemanager",
        JSON.stringify({ manager: username })
      );

      // alert("Manager deleted successfully");
      setManagers((prev) =>
        prev.filter((manager) => manager.user !== username)
      );
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 404) {
        setErrMsg("No matching manager found to delete");
      } else if (err?.response?.status === 400) {
        setErrMsg("Missing or invalid parameters");
      } else if (err?.response?.status === 401) {
        setErrMsg("Invalid or missing authorization token");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to delete manager(s) due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
      alert(errMsg);
    }
  };

  return (
    <div style={{ width: "89%" }}>
      <div style={navbarStyle}>
        <Navbar
          handleUpdateProfile={handleUpdateProfile}
          handleLogout={handleLogout}
        />
      </div>

      <section className="p-11 lg:w-6/7 mx-auto " style={{ width: "94%" }}>
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        <p className="mb-4">Welcome to the Admin Dashboard</p>
        <div>
          <h1 className="text-2xl font-bold mb-4">Managers</h1>
          {managers && (
            <div className="flex justify-center">
              <Table
                className=" mx-auto table-auto text-center items-center "
                style={{ width: "95%" }}
              >
                <thead
                  className="bg-gray-600 text-gray-100"
                  style={{ backgroundColor: "#173119f1" }}
                >
                  <tr>
                    <th className="px-4 py-2">Username</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Credits</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => (
                    <tr key={manager.user}>
                      <td className="border px-4 py-2">{manager.user}</td>
                      <td className="border px-4 py-2">{manager.name}</td>
                      <td className="border px-4 py-2">{manager.credits}</td>
                      <td className="border px-4 py-2">
                        <button
                          className=" newbtn font-bold"
                          style={{
                            width: "9.5rem",
                            marginBottom: "0.5rem",
                            height: "2.5rem",
                          }}
                          onClick={() => handleUpdateCredits(manager.user)}
                        >
                          Update Credits
                        </button>
                        <br />
                        <button
                          className=" newbtn1 font-bold"
                          style={{
                            width: "9.5rem",
                            marginBottom: "0.5rem",
                            height: "2.5rem",
                          }}
                          onClick={() => {
                            handleDeleteManager(manager.user);
                          }}
                        >
                          Delete Manager
                        </button>
                        <br />
                        <button
                          className="newbtn font-bold"
                          style={{
                            width: "9.5rem",
                            marginBottom: "0.5rem",
                            height: "2.5rem",
                          }}
                          onClick={() => {
                            localStorage.setItem("manager", manager.user);
                            navigate(
                              `/admin/getquizzes/?manager=${manager.user}`
                            );
                          }}
                        >
                          Get Quizzes
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex flex-wrap mt-3 pt-1 mb-1">
          <button
            className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl "
            style={{ width: "29rem" }}
            onClick={() => navigate("/admin/register")}
          >
            Register New Manager
          </button>
        </div>

        <button
          className="bg-green-900 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-xl"
          style={{ width: "29rem" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </section>
    </div>
  );
};

export default Admin;
