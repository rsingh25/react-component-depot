import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Redirect } from 'react-router-dom';
import useFullPageLoader from "../hooks/useFullPageLoader";
import AppConfig from "App.config";
import { useDispatch } from "react-redux";
import { getAcctAxn, getAcct, authAxn } from "./redux/auth";
import { baseServer } from "./axios-config";


const Login = () => {
    const dispatch = useDispatch();
    const location = useLocation();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loader, showLoader, hideLoader] = useFullPageLoader();

    const { from } = (location.state) || { from: { pathname: '/', search: location.search } };

    const doLogin = async () => {
        await showLoader();
        await setAuthToken(username, password);
        //await getAcct();
        await hideLoader();
    };

    const setAuthToken = async (username, password) => {
        try {
            const resp = await baseServer.post("/api/authenticate", { username, password, "rememberMe": false });
            sessionStorage.setItem("jwt", resp.data["id_token"]); //required only for remember my to store on localStorage
            dispatch(authAxn())
        } catch (err) {
            console.log(err);
        }
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
                                        <input className="form-control" id="username" type="text" placeholder="name@example.com" value={username} onChange={(e) => setUsername(e.target.value)} />
                                        <label htmlFor="username">User Name</label>
                                    </div>
                                    <div className="form-floating mb-3">
                                        <input className="form-control" id="inputPassword" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        <label htmlFor="inputPassword">Password</label>
                                    </div>
                                    {/*                                 <div className="form-check mb-3">
                                    <input className="form-check-input" id="inputRememberPassword" type="checkbox" value="" />
                                    <label className="form-check-label" htmlFor="inputRememberPassword">Remember Password</label>
                                </div>
 */}                                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                                        {/* <a className="small" href="password.html">Forgot Password?</a> */}
                                        <a className="btn btn-primary" type="submit" onClick={doLogin} >Login</a>
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
