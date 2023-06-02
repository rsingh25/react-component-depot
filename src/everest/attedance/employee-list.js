import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../generic-table";

const EmpTable = () => {

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Emp Code", field: "empCode", sortable: true, editOnAdd: true },
        { name: "Name", field: "name", sortable: true, editOnUpdate: true, editOnAdd: true },
        { name: "Active", field: "active", type: "boolean", sortable: false, editOnUpdate: true, editOnAdd: true},
        { name: "Salary On Hold", field: "salaryOnHold", type: "boolean", sortable: false, editOnUpdate: true, editOnAdd: true},
    ];

    const onSearch = (row, searchStr) => {
        return (row.empCode && row.empCode.toLowerCase().includes(searchStr.toLowerCase())) 
        || (row.name && row.name.toLowerCase().includes(searchStr.toLowerCase()))
    }

    const rowInitVal = { empCode: "", name: "", active: true, salaryOnHold: false };
    const rowIsValid = (inputs) => {
        return inputs.empCode && inputs.name;
    }

    return (
        <GenericTable url="/api/emps" headers={headers} onSearch={onSearch} rowInitVal={rowInitVal} rowIsValid={rowIsValid}/> 
    );
};

export default EmpTable;
