import axios from "../app/providers/axiosCall.js";

import { handleAxiosError } from "./handleAxiosError.js";


export async function fetchAllUserQueries() {

    try {


        const res = await axios.get('/get-all-enquery');

        console.log("res ka data ", res.data.data);

        return res.data.data;

    } catch (error) {

        console.error("Error fetching categories:", error);
        // toast.error("Failed to fetch categories");
        throw error;

    }
}



export async function fetchAllSalesPerson() {

    try {


        const response = await axios.get('/get-all-salespersonData');

        console.log("salesperson ka data ", response.data.data);

        return response.data.data;

    } catch (error) {

        throw error;

    }
}



export async function assignSalesPersonToEnquery(data) {

    try {

        const res = await axios.post('/assign-person-to-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw error;

    }
}


// assign vendor to the Enquery 

export async function assignVendorToEnquery(data) {

    try {

        const res = await axios.post('/assign-vendor-to-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log(error);
        throw error;
    }

}



// delete vendor from the enquery 

export async function deleteVendorFromEnquery(data) {

    try {

        const res = await axios.post('/delete-vendor-from-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw error;
    }
}


export async function addNewFollowUpHandler(data) {

    try {

        const result = await axios.post('/add-new-followups', data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw error;

    }
}

export async function respondToFollowUp(data) {

    try {

        const result = await axios.post('/respondToFollowUps', data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);
        throw error;
    }
}


// auth api handler 

export async function loginHandler(data) {

    try {

        const result = await axios.post("/login", data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw error; // keep the original AxiosError structure

    }
}



// Quote Api Routes ---- >


// add new quotation to the client

export async function addNewQuotationToClient(formData) {
    try {
        const result = await axios.post('/create-new-quote', formData, {
            headers: {
                "Content-Type": 'multipart/form-data'
            }
        });

        return result.data.data;
    } catch (error) {
        console.log("error is ", error);
        throw error; // keep the original AxiosError structure
    }
}


// get all quote 

export async function getAllQuote(enqueryId) {

    try {

        const result = await axios.get(`/get-all-quote-revisions/${enqueryId}`);

        console.log("result is ", result.data.data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);
        throw error;
    }
}




// create new user 


export async function createNewUser(data) {

    try {

        const result = await axios.post('/create-user', data);

        console.log("result of create new user is ", result.data.data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw error;
    }
}

// get - all - members - data

export async function getAllMembersData() {

    try {


        const response = await axios.get('/get-all-members-data');

        console.log("all members ka data ", response.data.data);

        return response.data.data;

    } catch (error) {

        throw error;

    }
}


// update members data ---->

export async function updateMembersData(data){

    try{

        const result = await axios.post('/update-members-data', data);

        return result.data.data;

    }catch(error){

        console.log("error is : ",error);
        throw error;

    }
}


