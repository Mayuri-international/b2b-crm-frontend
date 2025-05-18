
import { createSlice } from "@reduxjs/toolkit";


let initialState = {

    data:null,

}



const salesPersonSlice = createSlice({

    name:"salesPerson",
    initialState:initialState,
    reducers:{

        setUserData :(state,action)=>{

            state.data  = action.payload;

        }
    }
})

export const {setUserData} = salesPersonSlice.actions;

export default salesPersonSlice.reducer;

