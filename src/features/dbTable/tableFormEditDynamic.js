import  {REACT,useState, useEffect } from 'react';
import { Table, Modal, Button,Select,Input, Form } from 'antd';

import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;
const {Option} = Select;


const  TableFormEditDynamic = (props) => {

    const [inputFields, setInputFields] = useState([]);
    const [formElements, setFormElements] = useState({});
    const [originalValues, setOriginalValues] = useState([]);
    const [message, setMessage] = useState('');
    const [form] = Form.useForm();


    const handleInputFormChange = (index,input,  event) => {
        let data = [...inputFields];
        for(let i=0; i<data.length;i++){
            if(data[i].name == input.name){
                data[i].value = event.target.value;
                break;
            }
        }
        setInputFields(data);
    }

    const handleSelectFormChange = (index,input,  event) => {
        let data = [...inputFields];
        for(let i=0; i<data.length;i++){
            if(data[i].name == input.name){
                data[i].value = event;
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
            setMessage("Item updated successfully!");
        }, (e) => {
            setMessage("error:" + e.message);
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
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                <Form.Item>
                    <h2>{message}</h2>
                </Form.Item>

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
                                             value={col.value}
                                             onChange={event => handleSelectFormChange(index, col, event)}
                                    >
                                        {getDropdownlistItems(col.fk.value.recordset)}
                                    </Select>
                                    {/*//ugly workaround to get the value on the ant design input - check how to fix this*/}
                                    <select style={{display:'none'}}
                                        name={col.name}
                                        value={col.value}

                                    >
                                        {getDropdownlistItems(col.fk.value.recordset)}
                                    </select>

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
                                            name={'eeee'}
                                            value={col.value}
                                            onChange={event => handleInputFormChange(index, col, event)}
                                        />
                                    {/*//ugly workaround to get the value on the ant design input - check how to fix this*/}
                                    <input type={"text"} value={col.value} style={{display:'none'}} />
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