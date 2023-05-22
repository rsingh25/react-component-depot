import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";

import routes from "../routes";
import PageNotFound from "../pages/PageNotFound";
import Home from "../pages/Home";

const AuthorizedRoutes = () => {

    const [authorities, setAuthorities] = useState([]);
    const auth = useSelector( state => state.auth)

    useEffect(() => {
        setAuthorities(auth.account.authorities);
    }, [auth]);

    const hasAuthority = (userAuth) => {
        return authorities.includes(userAuth)
    }
    
    return   (
        <Switch>
            {routes
                .filter( r => hasAuthority(r.authority))
                .map((route) => (
                    <Route path={route.path} component={route.component} key={route.path}  />
                 ))}

                <Route path="/" exact>
                    <Home />
                </Route>
                <Route>
                    <PageNotFound />
                </Route>
        </Switch>
    );
};

export default AuthorizedRoutes;
