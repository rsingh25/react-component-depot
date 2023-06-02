import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

const AttendanceTable = React.lazy(() => import("./attendance-table2"));
const SalaryAdjTable = React.lazy(() => import("./salary-adj-table"));
const HolidayTable = React.lazy(() => import("./holiday-table"));
const EmpTable = React.lazy(() => import("./employee-list"));
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
      <Route path={`${path}/salary-adj-list`} component={SalaryAdjTable} />
      <Route path={`${path}/holiday-list`} component={HolidayTable} />
      <Route path={`${path}/emp-list`} component={EmpTable} />
    </Switch>
  );
};

export default Attendance;
