import React, {useState, useEffect } from 'react';
import { Table, Modal, Button, notification } from 'antd';
import TableFormAdd from "./tableFormAdd";
import TableFormEditDynamic from "./tableFormEditDynamic";
import serverApis from '../../ServerApis/serverApis';
import {useDispatch} from "react-redux";
import {
    setTable,
    setDataSource,
    setColumns,
    setFKeys,
    setFormKey,
    setSelectedRow,
    setShowRightPanel,
    setPanels
} from "./tableSlice";

let tableObj = null;


const  TableData = (props) => {

    const [tableColumns, setTableColumns] = useState(null);
    const [dataColumns, setDataColumns] = useState(null);
   // const [fkData, setFkData] = useState([]);
    const [rows, setRows] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    //const [editKey, setEditKey] = useState('');
    const [addInputFields, setAddInputFields] = useState([]);
    const dispatch = useDispatch();


    const handleAddOk = () => {
        let formData = new FormData();
        formData.append("tableData",JSON.stringify(addInputFields));

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        serverApis.post('/table/' + props.table + '/', formData, headers, (e) => {

            notification['success']({
                message: 'Item added successfully' ,
                description:
                    `Items added successfully to table: ${props.table}.`,
            });
            //form.resetFields();

            setIsAddModalVisible(false);
        }, (e) => {
            notification['error']({
                message: 'Error' ,
                description:
                    `${e.message}.`,
            });
        });
    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);
    };

    const renderData = (table)=>{
        tableObj = table.data;
        //setDataColumns(tableObj.columns)
        prepareColumnsForDisplay(tableObj.columns);
        //setFkData(table.data.f_keys);
        setRows(tableObj.data.recordsets[0]);

        dispatch(setTable(props.table));
        dispatch(setFKeys(table.data.f_keys));
        dispatch(setDataSource(tableObj.data.recordsets[0]));
        dispatch(setColumns(tableObj.columns));

    }

    const prepareColumnsForDisplay  = (rawColumns) => {
        const gridColumns = [];
        for (let col of rawColumns){
            gridColumns.push({
               title: col.name,
               dataIndex: col.name,
               key: col.name,
               render: text => {
                    if(typeof(text) == "boolean")
                        return text ? 'true' : 'false'
                   else
                       return <span>{text}</span>
               },
            })
        }

        gridColumns.push({
            title: 'Edit',
            dataIndex: '',
            key: 'edit',
            render: (_, record) => {
                return <Button type="primary" onClick={() => {
                            dispatch(setFormKey(record.key));
                            dispatch(setSelectedRow(record));
                            dispatch(setShowRightPanel(true));
                            dispatch(setPanels([{name:'p1', size:0.7, comp: <TableData table={props.table} /> },{name:'p2', size:0.3, comp: <TableFormEditDynamic table={props.table}/> }]));
                            }
                        }
                    >
                    Edit
                </Button>
            },
        })
        setTableColumns(gridColumns);
    }

    const addModal= () => {
        setIsAddModalVisible(true);
    }

    useEffect(()=>{
        if(props.table != "")
            serverApis.get('/table/'+ props.table +'/', renderData, ()=>{});
    },[props.table])

    return (
        <div style={{marginTop:'20px', marginRight:'20px'}}>
            <Button type="primary" onClick={addModal}>
                Add {props.table}
            </Button>
            <Modal title={'Add ' + props.table} visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
                <TableFormAdd table={props.table} setInputFields={setAddInputFields}   />
            </Modal>
            <Table columns={tableColumns} dataSource={rows} />
        </div>
    )
}

export default TableData;