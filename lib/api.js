
import axios from "../app/providers/axiosCall.js";



export async function fetchAllUserQueries() {

    try {


        const res = await axios.get('/get-all-enquery');

        console.log("res ka data ", res.data.data);

        return res.data.data;

    } catch (error) {

        console.error("Error fetching categories:", error);
        // toast.error("Failed to fetch categories");
        throw new Error("Failed to fetch categories");

    }
}



export async function fetchAllSalesPerson() {

    try {


        const response = await axios.get('/get-all-salespersonData');

        console.log("salesperson ka data ", response.data.data);

        return response.data.data;

    } catch (error) {

        throw new Error("error is " + error.message);

    }
}



export async function assignSalesPersonToEnquery(data) {

    try {

        const res = await axios.post('/assign-person-to-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw new Error("error is ", error);

    }
}


// assign vendor to the Enquery 

export async function assignVendorToEnquery(data) {

    try {

        const res = await axios.post('/assign-vendor-to-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log(error);
        throw new Error("error is ", error);
    }

}



// delete vendor from the enquery 

export async function deleteVendorFromEnquery(data) {

    try {

        const res = await axios.post('/delete-vendor-from-enquery', data);

        return res.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw new Error("error is ", error);

    }
}


export async function addNewFollowUp(data) {

    try {

        const result = await axios.post('/add-new-followups', data);

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw new Error("error is ", error);

    }
}

export async function addNewQuotationToClient(data) {

    try {

        const result = await axios.post('/create-new-quote', data, {
            headers: {

                "Content-Type":'multipart/form-data'
            }
        });

        return result.data.data;

    } catch (error) {

        console.log("error is ", error);

        throw new Error("error is ", error);

    }
}


