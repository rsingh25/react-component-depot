import React, { Suspense, useEffect } from "react";
import "components/FontawsomeIcons";

import "./App.css";
import "./dark.css";

import Layout from "pages/_layouts/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import routes from "routes";
import PageNotFound from "pages/PageNotFound";
import Home from "pages/Home";
import AuthorizedRoutes from "everest/autorized-roules";

function App() {
    return (
        <Router>
            <Layout>
                <Suspense fallback={<div>Loading...</div>}>
                    <AuthorizedRoutes />
                </Suspense>
            </Layout>
        </Router>
    );
}

export default App;
