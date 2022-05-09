import React, {REACT,useState, useEffect } from 'react';
import { Table, Modal, Button,Select,Input, Form } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import serverApis from '../../ServerApis/serverApis';
import {
    selectTableColumns,
    selectDbTable,
    selectFormKey,
    selectDataSource,
    selectF_keys,
    selectSelectedRow,
    setTable,
    setShowRightPanel, setPanels
} from "./tableSlice";
import TableData from "./tableData";

let physicalObj = null;
const {Option} = Select;


const  TableFormEditDynamic = (props) => {

    const dispatch = useDispatch();
    const f_keys = useSelector(selectF_keys);
    const selectedRow = useSelector(selectSelectedRow);
    const columns = useSelector(selectTableColumns);
    const formKey = useSelector(selectFormKey);

    const [inputFields, setInputFields] = useState([]);
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
        const fk = f_keys;

        for(let k in selectedRow){
            let colDef = null;
            let fkData = null;
            for(let i=0;i<columns.length;i++){
                if(columns[i].name == k) {
                    colDef = columns[i];
                }

                for(let j=0; j<fk.data.length;j++){
                    if(fk.data[j].name == k){
                        fkData = fk.data[j];
                    }
                }
            }
            arr.push({name:k, value: selectedRow[k], columnDefinition:colDef, fk:fkData });
        }

        setInputFields(arr);

        },[props.table + "." + formKey ])


    const addEditItem = () => {
        let formData = new FormData();
        formData.append("tableData",JSON.stringify(inputFields));
        formData.append("originalValues", JSON.stringify(selectedRow));

        const headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
            }
        }

        formData.append("key", props.formKey);
        serverApis.put('/table/' + props.table + '/', formData, headers, (e) => {
            setMessage("Item updated successfully!");
            dispatch(setTable(""));
            setTimeout(()=>{
                dispatch(setTable(props.table));
            }, 1);

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

    const closeEditPanel = () => {
        dispatch(setPanels([{name: 'p1', size: 1.0, comp: <TableData table={props.table}/>}]))
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

           <div className="edit-panel-buttons">
               <Button type="primary" style={{marginRight:'10px'}} onClick={addEditItem} >
                   Update Item
               </Button>
               <Button  onClick={closeEditPanel}>Close</Button>
           </div>
            </Form>
        </>
    )
}

export default TableFormEditDynamic;