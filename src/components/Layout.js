import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  const excludeNavbarPaths = [
    "/quiz/updateparticipant",
    "/quiz/start",
    "/quiz/thankyou",
    "/quiz",
    "/quiz/loading",
    "/quiz/",
    "/admin",
    "/manager",
  ]; // Replace with your excluded paths

  if (excludeNavbarPaths.includes(location.pathname)) {
    return (
      <main className="App">
        <Outlet />
      </main>
    );
  }

  return (
    <main className="App">
      <Navbar />
      <Outlet />
    </main>
  );
};

export default Layout;
