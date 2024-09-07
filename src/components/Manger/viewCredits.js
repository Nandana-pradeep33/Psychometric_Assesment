import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const ViewCredits = () => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);

    try {
      const response = await axiosPrivate.get("/manager/credits");

      setSuccess(true);
      setCredits(response?.data?.credits);
    } catch (err) {
      console.error(err);
      setErrMsg(err?.response?.data?.message || err?.message);
    }
  };

  return (
    <section className="p-8">
      <h1 className="text-3xl font-bold mb-4">View Credits</h1>

      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        View Credits
      </button>

      {errMsg && (
        <div className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</div>
      )}
      {success && (
        <div className="bg-green-100 text-green-700 py-2 px-4 mb-4">
          Credits: {credits}
        </div>
      )}

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate("/manager")}
      >
        Back
      </button>
    </section>
  );
};

export default ViewCredits;
