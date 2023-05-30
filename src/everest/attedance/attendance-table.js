import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header"
import { TableHeader, Pagination, Search } from "../../components/DataTable";
import useFullPageLoader from "../../hooks/useFullPageLoader";
import ExternalInfo from "../../components/ExternalInfo";
import AppConfig from "App.config";
import {baseServer} from "../axios-config";
import Button from "react-bootstrap/Button";
import AddAttendance from "./add-attendance";
import {toIsoString} from "../util";

const AttendanceTable = () => {
    const [attendances, setAttendances] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [dataChangeInProgress, setDataChangeInProgress] = useState(false);

    const [addFormVisiblity, setAddFormVisiblity] = useState(false);
    const toggleAddFormVisiblity = () => setAddFormVisiblity(visiblity => !visiblity);

    const [updateEntity, setUpdateEntity] = useState({ empCode: "", inTime: "", outTime: "" });

    const ITEMS_PER_PAGE = 50;

    const headers = [
        { name: "ID", field: "id", sortable: false },
        { name: "Emp Code", field: "empCode", sortable: true },
        { name: "Att Date", field: "attDate", sortable: true },
        { name: "In time", field: "inTime", sortable: false },
        { name: "Out time", field: "outTime", sortable: false },
        { name: "Cal Duration", field: "calcDurationInMin", sortable: false },
        { name: "Shift", field: "shift", sortable: false },
        { name: "OT", field: "calcOverTimeDurationinMin", sortable: false },
        { name: "status", field: "attStatus", sortable: false },
        { name: "notes", field: "notes", sortable: false }
    ];


    const dateFromat = { month: 'short', day: '2-digit' };
    const dateTimeFromat = { month: 'short', day: '2-digit', hour: "2-digit", minute: "2-digit"};

    useEffect(() => {

        const getDataAync = async () => {
            try {
                showLoader();
                const resp = await baseServer.get("/api/emp-attendances");
                hideLoader();
                setAttendances(resp.data);
            } catch (err) {
                console.log(err);
            }
        };

        if (!dataChangeInProgress && !addFormVisiblity) {
            getDataAync()
        }
    }, [dataChangeInProgress, addFormVisiblity]);

    const attendancesData = useMemo(() => {
        let computedAttendances = attendances;

        if (search) {
            computedAttendances = computedAttendances.filter(
                att =>
                    (att.empCode && att.empCode.toLowerCase().includes(search.toLowerCase())) 
                    || (att.attStatus && att.attStatus.toLowerCase().includes(search.toLowerCase()))
                    || (att.notes && att.notes.toLowerCase().includes(search.toLowerCase()))
            );
        }

        setTotalItems(computedAttendances.length);

        //Sorting attendances
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedAttendances = computedAttendances.sort(
                (a, b) =>
                    reversed * (a && a[sorting.field]? a[sorting.field] : "").localeCompare((b && b[sorting.field] ? b[sorting.field] : ""))
            );
        }

        //Current Page slice
        return computedAttendances.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [attendances, currentPage, search, sorting]);

    const onDelete = (i) => {
        const deleteAync = async () => {
            try {
                setDataChangeInProgress(true);
                const resp = await baseServer.delete(`/api/emp-attendances/${i}`);
                setDataChangeInProgress(false);
            } catch (err) {
                console.log(err);
            }
        };

        deleteAync()
    };

    const onUpdate = (att) => {
        setUpdateEntity(att ? att : { empCode: "", inTime: "", outTime: "" });
        toggleAddFormVisiblity();
    };

    const downloadFile = ({ data, fileName, fileType }) => {
        const blob = new Blob([data], { type: fileType })
      
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
    }

    const exportToCsv = e => {
        e.preventDefault();

        let headers = ['id,empCode,attDate,inTime,outTime,calcDurationInMin,shift,calcOverTimeDurationinMin,attStatus,notes']
      
        // Convert users data to a csv
        let usersCsv = attendances.reduce((acc, att) => {
          const { id, empCode, attDate, inTime, outTime, calcDurationInMin, shift, calcOverTimeDurationinMin, attStatus, notes } = att
          acc.push([id, empCode, (attDate? toIsoString(attDate).substring(0, 16) : ""),(inTime? toIsoString(inTime).substring(0, 16) : ""), (outTime? toIsoString(outTime).substring(0, 16) : ""), calcDurationInMin, shift, calcOverTimeDurationinMin, attStatus, notes].join(','))
          return acc
        }, [])
      
        downloadFile({
          data: [...headers, ...usersCsv].join('\n'),
          fileName: 'attendance.csv',
          fileType: 'text/csv',
        })
      }

    return (
        <>
            <div className="row w-100">
                <div className="col mb-3 col-12 text-center">
                    <div className="row">
                        <div className="col-md-6">
                            <Pagination
                                total={totalItems}
                                itemsPerPage={ITEMS_PER_PAGE}
                                currentPage={currentPage}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                        <div className="col-md-1 d-flex flex-row-reverse">
                            <Button variant="primary" onClick={onUpdate}><i className="fas fa-plus" aria-hidden="true"></i></Button>
                        </div>
                        <div className="col-md-1 d-flex flex-row-reverse">
                            <Button variant="primary" onClick={exportToCsv}>Download</Button>
                        </div>
                        <div className="col-md-4 d-flex flex-row-reverse">
                            <Search
                                onSearch={value => {
                                    setSearch(value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    <table className="table table-hover">
                        <TableHeader
                            headers={headers}
                            onSorting={(field, order) =>
                                setSorting({ field, order })
                            }
                        />
                        <tbody>
                            {attendancesData.map(att => (
                                <tr key={att.id}>
                                    <th scope="row" key={att.id}>
                                        {att.id}
                                    </th>
                                    <td>{att.empCode}</td>
                                    <td>{att.attDate ? new Date(att.attDate).toLocaleDateString("en-GB", dateFromat): ""}</td>
                                    <td>{att.inTime ? new Date(att.inTime).toLocaleString("en-GB", dateTimeFromat): ""}</td>
                                    <td>{att.outTime ? new Date(att.outTime).toLocaleString("en-GB", dateTimeFromat): ""}</td>
                                    <td>{att.calcDurationInMin ? (att.calcDurationInMin / 60).toFixed(2) + ' Hrs'  : ""}</td>
                                    <td>{att.shift}</td>
                                    <td>{att.calcOverTimeDurationinMin}</td>
                                    <td>{att.attStatus}</td>
                                    <td>{att.notes}</td>
                                    <td>
                                        <Button variant="secondary" onClick={() => onUpdate(att)}><i className="fas fa-edit" aria-hidden="true"></i></Button>
                                        <Button variant="secondary" onClick={() => onDelete(att.id)}><i className="fas fa-trash" aria-hidden="true"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {addFormVisiblity && (
                <AddAttendance onClose={toggleAddFormVisiblity} data = {updateEntity} />
            )}

            {loader}
        </>
    );
};

export default AttendanceTable;
