import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {baseServer} from "./axios-config";
import {toIsoString} from "./util";

const GenericAddUpdate = ({ onClose, data, rowInitVal, headers, url, rowIsValid }) => {

    const [inputs, setInputs] = useState(rowInitVal);

    useEffect(() => {
        // h.editOnAdd || h.editOnUpdate )
        setInputs(data);
    }, [data]);


    const updateFormValue = ({ target: { name, value } }) =>
        setInputs(inputObj => ({ ...inputObj, [name]: value }));

    const updateDatabase = () => {
        console.log(inputs);
        const insert = !inputs.id;

        //IST time in ISO format
        headers
            .filter(h => (h.editOnAdd || h.editOnUpdate) && h.type && inputs[h.field] && (h.type === "date" || h.type === "datetime-local"))
            .map( h => {
                inputs[h.field] = toIsoString(inputs[h.field]);
            });
        
        const addDataAync = async () => {
            try {
                if (insert) {
                    await baseServer.post(url, inputs);
                } else {
                    await baseServer.patch(`${url}/${inputs.id}`, inputs);
                }
                onClose();
            } catch (err) {
                console.log(err);
            }
        };

        addDataAync()
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add/Edit</Modal.Title>
            </Modal.Header>
            <Modal.Body id="add-attendane-modal">
                <form> 
                    {headers.map( h => {
                        let inputType = h.type? h.type : "text";
                        let val = "";
                        if (inputType === "text") {
                            val = inputs[h.field] ? inputs[h.field] : "" ;
                        } else if (inputType === "date") {
                            val = inputs[h.field] ? toIsoString(inputs[h.field]).substring(0, 10) :"";
                        } else if (inputType === "datetime-local") {
                            val = inputs[h.field] ? toIsoString(inputs[h.field]).substring(0, 16) :"";
                        } else if (inputType === "number") {
                            val = inputs[h.field] ? inputs[h.field] : 0 ;
                        } else if (inputType === "boolean") {
                            val = inputs[h.field] ? inputs[h.field] : false ;
                        }

                        return (
                        <div className="form-group" key={h.field}>
                        <label>{h.name}</label>
                        {inputType === "boolean" && 
                                                <input
                                                type="checkbox"
                                                className="form-control"
                                                checked={val}
                                                name={h.field}
                                                onChange={e => updateFormValue(e)}
                                                readOnly={(inputs.id ? !h.editOnUpdate : !h.editOnAdd)}
                                            />                    
                        }
                        {inputType !== "boolean" && <input
                            type={inputType}
                            className="form-control"
                            value={val}
                            name={h.field}
                            onChange={e => updateFormValue(e)}
                            readOnly={(inputs.id ? !h.editOnUpdate : !h.editOnAdd)}
                        />}
                    </div>
                    )})}

                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={updateDatabase} disabled={!rowIsValid(inputs)}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default GenericAddUpdate;
