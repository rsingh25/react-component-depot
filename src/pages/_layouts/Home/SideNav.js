import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, NavLink, useLocation } from "react-router-dom";
import routes from "routes";
import { Scrollbars } from "react-custom-scrollbars";
import useThemeSwitcher from "hooks/useThemeSwitcher";
import ReactGA from "react-ga";

export const SideNav = ({route, index}) => {

    const [collapse, setCollapse] = useState(true);

    const click = () => {
        setCollapse(!collapse);
    }

    const location = useLocation();
    
    const getNavLinkClass = (path) => {
        return location.pathname === path ? "active" : "";
    };

    return route.child ? (
        <>
            <a className={"nav-link" + (collapse ? " collapsed" : "")} onClick={click} data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded={!collapse} aria-controls="collapseLayouts">
                <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                {route.navbar}
                <div className="sb-sidenav-collapse-arrow"><i className="fas fa-angle-down"></i></div>
            </a>
            <div className={"collapse" + (collapse ? "" : " show")} id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                <nav className="sb-sidenav-menu-nested nav">
                    {route.child.map((child, idx) => {
                        return (
                            <li
                                key={idx}
                                className={getNavLinkClass(
                                    child.path
                                )}
                            >
                                <NavLink
                                    to={child.path}
                                    className="nav-link"
                                >
                                    {child.name}
                                </NavLink>
                            </li>
                        );
                    })}

                    {/* <a className="nav-link" href="layout-static.html">Static Navigation</a>
                    <a className="nav-link" href="layout-sidenav-light.html">Light Sidenav</a> */}
                </nav>
            </div>

        </>
    )  : (
        <li
            key={index}
            className={getNavLinkClass(route.path)}
        >
            <Link className="nav-link" to={route.path}>{route.navbar}</Link>
        </li>

    );
}




