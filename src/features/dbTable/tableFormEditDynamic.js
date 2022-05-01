import  {REACT,useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';

import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;

const  TableFormEditDynamic = (props) => {

    const [inputFields, setInputFields] = useState([]);
    const [formElements, setFormElements] = useState({});

    const handleFormChange = (index,input,  event) => {
        let data = [...inputFields];
        for(let i=0; i<data.length;i++){
            if(data[i].name == event.target.name){
                data[i].value = event.target.value;
                //formElements[data[i].name] = {name: data[i].name , value: event.target.value, columnDefinition: JSON.stringify(data[i].columnDefinition)};
                break;
            }
        }
        setInputFields(data);
    }

    useEffect(()=>{
        let arr = [];
        for(let k in props.dataSource){
            let colDef = null;
            for(let i=0;i<props.columns.length;i++){
                if(props.columns[i].name == k)
                    colDef = props.columns[i];
            }
            arr.push({name:k, value: props.dataSource[k], columnDefinition:colDef });
        }
        setInputFields(arr);

        },[props.table + "." + props.formKey ])


    const addEditItem = () => {

        let formData = new FormData();
        formData.append("tableData",JSON.stringify(inputFields));
        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }}

        formData.append("key", props.formKey);
        serverApis.put('/table/' + props.table + '/', formData, headers, (e) => {
            alert(e.message)
        }, (error) => {
            alert(error.message)
        });

    }

    return (
        <>
            <form>
                {inputFields.map((input, index) => {
                    return (
                        <div key={index}>
                            <label>{input.name}</label>:
                            <input
                                name={input.name}
                                placeholder=''
                                value={input.value}
                                onChange={event => handleFormChange(index,input,  event)}
                            />
                        </div>
                    )
                })}

            </form>

            <Button type="primary" onClick={addEditItem} >
                Add Item
            </Button>
        </>
    )
}

export default TableFormEditDynamic;