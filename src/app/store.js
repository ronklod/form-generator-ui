import { configureStore } from '@reduxjs/toolkit';
import dbTableRedcuer from '../features/dbTable/tableSlice'

export const store = configureStore({
    reducer: {
        dbTable: dbTableRedcuer,
    },
});


