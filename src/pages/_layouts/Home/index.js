import React, { useEffect, userState } from "react";
import { Navbar } from "./Navbar";
import { useSelector } from "react-redux";
import routes from "routes";
import { SideNav } from "./SideNav"

import ReactGA from "react-ga";
import { withRouter } from "react-router-dom";
import AppConfig from "App.config";
import { useState } from "react";
import Login from "everest/login";

ReactGA.initialize(AppConfig.GOOGLE.GA_TRACKING_CODE);

const Home = ({ children }) => {
    const isNavbarVisible = useSelector((state) => state.layout.navbar);

    useEffect(() => {
        ReactGA.pageview(window.location.pathname + window.location.search);
    });

    const [sidebarVisible, setSidebarVisible] = useState(true);

    const changeSidebarVisible = () => {
        setSidebarVisible(!sidebarVisible);
    }

    const [userDropDownCollapsed, setUserDropDown] = useState(true);

    const changeUserDropDown = () => {
        setUserDropDown(!userDropDownCollapsed);
    }

    const auth = useSelector(state => state.auth);

    return !auth ? (
        <Login />
    ) : (
        <>
            <div className={sidebarVisible ? "sb-nav-fixed" : "sb-nav-fixed sb-sidenav-toggled"}>
                <nav className="sb-topnav navbar navbar-expand navbar-dark bg-dark">
                    {/* <!-- Navbar Brand--> */}
                    <a className="navbar-brand ps-3" href="index.html">Everest Aluminium</a>
                    {/* <!-- Sidebar Toggle--> */}
                    <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" onClick={changeSidebarVisible}><i className="fas fa-bars"></i></button>
                    {/* <!-- Navbar Search--> */}
                    <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
                        <div className="input-group">
                            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
                            <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
                        </div>
                    </form>
                    {/* <!-- Navbar--> */}
                    <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
                        <li className="nav-item dropdown">
                            <a className={"nav-link dropdown-toggle" + (userDropDownCollapsed ? "" : " show")} id="navbarDropdown" onClick={changeUserDropDown} role="button" data-bs-toggle="dropdown" aria-expanded={!userDropDownCollapsed}><i className="fas fa-user fa-fw"></i></a>
                            <ul className={"dropdown-menu dropdown-menu-end" + (userDropDownCollapsed ? "" : " show")} aria-labelledby="navbarDropdown" data-bs-popper={userDropDownCollapsed ? "" : "static"}>
                                <li><a className="dropdown-item" href="#!">Login</a></li>
                                <li><a className="dropdown-item" href="#!">Activity Log</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#!">Logout</a></li>
                            </ul>
                        </li>
                    </ul>
                </nav>
                <div id="layoutSidenav">
                    <div id="layoutSidenav_nav">
                        <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
                            <div className="sb-sidenav-menu">
                                <div className="nav">
                                    <div className="sb-sidenav-menu-heading">Core</div>
                                    <a className="nav-link" href="index.html">
                                        <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                                        Dashboard
                                    </a>
                                    <div className="sb-sidenav-menu-heading">Interface</div>

                                    {routes
                                        .filter((route) => route.navbar !== "")
                                        .map((route, index) => {
                                            //If has child, render sub list
                                            return (
                                                <SideNav key={index} route={route} index={index} />
                                            )
                                        })}

                                </div>
                            </div>
                            <div className="sb-sidenav-footer">
                                <div className="small">Logged in as:</div>
                                Raghvi Enterprise
                            </div>
                        </nav>
                    </div>
                    <div id="layoutSidenav_content">
                        <main>{children}</main>

                        <footer className="py-4 bg-light mt-auto">
                            <div className="container-fluid px-4">
                                <div className="d-flex align-items-center justify-content-between small">
                                    <div className="text-muted">Copyright &copy; Your Website 2023</div>
                                    <div>
                                        <a href="#">Privacy Policy</a>
                                        &middot;
                                        <a href="#">Terms &amp; Conditions</a>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>

            {/* <div className="sb-nav-fixed">
                <Navbar />

                <div id="content" className={!isNavbarVisible ? "active" : ""}>
                    {process.env.NODE_ENV === "production" && <div className="user-notification">
                        If you like my work, please support by{" "}
                        <a href="https://www.youtube.com/channel/UCdItDI6oTgPW7l9WOJI7ItA/?sub_confirmation=1">
                            🔔 subscribing to my youtube channel
                        </a>{" "}
                        and give a{" "}
                        <a href="https://github.com/codegeous/react-component-depot">
                            ⭐ star on github
                        </a>
                    </div>}

                    {children}
                </div>
                <YoutubePlayer />
            </div>

            <a
                href="https://github.com/codegeous/react-component-depot"
                target="_blank"
            >
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 250 250"
                    style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        border: "0",
                        width: "60px",
                        height: "60px",
                        zIndex: 1005,
                    }}
                    className="github-corner"
                >
                    <path
                        fill="#999"
                        className="github-corner__bg"
                        d="M0 0l115 115h15l12 27 108 108V0z"
                    ></path>
                    <path
                        className="octo-arm"
                        fill="#fff"
                        d="M128 109c-15-9-9-19-9-19 3-7 2-11 2-11-1-7 3-2 3-2 4 5 2 11 2 11-3 10 5 15 9 16"
                    ></path>
                    <path
                        className="octo-body"
                        fill="#fff"
                        d="M115 115s4 2 5 0l14-14c3-2 6-3 8-3-8-11-15-24 2-41 5-5 10-7 16-7 1-2 3-7 12-11 0 0 5 3 7 16 4 2 8 5 12 9s7 8 9 12c14 3 17 7 17 7-4 8-9 11-11 11 0 6-2 11-7 16-16 16-30 10-41 2 0 3-1 7-5 11l-12 11c-1 1 1 5 1 5z"
                    ></path>
                </svg>
            </a> */}
        </>
    );
};

export default withRouter(Home);
