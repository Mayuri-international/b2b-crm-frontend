
import { createSlice } from "@reduxjs/toolkit";

const initialState = {

    data:null,

}



const quoteSlice = createSlice({

    name:"quote",
    initialState:initialState,
    reducers:{

        setQuoteData:(state,action) => {

            state.data = action.payload;

        }
    }
})

export const {setQuoteData} = quoteSlice.actions;

export default quoteSlice.reducer;

