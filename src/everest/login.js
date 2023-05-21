import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header"
import { TableHeader, Pagination, Search } from "../components/DataTable";
import useFullPageLoader from "../hooks/useFullPageLoader";
import ExternalInfo from "../components/ExternalInfo";
import AppConfig from "App.config";
import { useDispatch } from "react-redux";
import { getAcctAxn } from "./redux/auth";
import fetcher from "./fetcher";

const Login = () => {
    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const doLogin = async () => {
        showLoader();
        const authResp = await fetch("http://localhost:8080/api/authenticate", {
            Method: 'POST',
            Body: {username, password,"rememberMe":false}}
        );
        const authRespJson = await authResp.json();
        if (authResp.ok) {
           sessionStorage.setItem("jwt", authRespJson["id_token"]); //required only for remember my to store on localStorage
           const userAcctResp = await fetcher("http://localhost:8080/api/account");
           const userAcctRespJson = await userAcctResp.json();
           if (authResp.ok) {
                dispatch(getAcctAxn(userAcctRespJson));
           } else {
                setErr("Failed to fetch roles")
           }

        } else {
            setErr("Failed to Login")
        }
        hideLoader();
    };

    return (
        <>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-5">
                    <div className="card shadow-lg border-0 rounded-lg mt-5">
                        <div className="card-header"><h3 className="text-center font-weight-light my-4">Login</h3></div>
                        <div className="card-body">
                            <form>
                                <div className="form-floating mb-3">
                                    <input className="form-control" id="inputEmail" type="email" placeholder="name@example.com" value={username} onChange={(e) => setUsername(e.target.value)} />
                                    <label htmlFor="inputEmail">Email address</label>
                                </div>
                                <div className="form-floating mb-3">
                                    <input className="form-control" id="inputPassword" type="password" placeholder="Password"  value={password} onChange={(e) => setPassword(e.target.value)} />
                                    <label htmlFor="inputPassword">Password</label>
                                </div>
{/*                                 <div className="form-check mb-3">
                                    <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                    <label className="form-check-label" htmlFor="inputRememberPassword">Remember Password</label>
                                </div>
 */}                                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                    <a className="small" href="password.html">Forgot Password?</a>
                                    <a className="btn btn-primary" onClick={doLogin} >Login</a>
                                </div>
                            </form>
                        </div>
{/*                         <div className="card-footer text-center py-3">
                            <div className="small"><a href="register.html">Need an account? Sign up!</a></div>
                        </div>
 */}                    </div>
                </div>
            </div>
        </div>
        {loader}
        </>
    );
}

export default Login;
