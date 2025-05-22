'use client'

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

import { Select } from "../ui/select";

import { Button } from "../ui/button";

import { addNewQuotationToClient } from "@/lib/api";

import { handleAxiosError } from "@/lib/handleAxiosError";


[{
    clientId: "663c1234567890abcdef111",
    version: 1,
    items: [
        {
            description: "5 Cafe Chair && 10 tables",
            hsn: "9401",
            unit: "pcs",
            quantity: 15,
            finalUnitPrice: 2200,
            subtotal: 15 * 2200, // 33000
            vendors: [
                {
                    vendorId: "663c123abc111",
                    description: "5 cafe chairs", // Optional - not in schema
                    quantity: 5,
                    costPerUnit: 1800,
                    advance: 4000,
                    deliveryDate: new Date("2025-05-15")
                },
                {
                    vendorId: "663c123abc112",
                    description: "5 tables", // Optional
                    quantity: 5,
                    costPerUnit: 1800,
                    advance: 4000,
                    deliveryDate: new Date("2025-05-15")
                },
                {
                    vendorId: "663c123abc113",
                    description: "5 tables", // Optional
                    quantity: 5,
                    costPerUnit: 1800,
                    advance: 4000,
                    deliveryDate: new Date("2025-05-15")
                }
            ]
        },
        {
            description: "Cafe Chair",
            hsn: "9401",
            unit: "pcs",
            quantity: 10,
            finalUnitPrice: 2200,
            subtotal: 10 * 2200, // 22000
        }
    ],
    taxPercent: 18,
    transport: 1000,
    installation: 500,
    notes: "Client prefers premium fabric finish.",
    totalAmount: 33000 + 22000 + 18 + 1000 + 500, // Helper function below
    status: "Finalized"
}

]


let rootItemsFields = [
    "description",
    "hsn",
    "unit",
    "quantity",
    "finalUnitPrice",
    "subtotal"
]


let rootQuotationFields = [

    "taxPercent",
    "transport",
    "installation",
    "totalAmount",
    "reason",
    "image"
]


let type_of_item_changes = {

    removed:"removed",
    add:"add",
    modified:"modified",

}


