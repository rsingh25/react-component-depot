import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../generic-table";

const AttendanceTable = () => {

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Emp Code", field: "empCode", sortable: true, editOnAdd: true },
        { name: "Att Date", field: "attDate", sortable: true, type: "date" },
        { name: "In time", field: "inTime", sortable: false, type: "datetime-local", editOnUpdate: true, editOnAdd: true},
        { name: "Out time", field: "outTime", sortable: false, type: "datetime-local", editOnUpdate: true, editOnAdd: true},
        { name: "Cal Duration", field: "calcDurationInMin", sortable: false },
        { name: "Shift", field: "shift", sortable: false },
        { name: "OT", field: "calcOverTimeDurationinMin", sortable: false },
        { name: "status", field: "attStatus", sortable: false },
        { name: "notes", field: "notes", sortable: false }
    ];

    const onSearch = (row, searchStr) => {
        return (row.empCode && row.empCode.toLowerCase().includes(searchStr.toLowerCase())) 
        || (row.attStatus && row.attStatus.toLowerCase().includes(searchStr.toLowerCase()))
        || (row.notes && row.notes.toLowerCase().includes(searchStr.toLowerCase()))
    }

    const rowInitVal = { empCode: "", inTime: "", outTime: "" };
    const rowIsValid = (inputs) => {
        return inputs.empCode && inputs.inTime && inputs.outTime && new Date(inputs.outTime) > new Date(inputs.inTime);
    }

    return (
        <GenericTable url="/api/emp-attendances" headers={headers} onSearch={onSearch} rowInitVal={rowInitVal} rowIsValid={rowIsValid}/> 
    );
};

export default AttendanceTable;
