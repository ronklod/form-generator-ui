import React, {useState, useEffect } from 'react';
import Split from 'react-split-it';
import {Button} from "antd";
import TableData from "./tableData";
import {setPanels, selectSetPanel, selectPanels, selectTableColumns, selectFormKey, selectDbTable, setShowRightPanel, setTable} from "./tableSlice";
import {useDispatch, useSelector } from "react-redux";

const  MainPanel = (props) => {

    const dispatch = useDispatch();
    const panels = useSelector(selectPanels);
    const dbTable = useSelector(selectDbTable);

    const onButtonClick = (table) => {
        dispatch(setShowRightPanel(false));
        dispatch(setTable(table));
        dispatch(setShowRightPanel(true));
    }

    useEffect(()=>{
        if(dbTable != null) {
            dispatch(setPanels([{name: 'p1', size: 1.0, comp: <TableData table={dbTable}/>}]));
        }
    },[dbTable])

    //without this function, when clicking on the open button the size doesnt change\
    //so it is like a "bug" fix
    const setSize = (data) =>{
    //    let d = data;
    }


    return (
        <div style={{marginLeft:'10px', marginRight:'10px'}}>
            <Button type="primary"  style={{marginRight:'10px'}}  onClick={()=>onButtonClick('physical')} >Physical</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('envelope')}>Envelope</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('student')}>Student</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('classes')}>Classes</Button>
            <Button type="primary" style={{marginRight:'10px'}} onClick={()=>onButtonClick('student_classes')}>Student-Classes</Button>

            <div style={{height:'90vh', width:'100vw', marginRight:'10px'}}>
                <Split sizes={panels.map(p => p.size)} onSetSizes={setSize} >
                    {
                        panels.map((pane, i) => (
                            <div className="content" key={pane.name}>
                                {pane.comp}

                            </div>
                        ))
                    }
                </Split>
            </div>
        </div>
    )
}

export default MainPanel;