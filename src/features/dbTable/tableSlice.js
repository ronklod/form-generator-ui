import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
    columns: [],
    table:'',
    formKey: '',
    dataSource:[],
    f_key:[],
    selectedRow: [],
    showRightPanel:false,
    panels: [],
};

export const tableSlice = createSlice({
    name: 'dbTable',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setTable: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.table = action.payload;
        },

        setColumns: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.columns = action.payload;
        },

        setFormKey: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.formKey = action.payload;
        },

        setDataSource: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.dataSource = action.payload;
        },

        setFKeys: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.f_key = action.payload;
        },

        setSelectedRow: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.selectedRow = action.payload;
        },

        setShowRightPanel: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.showRightPanel = action.payload;
        },

        setPanels: (state, action) => {
            console.log(action.payload + " type: " + action.type);
            state.panels = action.payload;
        },
    }
});

export const {setTable,setColumns, setFormKey, setDataSource, setFKeys, setSelectedRow, setShowRightPanel,setPanels } = tableSlice.actions;

export const selectTableColumns = (state) => state.dbTable.columns;
export const selectDbTable = (state) => state.dbTable.table;
export const selectDataSource = (state) => state.dbTable.dataSource;
export const selectF_keys = (state) => state.dbTable.f_key;
export const selectFormKey = (state) => state.dbTable.formKey;
export const selectSelectedRow = (state) => state.dbTable.selectedRow;
export const selectShowRightPanel = (state) => state.dbTable.showRightPanel;
export const selectPanels = (state) => state.dbTable.panels;



export default tableSlice.reducer;
