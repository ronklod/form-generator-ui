import React, {useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import TableData from "./tableData";
import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;

const  TableSelector = (props) => {

    const [isTableDataVisible, setTableDataVisible] = useState(false);
    const [table, setTable] = useState(null);

    const onButtonClick = (table) => {
        setTableDataVisible(false);
        setTable(table)
        setTableDataVisible(true);
    }

    const renderPage =() =>{

        if(isTableDataVisible){
            return    <TableData table={table} />
        }
        return <></>
    }

    return (
        <>
            <Button type="primary"  style={{marginRight:'10px'}}  onClick={()=>onButtonClick('physical')} >Physical</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('envelope')}>Envelope</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('student')}>Student</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('classes')}>Classes</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('student_classes')}>Student-Classes</Button>

            {renderPage()}
        </>
    )
}

export default TableSelector;