export default function AddNewQuoteForm({ dummyData, setDummyData, setAddNewQuoteFormModal, addNewQuotation,client }) {

    // we have to filter out the things on the basis of the version

    // if it is a new quote then we have to show the new quote form

    // Add version to defaultValues
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            version: "New Quote",
            clientId: client._id,
            items: [
                {
                    description: '',
                    hsn: '',
                    unit: '',
                    quantity: 0,
                    finalUnitPrice: 0,
                    subtotal: 0,
                }
            ],
            taxPercent: '18',
            transport: 0,
            installation: 0,
            totalAmount: 0,
            reason: '',
            image: "",
        }
    });

    // Watch version field
    const selectedVersion = watch("version");

    const onSubmit = async (data) => {
        if (data.version === "New Quote") {
            try {
                // Create FormData instance
                const formData = new FormData();
                
                // Handle the image file separately
                if (data.image && data.image[0]) {
                    formData.append('image', data.image[0]);
                }
                
                // Create a copy of data without the image
                const jsonData = { ...data };
                delete jsonData.image;
                
                // Convert the rest of the data to JSON and append as a single field
                formData.append('data', JSON.stringify(jsonData));

                console.log("Form data structure:", {
                    items: data.items,
                    itemsType: Array.isArray(data.items) ? "Array" : typeof data.items,
                    itemsLength: data.items?.length,
                    fullData: data
                });

                const result = await addNewQuotationToClient(formData);
                console.log("result is ", result);

            } catch (error) {
                console.log("error is ", error);
                handleAxiosError(error);
            }
        } else {
            // Updating an existing version
            const versionToUpdate = parseInt(data.version);
            const original = dummyData.find(q => q.version === versionToUpdate);

            // Track changes in root fields
            let rootFieldChanges = {};
            rootQuotationFields.forEach(field => {

                if(field === "totalAmount"){

                    if(parseInt(data[field]) !== parseInt(original[field])){

                        rootFieldChanges[field] = data[field];
                    }

                }
                else if (data[field] !== original[field]) {

                    console.log("field name is ",field);

                    console.log("data field side ", data[field]);
                    console.log("original field side ",original[field]);
                    rootFieldChanges[field] = data[field];
                }
            });

            // Track changes in items
            let itemChanges = [];
            data.items.forEach((item, index) => {
                const originalItem = original.items[index];
                if (!originalItem) {
                    // New item added
                    itemChanges.push({
                        index,
                        type: 'added',
                        data: item
                    });
                    return;
                }

                let changes = {};
                rootItemsFields.forEach(field => {
                    if (item[field] !== originalItem[field]) {
                        changes[field] = item[field];
                    }
                });

                if (Object.keys(changes).length > 0) {
                    itemChanges.push({
                        index,
                        type: 'modified',
                        changes
                    });
                }
            });

            // Check for removed items
            original.items.forEach((_, index) => {
                if (!data.items[index]) {
                    itemChanges.push({
                        index,
                        type: 'removed'
                    });
                }
            });

            // console.log("item changes ",itemChanges);

            // console.log("root field Changes ",rootFieldChanges);

            const hasChanges = Object.keys(rootFieldChanges).length > 0 || itemChanges.length > 0;

            console.log("has changes is ", hasChanges);

            if (hasChanges) {

                console.log("has changes ke andar ",);
                console.log('Root field changes:', rootFieldChanges);
                console.log('Item changes:', itemChanges);
                // updateQuotationVersion(versionToUpdate, updatedData);
            } else {
                alert("No changes detected in this version.");
            }
        }
    };


    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });

    // handle version change 

    const handleVersionChange = (e) => {
        const value = e.target.value;

        console.log("version value is ", value);

        setValue("version", value);

        if (value === "New Quote") {
            reset({
                version: "New Quote",
                items: [
                    {
                        description: '',
                        hsn: '',
                        unit: '',
                        quantity: 0,
                        finalUnitPrice: 0,
                        subtotal: 0,
                    }
                ],
                taxPercent: '18',
                transport: 0,
                installation: 0,
                totalAmount: 0,
                reason: '',
                image: "",
            });
        } else {
            // Find the selected version's data
            const found = dummyData.find(q => String(q.version) === value);
            if (found) {
                reset({
                    version: found.version,
                    items: found.items || [],
                    taxPercent: found.taxPercent || '18',
                    transport: found.transport || 0,
                    installation: found.installation || 0,
                    totalAmount: found.totalAmount || 0,
                    reason: found.reason || '',
                    image: "",
                });
            }
        }
    };


    const calculateSubtotal = (quantity, price) => {
        return Number(quantity) * Number(price);
    };

    const calculateTotalAmount = () => {
        const items = watch("items");
        const transport = Number(watch("transport") || 0);
        const installation = Number(watch("installation") || 0);
        const taxPercent = Number(watch("taxPercent") || 0);

        const subtotalSum = items.reduce((sum, item) => {
            return sum + calculateSubtotal(item.quantity, item.finalUnitPrice);
        }, 0);

        const taxAmount = (subtotalSum * taxPercent) / 100;
        const totalAmount = (subtotalSum + taxAmount + transport + installation).toFixed(2);
        setValue("totalAmount", totalAmount);
        return parseInt((subtotalSum + taxAmount + transport + installation));
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
                <h1 className="text-2xl font-bold mb-6 text-center">Add New Quotation</h1>

                <RxCrossCircled size={40} className="top-2 right-2 absolute cursor-pointer" onClick={() => setAddNewQuoteFormModal(false)} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">


                    {/* first you have to select the version */}

                    <div className="relative w-60">
                        <select
                            {...register("version")}
                            onChange={handleVersionChange}
                            value={selectedVersion}
                            className="block w-full appearance-none px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-800"
                        >
                            <option value="">Select</option>
                            <option value="New Quote">New Quote</option>
                            {dummyData.map((item, index) => (
                                <option key={index} value={item.version}>{item.version}</option>
                            ))}
                        </select>

                        {/* Dropdown Arrow */}
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 12a1 1 0 0 1-.7-.29l-4-4a1 1 0 0 1 1.4-1.42L10 9.58l3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4A1 1 0 0 1 10 12z" />
                            </svg>
                        </div>
                    </div>



                    <h2 className="font-semibold text-lg mb-2">Items</h2>

                    {fields.map((field, index) => (
                        <div key={field.id} className="grid grid-cols-6 gap-4 mb-4 border p-4 rounded-md">
                            <div>
                                <Label>Description</Label>
                                <Input {...register(`items.${index}.description`, { required: "Required" })} />
                            </div>
                            <div>
                                <Label>HSN</Label>
                                <Input {...register(`items.${index}.hsn`, { required: "Required" })} />
                            </div>
                            <div>
                                <Label>Unit</Label>
                                <Input {...register(`items.${index}.unit`, { required: "Required" })} />
                            </div>
                            <div>
                                <Label>Qty</Label>
                                <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                            </div>
                            <div>
                                <Label>Unit Price</Label>
                                <Input type="number" {...register(`items.${index}.finalUnitPrice`, { valueAsNumber: true })} />
                            </div>
                            <div className="flex items-end justify-between">
                                <button type="button" className="text-red-600" onClick={() => remove(index)}>Remove</button>
                            </div>
                        </div>
                    ))}

                    <div className="text-center">
                        <button type="button" className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => append({})}>Add Item</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Tax Percentage</Label>
                            <Input {...register("taxPercent", { required: "Required" })} />
                        </div>
                        <div>
                            <Label>Transport</Label>
                            <Input type="number" {...register("transport", { valueAsNumber: true })} />
                        </div>
                        <div>
                            <Label>Installation</Label>
                            <Input type="number" {...register("installation", { valueAsNumber: true })} />
                        </div>
                        <div>
                            <Label>Total Amount</Label>
                            <Input readOnly value={calculateTotalAmount()} />

                        </div>

                        <div>

                            <Label>Image</Label>
                            <Input type="file" {...register("image")} />

                        </div>

                    </div>

                    <div>
                        <Label>Reason (Optional)</Label>
                        <Input {...register("reason")} />
                    </div>

                    <div className="text-center">
                        <Button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Submit</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
