import  {REACT,useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';

import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;

const  TableFormAdd = (props) => {

    const [formElements, setFormElements] = useState({});

    const formElementOnChange = (e,element) => {
        formElements[element.name] = {name: element.name, value: e.target.value, columnDefinition: JSON.stringify(element)};
    }

    const drawForm = () =>{
        const columns = props.columns;
        const rows = props.dataSource;

        let element = null
        const elements = [];
        for(let col of columns){

            if(!col.auto_generated) {
                element = <div key={col.name}>
                            <span>{col.name}:</span>
                            <input type="text" onChange={(e) => formElementOnChange(e, col)}/>
                            <br/>
                        </div>;

                elements.push(element);
                formElements[col.name] = {};
            }
        }

        return elements;
    }

    const addEditItem = () => {
        let formData = new FormData();
        formData.append("tableData",JSON.stringify(formElements));

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }}

        serverApis.post('/table/' + props.table + '/', formData, headers, (e) => {
            alert(e.message)
        }, (error) => {
            alert(error.message)
        });
    }

    return (
        <>
            {drawForm()}

            <Button type="primary" onClick={addEditItem}>
                Add Item
            </Button>
        </>
    )
}

export default TableFormAdd;