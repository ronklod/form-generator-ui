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
                break;
            }
        }
        setInputFields(data);
    }

    useEffect(()=>{
        let arr = [];
        const fk =props.f_key;
        for(let k in props.dataSource){
            let colDef = null;
            let fkData = null;
            for(let i=0;i<props.columns.length;i++){
                if(props.columns[i].name == k) {
                    colDef = props.columns[i];
                }

                for(let j=0; j<fk.data.length;j++){
                    if(fk.data[j].name == k){
                        fkData = fk.data[j];
                    }
                }

                //for(let j=0;j<)
            }
            arr.push({name:k, value: props.dataSource[k], columnDefinition:colDef, fk:fkData });
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

    const getDropdownlistItems = (data) =>{
        const options = [];
        for(let j=0; j< data.length;j++){
            options.push(<option value={data[j].id} > {data[j].name} </option>)
        }


        return options;
    }

    return (
        <>
            <form>
               {inputFields.map((input, index) => {
                    if(input.name != "key" ) {
                        if (input.columnDefinition && input.fk != null) {
                            return (
                                <div key={index}>
                                    <label>{input.name}</label>:
                                    <select
                                        name={input.name}
                                        value={input.value}
                                        onChange={event => handleFormChange(index, input, event)}
                                    >
                                        {getDropdownlistItems(input.fk.value.recordset)}
                                    </select>
                                </div>
                            )
                        }else {
                            return (
                                <div key={index}>
                                    <label>{input.name}</label>:

                                    <input disabled={input.columnDefinition.pk}
                                        name={input.name}
                                        placeholder=''
                                        value={input.value}
                                        onChange={event => handleFormChange(index, input, event)}
                                    />
                                </div>
                            )
                        }
                    }
                })
                }

            </form>

            <Button type="primary" onClick={addEditItem} >
                Update Item
            </Button>
        </>
    )
}

export default TableFormEditDynamic;