import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const UpdateParticipant = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axiosPrivate.post("/participate/updatedetails", {
        name,
        phone,
        age,
        sex,
        encryptedQuizId: localStorage.getItem("quizid"),
        encryptedParticipantEmail: localStorage.getItem("participantEmail"),
      });

      if (response.data.message) {
        setSuccess(response.data.message);
        setError("");
        // Reset form fields after successful submission
        setName("");
        setPhone("");
        setAge("");
        setSex("");
      }
    } catch (err) {
      if (err?.response?.data?.message) {
        setError(err.response.data.message);
        setSuccess("");
      } else {
        setError("Something went wrong. Please try again.");
        setSuccess("");
      }
    }
  };

  return (
    <section className="bg-white  flex items-center justify-center py-12  px-4 sm:px-6 lg:px-8 text-black lg:w-3/6">
      <div className="max-w-md   space-y-8 p-2 rounded-lg">
        <h1 className="lg:text-2xl font-bold text-center">
          Update Participant Details
        </h1>
        <form onSubmit={handleSubmit} className="mt-3 mb-3">
          <div className="form-group m-1">
            <label htmlFor="name" className="text-black mr-4">
              Name:
            </label>
            <input
              type="text"
              id="name"
              className="form-control text-black border-black border-2 lg:w-64 h-1/2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "65%" }}
            />
          </div>
          <div className="form-group m-1">
            <label htmlFor="phone" className="text-black mr-4">
              Phone:
            </label>
            <input
              type="text"
              id="phone"
              className="form-control text-black border-black border-2 h-1/2"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ width: "65%" }}
            />
          </div>
          <div className="form-group m-1 px-3 text-black mb-4">
            <label htmlFor="age" className="text-black mr-4">
              Age:
            </label>
            <input
              type="number"
              id="age"
              className="form-control text-black border-black border-2 pl-3 h-1/2 "
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ width: "65%" }}
            />
          </div>
          <div className="form-group m-1 px-4 mb-3 ">
            <label htmlFor="sex" className="text-black p-4">
              Sex:
            </label>
            <select
              id="sex"
              className="form-control text-black border-black border-2"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              style={{ width: "60%" }}
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            className={`newbtn ${
              !name || !phone || !age || !sex
                ? "bg-gray-300 cursor-not-allowed"
                : ""
            }`}
            style={{ width: "90%", marginTop: "1rem" }}
            disabled={!name || !phone || !age || !sex}
          >
            Update
          </button>
        </form>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && navigate("/quiz/start")}
      </div>
    </section>
  );
};

export default UpdateParticipant;
