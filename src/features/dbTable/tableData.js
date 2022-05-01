import React, {useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import TableFormAdd from "./tableFormAdd";
import TableFormEditDynamic from "./tableFormEditDynamic";
import serverApis from '../../ServerApis/serverApis';

let tableObj = null;


const  TableData = (props) => {

    const [tableColumns, setTableColumns] = useState(null);
    const [dataColumns, setDataColumns] = useState(null);
    const [rows, setRows] = useState([]);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editKey, setEditKey] = useState('');
    const [selectedRow, setSelectedRow] = useState('');

    const handleAddOk = () => {
        setIsAddModalVisible(false);

    };

    const handleAddCancel = () => {
        setIsAddModalVisible(false);

    };

    const handleEditOk = () => {
        setIsEditModalVisible(false);
        setEditKey('');
    };

    const handleEditCancel = () => {
        setIsEditModalVisible(false);
        setEditKey('');
    };

    const renderData = (table)=>{
        tableObj = table.data;
        setDataColumns(tableObj.columns)
        prepareColumnsForDisplay(tableObj.columns);
        setRows(tableObj.data.recordsets[0]);
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
                                    setEditKey(record.key);
                                    setIsEditModalVisible(true);
                                    setSelectedRow(record);
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
        serverApis.get('/table/'+ props.table +'/', renderData, ()=>{});
    },[props.table])

    return (
        <div style={{marginTop:'20px'}}>
            <Button type="primary" onClick={addModal}>
                Add {props.table}
            </Button>
            <Modal title="Basic Modal" visible={isAddModalVisible} onOk={handleAddOk} onCancel={handleAddCancel}>
                <TableFormAdd table={props.table} columns={dataColumns} formKey={editKey} dataSource={rows}   />
            </Modal>
            <Modal title="Basic Modal" visible={isEditModalVisible} onOk={handleEditOk} onCancel={handleEditCancel}>
                <TableFormEditDynamic table={props.table} columns={dataColumns} formKey={editKey} dataSource={selectedRow} />
            </Modal>

            <Table columns={tableColumns} dataSource={rows} />
        </div>
    )
}

export default TableData;