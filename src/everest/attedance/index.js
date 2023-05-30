import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const AttendanceTable = React.lazy(() => import("./attendance-table"));
const BiometricFileUpload = React.lazy(() => import("./biometric-file-upload"));
const AddAttendance = React.lazy(() => import("./add-attendance"));

const Attendance = () => {
  let { path } = useRouteMatch();
  return (
    <Switch>
      <Route path={`${path}/upload-biometric`} component={BiometricFileUpload} />
      <Route path={`${path}/list`} component={AttendanceTable} />
      <Route path={`${path}/add`} component={AddAttendance} />
      <Route path={`${path}/update`} component={AddAttendance} />
    </Switch>
  );
};

export default Attendance;
