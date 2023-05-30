import React, { useState, useRef } from "react";
import axios, { CancelToken, isCancel } from "axios";
import { ProgressBar } from "react-bootstrap";
import AppConfig from "App.config";
import {baseServer} from "../axios-config";

const BiometricFileUpload = () => {
    const [uploadPercentage, setUploadPercentage] = useState(0);
    const cancelFileUpload = useRef(null);
    const[inFile, setInFile] = useState();
    const[outFile, setOutFile] = useState();

    const inFileChange = ({ target: { files } }) => {
        setInFile(files[0]);
    }

    const outFileChange = ({ target: { files } }) => {
        setOutFile(files[0]);
    }

    const uploadFile = ({ target: { files } }) => {
        let data = new FormData();
        data.append("inFile", inFile);
        data.append("outFile", outFile);

        const options = {
            onUploadProgress: progressEvent => {
                const { loaded, total } = progressEvent;

                let percent = Math.floor((loaded * 100) / total);

                if (percent < 100) {
                    setUploadPercentage(percent);
                }
            },
            cancelToken: new CancelToken(
                cancel => (cancelFileUpload.current = cancel)
            )
        };

        baseServer
            .post("/api/uploadBiometric/mon1",
                data,
                options
            )
            .then(res => {
                console.log(res);
                setUploadPercentage(100);

                setTimeout(() => {
                    setUploadPercentage(0);
                }, 1000);
            })
            .catch(err => {
                console.log(err);

                if (isCancel(err)) {
                    alert(err.message);
                }
                setUploadPercentage(0);
            });
    };

    const cancelUpload = () => {
        if (cancelFileUpload.current)
            cancelFileUpload.current("User has canceled the file upload.");
    };

    return (
        <>

            <div className="row justify-content-center bg-light">
                <div className="col-md-6 text-center">

                    <p>
                        <input
                            type="file"
                            className="form-control-file"
                            onChange={inFileChange}
                        />
                    </p>
                    {uploadPercentage > 0 && (
                        <div className="row mt-3">
                            <div className="col pt-1">
                                <ProgressBar
                                    now={uploadPercentage}
                                    striped={true}
                                    label={`${uploadPercentage}%`}
                                />
                            </div>
                            <div className="col-auto">
                                <span
                                    className="text-primary cursor-pointer"
                                    onClick={() => cancelUpload()}
                                >
                                    Cancel
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="row justify-content-center bg-light">
                <div className="col-md-6 text-center">

                    <p>
                        <input
                            type="file"
                            className="form-control-file"
                            onChange={outFileChange}
                        />
                    </p>
                    {uploadPercentage > 0 && (
                        <div className="row mt-3">
                            <div className="col pt-1">
                                <ProgressBar
                                    now={uploadPercentage}
                                    striped={true}
                                    label={`${uploadPercentage}%`}
                                />
                            </div>
                            <div className="col-auto">
                                <span
                                    className="text-primary cursor-pointer"
                                    onClick={() => cancelUpload()}
                                >
                                    Cancel
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="row justify-content-center bg-light">
                <div className="col-md-6 text-center">

                    <p>
                        <input
                            type="submit"
                            className="form-control-file"
                            onClick={uploadFile}
                        />
                    </p>
                    {uploadPercentage > 0 && (
                        <div className="row mt-3">
                            <div className="col pt-1">
                                <ProgressBar
                                    now={uploadPercentage}
                                    striped={true}
                                    label={`${uploadPercentage}%`}
                                />
                            </div>
                            <div className="col-auto">
                                <span
                                    className="text-primary cursor-pointer"
                                    onClick={() => cancelUpload()}
                                >
                                    Cancel
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
};

export default BiometricFileUpload;
