import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const SendUrl = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const [url, setUrl] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setUrl(localStorage.getItem("participantUrl"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);
    setLoading(true);
    try {
      const response = await axiosPrivate.post(
        "/manager/sendurl",
        JSON.stringify({ url })
      );
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setLoading(false);
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">Send Participant URL</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-semibold mb-1">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <button type="submit" className=" newbtn" style={{ width: "50%" }}>
          Send URL
        </button>
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 py-2 px-4">
          URL sent successfully
        </p>
      )}
      {loading && (
        <p className="bg-green-100 text-green-700 py-2 px-4">Please wait...</p>
      )}

      <button
        className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={() => navigate("/manager")}
      >
        Back to Dashboard
      </button>
    </section>
  );
};

export default SendUrl;
