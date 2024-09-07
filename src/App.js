import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import Manager from "./components/Manager";
import Admin from "./components/Admin";
import Missing from "./components/Missing";
import Unauthorized from "./components/Unauthorized";
import Lounge from "./components/Lounge";
import LinkPage from "./components/LinkPage";
import RequireAuth from "./components/RequireAuth";
import PersistLogin from "./components/PersistLogin";
import { Routes, Route } from "react-router-dom";
import CreateQuiz from "./components/Manger/CreateQuiz";
import ViewCredits from "./components/Manger/viewCredits";
import ViewQuizzes from "./components/Manger/ViewQuizes";
import AddParticipant from "./components/Manger/AddParticipant";
import QuizDetails from "./components/Manger/QuizDetails";
import RemoveParticipant from "./components/Manger/RemoveParticipant";
import SetQuizStatus from "./components/Manger/SetQuizStatus";
import ViewParticipantUrl from "./components/Manger/ViewParticipantUrl";
import SendUrl from "./components/Manger/sendUrl";
import RegisterManager from "./components/Admin/registerManager";
import GetQuizzes from "./components/Admin/GetQuizzes";
import ResetPassword from "./components/ResetPassword";
import QuizPage from "./components/Quiz/QuizHome";
import UpdateParticipant from "./components/Quiz/UpdateParticipant";
import StartQuiz from "./components/Quiz/Quiz";
import ThankYouPage from "./components/Quiz/ThankYou";
import ViewResponse from "./components/Manger/ViewResponse";
import SendResponse from "./components/Manger/sendResponse";
import GetQuizOfManager from "./components/Admin/GetQuizOfManager";
import LoadingPage from "./components/Quiz/LoadingPage";
import DeleteQuiz from "./components/Manger/DeleteQuiz";
import RegisterParticipant from "./components/Participant/RegisterParticipant";
const ROLES = {
  User: 2001,
  Manager: 1984,
  Admin: 5150,
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        {/* <Route path="register" element={<Register />} />*/}
        <Route path="linkpage" element={<LinkPage />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="resetpassword" element={<ResetPassword />} />
        <Route path="register" element={<RegisterParticipant />} />

        {/* routes for quiz */}
        <Route path="quiz" element={<QuizPage />} />
        <Route path="/quiz/loading" element={<LoadingPage />} />
        <Route path="/quiz/updateparticipant" element={<UpdateParticipant />} />
        <Route path="/quiz/start" element={<StartQuiz />} />
        <Route path="/quiz/thankyou" element={<ThankYouPage />} />

        {/* we want to protect these routes */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
            <Route path="/" element={<Home />} />
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
            }
          >
            <Route path="manager" element={<Manager />} />
            <Route path="/manager/createquiz" element={<CreateQuiz />} />
            <Route path="/manager/viewcredits" element={<ViewCredits />} />
            <Route path="/manager/viewquizzes" element={<ViewQuizzes />} />
            <Route path="/manager/quizdetails" element={<QuizDetails />} />
            <Route
              path="/manager/addparticipant"
              element={<AddParticipant />}
            />
            <Route
              path="/manager/removeparticipant"
              element={<RemoveParticipant />}
            />
            <Route path="/manager/setquizstatus" element={<SetQuizStatus />} />
            <Route
              path="/manager/viewparticipanturl"
              element={<ViewParticipantUrl />}
            />
            <Route path="/manager/sendparticipanturl" element={<SendUrl />} />
          </Route>
          <Route path="manager/viewresponse" element={<ViewResponse />} />
          <Route path="manager/sendresponse" element={<SendResponse />} />
          <Route path="manager/deletequiz" element={<DeleteQuiz />} />

          <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
            <Route path="admin" element={<Admin />} />
            <Route path="/admin/register" element={<RegisterManager />} />
            <Route path="/admin/getquizzes" element={<GetQuizzes />} />
            <Route path="/admin/getquiz" element={<GetQuizOfManager />} />
            <Route path="/admin/quizdetails" element={<GetQuizOfManager />} />
          </Route>

          <Route
            element={
              <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
            }
          >
            <Route path="lounge" element={<Lounge />} />
          </Route>
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
