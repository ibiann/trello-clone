import React from "react";
import logo from '../../assets/img/svg/logo.svg';
import hero from '../../assets/img/svg/hero.svg'

const Home = () => {
  return (
    <div className="home-container">
      <div className="container-fuilt" style={{ margin: "35px" }}>
        <div
          className="header"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <div className="header-top-life" style={{ display: "flex" }}>
            <img
              style={{ display: "flex", width: "60px", alignItems: "center" }}
              src={logo}
            />
            <h2 style={{ alignItems: "center"}}>Trello</h2>
          </div>
          <div className="header-top-right">
            <div className="">
              <a href="/login">Log in</a>
              <button
                className="btn btn-primary"
                type="submit"
                style={{ marginLeft: "15px" }}
              >
                <a
                  href="/register"
                  target="_self"
                  rel="noopener noreferrer"
                  style={{ color: "white" }}
                >
                  Sign up
                </a>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row" style={{ display: "flex", marginTop: "200px" }}>
          <div className="col-6">
            <h1>Trello helps teams move work forward.</h1>
            <p>
              Collaborate, manage projects, and reach new productivity peaks.{" "}
              <br />
              From hight rises to the home office, the way your team works is{" "}
              <br />
              unique --- accomplish it all with Trello
            </p>
            <button
              className="btn btn-primary"
              style={{ float: "right", marginRight: "16%" }}
            >
              <a
                href="/register"
                target="_self"
                rel="noopener noreferrer"
                style={{ color: "white" }}
              >
                Sign up - it's free
              </a>
            </button>
          </div>
          <div className="col-6">
            <img
              style={{ width: "400px" }}
              src={hero}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
