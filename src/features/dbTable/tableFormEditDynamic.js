import  {REACT,useState, useEffect } from 'react';
import { Table, Modal, Button,Select,Input, Form } from 'antd';

import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;
const {Option} = Select;

const  TableFormEditDynamic = (props) => {

    const [inputFields, setInputFields] = useState([]);
    const [formElements, setFormElements] = useState({});
    const [originalValues, setOriginalValues] = useState([]);

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
            }
            arr.push({name:k, value: props.dataSource[k], columnDefinition:colDef, fk:fkData });
        }
        setInputFields(arr);
        setOriginalValues(props.dataSource);

        },[props.table + "." + props.formKey ])


    const addEditItem = () => {
        let formData = new FormData();
        formData.append("tableData",JSON.stringify(inputFields));
        formData.append("originalValues", JSON.stringify(originalValues));

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

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
            options.push(<Option value={data[j].id} > {data[j].name} </Option>)
        }
        return options;
    }

    return (
        <>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
               {inputFields.map((col, index) => {
                    if(col.name != "key" ) {
                        if (col.columnDefinition && col.fk != null) {
                            return (
                                <Form.Item
                                    label={col.name}
                                    name={col.name}
                                    rules={[{ required: !col.nullable, message: 'Please input your username!' }]}
                                >
                                    <Select
                                             name={col.name}
                                             defaultValue={col.value}
                                             onChange={event => handleFormChange(index, col, event)}
                                    >
                                        {getDropdownlistItems(col.fk.value.recordset)}
                                    </Select>

                                </Form.Item>
                            )
                        }else {
                            return (
                                <Form.Item
                                    label={col.name}
                                    name={col.name}
                                    rules={[{ required: !col.nullable, message: 'Please input your username!' }]}
                                >
                                    <Input disabled={col.columnDefinition.pk}
                                            name={col.name}
                                            defaultValue={col.value}
                                            onChange={event => handleFormChange(index, col, event)}
                                        />
                                </Form.Item>
                            )
                        }
                    }
                })
           }

                <Button type="primary" onClick={addEditItem} >
                    Update Item
                </Button>

            </Form>


        </>
    )
}

export default TableFormEditDynamic;