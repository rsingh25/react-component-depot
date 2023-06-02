import React, { useEffect, useState, useMemo } from "react";
import { TableHeader, Pagination, Search } from "../components/DataTable";
import useFullPageLoader from "../hooks/useFullPageLoader";
import AppConfig from "App.config";
import {baseServer} from "./axios-config";
import Button from "react-bootstrap/Button";
import GenericAddUpdate from "./generic-add-update";
import {toIsoString} from "./util";

const GenericTable = ({url, onSearch, rowInitVal, headers, rowIsValid}) => {
    const [data, setData] = useState([]);
    const [loader, showLoader, hideLoader] = useFullPageLoader();
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [sorting, setSorting] = useState({ field: "", order: "" });
    const [dataChangeInProgress, setDataChangeInProgress] = useState(false);

    const [addFormVisiblity, setAddFormVisiblity] = useState(false);
    const toggleAddFormVisiblity = () => setAddFormVisiblity(visiblity => !visiblity);

    const [updateEntity, setUpdateEntity] = useState(rowInitVal);

    const ITEMS_PER_PAGE = 50;

    //const URL = "/api/emp-salary-adjs";
    /**
                        (att.empCode && att.empCode.toLowerCase().includes(search.toLowerCase())) 
                    || (att.attStatus && att.attStatus.toLowerCase().includes(search.toLowerCase()))
                    || (att.notes && att.notes.toLowerCase().includes(search.toLowerCase()))

    onSearch = 
    onSearch(search)

    rowInitVal
    headers - name, field, sortable, type = date,datetime etc
     */
    

    const dateFromat = { month: 'short', day: '2-digit' };
    const dateTimeFromat = { month: 'short', day: '2-digit', hour: "2-digit", minute: "2-digit"};

    useEffect(() => {

        const getDataAync = async () => {
            try {
                showLoader();
                const resp = await baseServer.get(url);
                hideLoader();
                setData(resp.data);
            } catch (err) {
                console.log(err);
            }
        };

        if (!dataChangeInProgress && !addFormVisiblity) {
            getDataAync()
        }
    }, [dataChangeInProgress, addFormVisiblity]);

    const dataView = useMemo(() => {
        let computedData = data;

        if (search) {
            computedData = computedData.filter(att => onSearch(att, search));
        }

        setTotalItems(computedData.length);

        //Sorting attendances
        if (sorting.field) {
            const reversed = sorting.order === "asc" ? 1 : -1;
            computedData = computedData.sort(
                (a, b) =>
                    reversed * (a && a[sorting.field]? a[sorting.field] : "").localeCompare((b && b[sorting.field] ? b[sorting.field] : ""))
            );
        }

        //Current Page slice
        return computedData.slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            (currentPage - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE
        );
    }, [data, currentPage, search, sorting]);

    const onDelete = (i) => {
        const deleteAync = async () => {
            try {
                setDataChangeInProgress(true);
                await baseServer.delete(`${url}/${i}`);
                setDataChangeInProgress(false);
            } catch (err) {
                console.log(err);
            }
        };

        deleteAync()
    };

    const onUpdate = (row) => {
        setUpdateEntity(row ? row : rowInitVal);
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
        //Derive it from header
        let usersCsv = data.reduce((acc, att) => {
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
                            {dataView.map(row => (
                                <tr key={row.id}>
                                    <th scope="row" key={row.id}>
                                        {row.id}
                                    </th>

                                    {headers
                                    .filter(h => h.field != "id")
                                    .map( h => {
                                        return (
                                        <td key={`${row.id}${h.name}`}>{
                                            !h.type? (row[h.field] ? String(row[h.field]) : "") :
                                            h.type == "date"? (row[h.field] ? new Date(row[h.field]).toLocaleDateString("en-GB", dateFromat): "") :
                                            h.type == "datetime-local"? (row[h.field] ? new Date(row[h.field]).toLocaleString("en-GB", dateTimeFromat): "") :
                                            h.type == "number"? Number(row[h.field]).toFixed(2) : (row[h.field] ? String(row[h.field]) : "")
                                        }
                                        </td>
                                    )})}
                                    <td>
                                        <Button variant="secondary" onClick={() => onUpdate(row)}><i className="fas fa-edit" aria-hidden="true"></i></Button>
                                        <Button variant="secondary" onClick={() => onDelete(row.id)}><i className="fas fa-trash" aria-hidden="true"></i></Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {addFormVisiblity && (
                <GenericAddUpdate onClose={toggleAddFormVisiblity} data = {updateEntity} rowInitVal={rowInitVal} headers={headers} url={url} entityName="test" rowIsValid={rowIsValid} />
            )}

            {loader}
        </>
    );
};
//onClose, data, rowInitVal, headers, url, entityName, isValid
export default GenericTable;
