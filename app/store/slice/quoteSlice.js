import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    data: null,
    loading: false,
    error: null
}

const quoteSlice = createSlice({
    name: "quote",
    initialState,
    reducers: {
        setQuoteData: (state, action) => {
            state.data = action.payload;
            state.error = null;
        },
        updateVendorDataAtQuotes: (state, action) => {
            state.data = action.payload;
            state.error = null;
        },
        addNewQuote: (state, action) => {
            if (!state.data) {
                state.data = [action.payload];
            } else {
                state.data = [...state.data, action.payload];
            }
            state.error = null;
        },
        addNewVendor: (state, action) => {
            const { versionIndex, itemIndex, vendor } = action.payload;
            if (state.data && state.data[versionIndex]?.items[itemIndex]) {
                if (!state.data[versionIndex].items[itemIndex].vendors) {
                    state.data[versionIndex].items[itemIndex].vendors = [];
                }
                state.data[versionIndex].items[itemIndex].vendors.push(vendor);
            }
        },
        deleteVendor: (state, action) => {
            const { versionIndex, itemIndex, vendorId } = action.payload;
            if (state.data && state.data[versionIndex]?.items[itemIndex]?.vendors) {
                state.data[versionIndex].items[itemIndex].vendors = 
                    state.data[versionIndex].items[itemIndex].vendors.filter(
                        vendor => vendor.vendorId !== vendorId
                    );
            }
        },
        clearAllQuoteData:(state,action)=>{
            state.data = null;
            state.loading = false;
            state.error = null;

        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {
    setQuoteData,
    updateVendorDataAtQuotes,
    addNewQuote,
    addNewVendor,
    deleteVendor,
    setLoading,
    setError,
    clearAllQuoteData
    
} = quoteSlice.actions;

export default quoteSlice.reducer;

