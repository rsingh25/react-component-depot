import React, { useEffect, useState, useMemo } from "react";
import GenericTable from "../generic-table";

const HolidayTable = () => {

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Holiday Date", field: "holidayDate", type: "date", sortable: true, editOnUpdate: true, editOnAdd: true },
        { name: "occasion", field: "occasion", sortable: false, editOnUpdate: true, editOnAdd: true },
    ];

    const onSearch = (row, searchStr) => {
        return (row.occasion && row.occasion.toLowerCase().includes(searchStr.toLowerCase())) 
    }

    const rowInitVal = { occasion: "", holidayDate: "" };
    const rowIsValid = (inputs) => {
        return inputs.occasion && inputs.holidayDate;
    }

    return (
        <GenericTable url="/api/holidays" headers={headers} onSearch={onSearch} rowInitVal={rowInitVal} rowIsValid={rowIsValid}/> 
    );
};

export default HolidayTable;
