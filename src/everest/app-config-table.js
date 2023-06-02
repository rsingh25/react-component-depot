import React from "react";
import GenericTable from "./generic-table";

const AppConfigTable = () => {

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Key", field: "configKey", sortable: true, editOnUpdate: true, editOnAdd: true },
        { name: "Description", field: "configDesc", editOnUpdate: true, editOnAdd: true },
        { name: "Value", field: "configValue", editOnUpdate: true, editOnAdd: true },
        { name: "Value Type", field: "configValueType", editOnUpdate: true, editOnAdd: true },
    ];

    const onSearch = (row, searchStr) => {
        return (row.configKey && row.configKey.toLowerCase().includes(searchStr.toLowerCase())) 
        || (row.configDesc && row.configDesc.toLowerCase().includes(searchStr.toLowerCase()))
    }

    const rowInitVal = { key: "", desc: "", value: "", valueType: "" };
    const rowIsValid = (inputs) => {
        return inputs.configKey && inputs.configDesc && inputs.configValue && inputs.configValueType;
    }

    return (
        <GenericTable url="/api/app-configs" headers={headers} onSearch={onSearch} rowInitVal={rowInitVal} rowIsValid={rowIsValid}/> 
    );
};

export default AppConfigTable;
