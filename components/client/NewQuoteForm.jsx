'use client'

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { RxCrossCircled } from "react-icons/rx";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

import { Button } from "../ui/button";

export default function AddNewQuoteForm({ setAddNewQuoteFormModal,addNewQuotation }) {
    const { register, handleSubmit, control, reset, watch,setValue, formState: { errors } } = useForm({
        defaultValues: {
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
            taxPercentage: '18',
            transport: 0,
            installation: 0,
            totalAmount: 0,
            reason: '',
            image:"",
        }
    });

    const onSubmit = async(data)=>{

        addNewQuotation(data);

    }

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items"
    });


    const calculateSubtotal = (quantity, price) => {
        return Number(quantity) * Number(price);
    };

    const calculateTotalAmount = () => {
        const items = watch("items");
        const transport = Number(watch("transport") || 0);
        const installation = Number(watch("installation") || 0);
        const taxPercentage = Number(watch("taxPercentage") || 0);

        const subtotalSum = items.reduce((sum, item) => {
            return sum + calculateSubtotal(item.quantity, item.finalUnitPrice);
        }, 0);

        const taxAmount = (subtotalSum * taxPercentage) / 100;
        const totalAmount = (subtotalSum + taxAmount + transport + installation).toFixed(2);
        setValue("totalAmount", totalAmount);
        return (subtotalSum + taxAmount + transport + installation).toFixed(2);
    };

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white max-w-4xl w-full rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh] relative">
                <h1 className="text-2xl font-bold mb-6 text-center">Add New Quotation</h1>

                <RxCrossCircled size={40} className="top-2 right-2 absolute cursor-pointer" onClick={() => setAddNewQuoteFormModal(false)} />

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

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
                            <Input {...register("taxPercentage", { required: "Required" })} />
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
