import React, {REACT,useState, useEffect } from 'react';
import { Select,Input, Form } from 'antd';
import { useSelector} from "react-redux";
import {
    selectTableColumns,
    selectFormKey,
    selectF_keys,
} from "./tableSlice";

const {Option} = Select;

const  TableFormAdd = (props) => {
    const f_keys = useSelector(selectF_keys);
    const columns = useSelector(selectTableColumns);
    const formKey = useSelector(selectFormKey);
    const [inputFields, setInputFields] = useState([]);
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
        props.setInputFields(data);
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
        props.setInputFields(data);
    }

    useEffect(()=>{
        let arr = [];
        const fk = f_keys;
        for(let i=0;i<columns.length;i++) {
            if(!columns[i].auto_generated) {
                let fkData = null;
                for (let j = 0; j < fk.data.length; j++) {
                    if (fk.data[j].name == columns[i].name) {
                        fkData = fk.data[j];
                    }
                }
                arr.push({name: columns[i].name, value: '', columnDefinition: columns[i], fk: fkData});
            }
        }
        setInputFields(arr);
        props.setInputFields(arr);
        props.setFormObj(form);

    },[props.table + "." + formKey ])

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
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 18 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                    {inputFields.map((col, index) => {
                        if(col.name != "key" ) {
                            if (col.columnDefinition && col.fk != null ) {
                                return (
                                    <Form.Item
                                        label={col.name}
                                        name={col.name}
                                        rules={[{ required: !col.nullable, message: 'Field cannot be empty!' }]}
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
                                        rules={[{ required: !col.nullable, message: 'Field cannot be empty!' }]}
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

            </Form>
        </>
    )
}

export default TableFormAdd;