import  {REACT,useState, useEffect } from 'react';
import { Button, Input, Select, Form } from 'antd';
import serverApis from '../../ServerApis/serverApis';

let physicalObj = null;
const {Option} = Select;

const  TableFormAdd = (props) => {

    const [formElements, setFormElements] = useState({});

    const formElementOnChange = (e,element) => {
        formElements[element.name] = {name: element.name, value: e.target.value, columnDefinition: JSON.stringify(element)};
    }

    const drawForm = () =>{
        const columns = props.columns;
        const rows = props.dataSource;
        const fkData = props.f_key;

        let element = null
        const elements = [];
        for(let col of columns){
            if(!col.auto_generated && col.name != "key") {
                if(col.fk){
                    element = <Form.Item
                        label={col.name}
                        name={col.name}
                        rules={[{ required: !col.nullable, message: 'Please input your username!' }]}
                    >
                        <Select style={{ width: 150 }} onChange={(e) => formElementOnChange(e, col)}>
                            {getDropdownlistItems(col.name)}
                        </Select>
                    </Form.Item>
                }
                else {
                    element = <Form.Item
                        label={col.name}
                        name={col.name}
                        rules={[{ required: !col.nullable, message: 'Please input your username!' }]}
                    >
                        <Input onChange={(e) => formElementOnChange(e, col)}/>
                    </Form.Item>
                }

                elements.push(element);
                formElements[col.name] = {};
            }
        }

        return elements;
    }

    const getDropdownlistItems = (colName) =>{
        const options = [];
        for(let i=0; i<props.f_key.data.length;i++){
            if(props.f_key.data[i].name == colName){
                for(let j=0; j< props.f_key.data[i].value.recordset.length;j++){
                    options.push(<Option value={props.f_key.data[i].value.recordset[j].id} > {props.f_key.data[i].value.recordset[j].name} </Option>)
                }
            }
        }

        return options;
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
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >
                {drawForm()}

                <Form.Item>
                    <Button type="primary" onClick={addEditItem}>
                        Add Item
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}

export default TableFormAdd;