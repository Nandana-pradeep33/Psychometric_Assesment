import React, { useState } from "react";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const CreateQuiz = () => {
  const [quizname, setQuizname] = useState("");
  const [quiztype, setQuiztype] = useState("face");
  const [creditlimit, setCreditlimit] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const axiosPrivate = useAxiosPrivate();
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccess(false);

    try {
      const response = await axiosPrivate.post(
        "/manager/createquiz",
        JSON.stringify({
          quizname,
          quiztype,
          creditlimit,
        })
      );

      setSuccess(true);
      setQuizname("");
      setQuiztype("");
      setCreditlimit("");
    } catch (err) {
      console.error(err);
      if (err?.response?.status === 400) {
        setErrMsg("Invalid quiz type or insufficient credits");
      } else if (err?.response?.status === 404) {
        setErrMsg("User not found");
      } else if (err?.response?.status === 500) {
        setErrMsg("Failed to create the quiz session due to an internal error");
      } else {
        setErrMsg(err?.response?.data?.message || err?.message);
      }
    }
  };

  return (
    <section className="p-6 lg:w-3/5">
      <h1 className="text-3xl font-bold mb-4">Create Quiz</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label
            htmlFor="quizname"
            className="block text-sm font-semibold mb-1"
          >
            Quiz Name
          </label>
          <input
            type="text"
            id="quizname"
            value={quizname}
            onChange={(e) => setQuizname(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="quiztype"
            className="block text-sm font-semibold mb-1"
          >
            Quiz Type
          </label>
          <input
            type="text"
            id="quiztype"
            value={quiztype}
            onChange={(e) => setQuiztype(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="creditlimit"
            className="block text-sm font-semibold mb-1"
          >
            Credit Limit
          </label>
          <input
            type="text"
            id="creditlimit"
            value={creditlimit}
            onChange={(e) => setCreditlimit(e.target.value)}
            className="border rounded-md py-2 px-3 w-full focus:outline-none focus:border-blue-400"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 newbtn mt-2"
        >
          Create Quiz
        </button>
      </form>
      {errMsg && (
        <p className="bg-red-100 text-red-700 py-2 px-4 mb-4">{errMsg}</p>
      )}
      {success && (
        <p className="bg-green-100 text-green-700 py-2 px-4 mb-3">
          Quiz created successfully.
        </p>
      )}
    </section>
  );
};

export default CreateQuiz;
