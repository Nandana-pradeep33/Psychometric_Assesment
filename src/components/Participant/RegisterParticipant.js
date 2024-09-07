import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import axios from "axios";

const RegisterParticipant = () => {
  const axiosPrivate = useAxiosPrivate();

  const [quizcode, setQuizcode] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState(0);
  const [sex, setSex] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:3500/api/participate/register",
        {
          code: quizcode,
          email,
          name,
          phone,
          age,
          sex,
        }
      );
      if (response.data.message) {
        setSuccess(response.data.message);
        setError("");
        setQuizcode(0);
        setEmail("");
        setName("");
        setPhone("");
        setAge(0);
        setSex("");
      }
    } catch (err) {
      if (err?.response?.data?.error) {
        setError(err.response.data.error);
        setSuccess("");
      } else {
        setError("Something went wrong. Please try again.");
        setSuccess("");
      }
    }
    setLoading(false);
  };

  return (
    <section className="bg-white flex items-center justify-center py-9 sm:py-9 px-4 sm:px-1 lg:px-8 text-black lg:w-3/6 ">
      <div className="max-w-md   space-y-8  rounded-lg">
        <h1 className="lg:text-2xl mt-2 font-bold text-center">
          Register Participant Details
        </h1>
        <form onSubmit={handleSubmit} className="mt-3 mb-2">
          <div className="form-group m-1">
            <label
              htmlFor="name"
              className="text-black mr-5 lg:mr-5"
              style={{ fontSize: "20px", marginRight: "1.18rem" }}
            >
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

          <div className="form-group m-1 ">
            <label
              htmlFor="email"
              className="text-black mr-5 lg:mr-5"
              style={{ fontSize: "20px", marginRight: "1.3rem" }}
            >
              Email:
            </label>
            <input
              type="text"
              id="email"
              className="form-control text-black border-black border-2 lg:w-64 h-1/2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: "65%" }}
            />
          </div>

          <div className="form-group m-1">
            <label
              htmlFor="phone"
              className="text-black mr-4 lg:mr-5"
              style={{ fontSize: "20px", marginRight: "0.96rem" }}
            >
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

          <div className="form-group m-1 px-1 text-black mb-1">
            <label
              htmlFor="age"
              className="text-black mr-4 lg:mr-5"
              style={{ fontSize: "20px", marginRight: "1.6rem" }}
            >
              Age:
            </label>
            <input
              type="number"
              id="age"
              className="form-control text-black border-black border-2 pl-3 h-1/2 "
              value={age}
              onChange={(e) => setAge(e.target.value)}
              style={{ width: "64%" }}
            />
          </div>
          <div
            className="form-group  mr-5 mb-4"
            style={{ marginRight: "0.9rem", marginTop: "0.2rem" }}
          >
            <label
              htmlFor="quizcode"
              className="text-black  mr-1 "
              style={{ fontSize: "20px" }}
            >
              QuizCode:
            </label>
            <input
              type="number"
              id="quizcode"
              className="form-control mr-5  text-black border-black border-2 h-1/2"
              value={quizcode}
              onChange={(e) => setQuizcode(e.target.value)}
              style={{ width: "64%" }}
            />
          </div>
          <div className="form-group m-1  mb-3 mr-5 ">
            <label
              htmlFor="sex"
              className="text-black p-2 mr-4 "
              style={{ fontSize: "20px" }}
            >
              Sex:
            </label>
            <select
              id="sex"
              className="form-control text-black border-black border-2"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              style={{ width: "60%", fontSize: "20px" }}
            >
              <option value="">Select Sex</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="text-center flex items-center justify-center mt-4 ">
            <button
              type="submit"
              className={`newbtn ${
                !name || !phone || !age || !sex
                  ? " cursor-not-allowed via-red-400"
                  : ""
              }`}
              style={{ width: "90%", marginTop: "1rem" }}
              disabled={!name || !phone || !age || !sex || !quizcode}
            >
              Register
            </button>
          </div>
        </form>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}
        {loading && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Please wait...
          </div>
        )}
      </div>
    </section>
  );
};

export default RegisterParticipant;
