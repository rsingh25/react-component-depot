import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import {baseServer} from "../axios-config";
import {toIsoString} from "../util";

const AddAttendance = ({ onClose, data }) => {

    const [inputs, setInputs] = useState({ empCode: "", inTime: "", outTime: "" });

    useEffect(() => {
        const {id, empCode, inTime, outTime} = data;
        setInputs({id, empCode, inTime, outTime});
    }, []);


    const updateFormValue = ({ target: { name, value } }) =>
        setInputs(inputObj => ({ ...inputObj, [name]: value }));

    const addAttendance = () => {
        console.log(inputs);
        //IST time in ISO format
        inputs.inTime = toIsoString(inputs.inTime);
        inputs.outTime = toIsoString(inputs.outTime);
        
        const addDataAync = async () => {
            try {
                if (inputs.id) {
                    await baseServer.patch(`/api/emp-attendances/${inputs.id}`, inputs);
                } else {
                    await baseServer.post("/api/emp-attendances", inputs);
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
                <Modal.Title>Add/Edit Attendance</Modal.Title>
            </Modal.Header>
            <Modal.Body id="add-attendane-modal">
                <form> 
                    { inputs.id && 
                    <div className="form-group">
                        <label>Id</label>
                        <input
                            type="text"
                            className="form-control"
                            value={inputs.id}
                            name="id"
                            readOnly={true}
                        />
                        </div>

                    }
                    <div className="form-group">
                        <label>Emp Code</label>
                        <input
                            type="text"
                            className="form-control"
                            value={inputs.empCode}
                            name="empCode"
                            onChange={e => updateFormValue(e)}
                            readOnly={inputs.id ? true: false}
                        />
                    </div>
                    <div className="form-group">
                        <label>In Time</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={inputs.inTime ? toIsoString(inputs.inTime).substring(0, 16)  :""}
                            name="inTime"
                            onChange={e => updateFormValue(e)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Out Time</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            value={inputs.outTime ? toIsoString(inputs.outTime).substring(0, 16)  :""}
                            name="outTime"
                            onChange={e => updateFormValue(e)}
                        />
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>Close</Button>
                <Button variant="primary" onClick={addAttendance} disabled={!(inputs.inTime && inputs.outTime && new Date(inputs.outTime) > new Date(inputs.inTime))}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default AddAttendance;
