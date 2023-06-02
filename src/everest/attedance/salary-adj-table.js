import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../generic-table";

const SalaryAdjTable = () => {

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Emp Code", field: "empCode", sortable: true, editOnAdd: true },
        { name: "Payment Month", field: "paymentMon", sortable: true, editOnUpdate: true, editOnAdd: true },
        { name: "Adjustment Type", field: "type", sortable: false, editOnUpdate: true, editOnAdd: true},
        { name: "Amount", field: "amount", type: "number", sortable: false, editOnUpdate: true, editOnAdd: true},
        { name: "Source", field: "source", sortable: false, editOnUpdate: true, editOnAdd: true },
        { name: "Paid Status", field: "paidStatus", sortable: false},
    ];

    const onSearch = (row, searchStr) => {
        return (row.empCode && row.empCode.toLowerCase().includes(searchStr.toLowerCase())) 
        || (row.type && row.type.toLowerCase().includes(searchStr.toLowerCase()))
        || (row.paymentMon && row.paymentMon.toLowerCase().includes(searchStr.toLowerCase()))
    }

    const rowInitVal = { empCode: "", paymentMon: "", amount: 0 };
    const rowIsValid = (inputs) => {
        return inputs.empCode && inputs.amount && inputs.type && inputs.paymentMon && inputs.amount;
    }

    return (
        <GenericTable url="/api/emp-salary-adjs" headers={headers} onSearch={onSearch} rowInitVal={rowInitVal} rowIsValid={rowIsValid}/> 
    );
};

export default SalaryAdjTable;
