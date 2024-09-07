import { Link } from "react-router-dom";

const LinkPage = () => {
  return (
    <section style={{ backgroundColor: "#262323" }} className="text-white">
      <h1 className="font-bold">Links</h1>
      <br />
      <h2>
        <u>Public</u>
      </h2>
      <Link to="/login">
        <p>Login</p>
      </Link>
      <Link to="/register">
        <p>Register</p>
      </Link>
      <br />
      <h2>
        <u>Private</u>
      </h2>
      <Link to="/">Home</Link>
      <Link to="/editor">Editors Page</Link>
      <Link to="/admin">Admin Page</Link>
    </section>
  );
};

export default LinkPage;
