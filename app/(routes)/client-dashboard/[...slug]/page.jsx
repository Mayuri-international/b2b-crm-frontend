'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import AddNewVendorForm from '@/components/client/AddNewVendorForm';

import { TiEdit } from "react-icons/ti";
import { MdDeleteForever } from "react-icons/md";

import { delivery_status } from '@/lib/data';
import { addNewFollowUp, assignVendorToEnquery, deleteVendorFromEnquery } from '@/lib/api';

import AddNewFollowUp from '@/components/client/AddNewFollowUp';

import { vendor_label_data } from '@/lib/data';

import AddNewQuoteForm from '@/components/client/NewQuoteForm';

import { addNewQuotationToClient } from '@/lib/api';

import { formatDateForInput } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function Clients() {

  const [addNewVendorModal, setAddNewVendorModal] = useState(false);

  const [editVendorModal, setEditVendorModal] = useState(null);

  const [editVendorModalAtQuotes, setEditVendorModalAtQuotes] = useState(null);

  const [newVendorAssignmentFormData, setNewVendorAssingmentFormData] = useState(null);

  const [addNewFollowUpModal, setAddNewFollowUpModal] = useState(false);

  const [addNewQuoteFormModal, setAddNewQuoteFormModal] = useState(false);

  const [editVendorData, setEditVendorData] = useState([]);

  const [editVendorDataAtQuotes, setEditVendorDataAtQuotes] = useState({});

  const [editItemDataAtQuotes, setEditItemDataAtQuotes] = useState({});

  const [editingVendorKey, setEditingVendorKey] = useState("");

  const [editItemKey, setEditItemKey] = useState({});

  const [isMainRowEditing, setMainRowEditing] = useState(false);

  const [dummyData, setDummyData] = useState(

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
          // vendors: [
          //   {
          //     vendorId: "663c123abc111",
          //     description: "5 tables", // Optional
          //     quantity: 5,
          //     costPerUnit: 1800,
          //     advance: 4000,
          //     deliveryDate: new Date("2025-05-15")
          //   },
          //   {
          //     vendorId: "663c123abc111",
          //     description: "5 tables", // Optional
          //     quantity: 5,
          //     costPerUnit: 1800,
          //     advance: 4000,
          //     deliveryDate: new Date("2025-05-15")
          //   }
          // ]
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

  )


  const [client, setClient] = useState({
    _id: 'c2',
    name: 'Meena Desai',
    companyName: 'Meena Furnishings',
    email: 'meena@mayuri.com',
    phone: '9988776655',
    address: 'Indiranagar, Bangalore',
    requirement: '10 Cafe Chairs for new cafe branch in Bangalore ',
    sourceWebsite: 'mayurifinserv.com',
    sourcePlatform: 'Facebook',
    assignedTo: 'Sadiq Basha',
    assignedBy: 'Admin User',
    assignmentDate: '2023-10-02',
    status: 'Assigned',
    quoteValue: 200000,
    finalQuoteApproved: 185000,
    invoiceId: 'INV001',
    QuoteSubmitted: true,
    vendorAssignments: [
      {
        vendorId: 'v1',
        quantity: "5",
        vendorName: 'Anand Furniture Works',
        productDescription: '5 Cafe Chairs',
        estimatedCost: 12500,
        advancePaid: 5000,
        deliveryEstimate: '2023-10-08',
        deliveryStatus: 'In Progress'
      },
      {
        vendorId: 'v2',
        quantity: "6",
        vendorName: 'Sharma Woodcrafts',
        productDescription: '5 Cafe Chairs',
        estimatedCost: 13000,
        advancePaid: 6000,
        deliveryEstimate: '2023-10-10',
        deliveryStatus: 'Pending'
      }
    ],
    communicationNotes: [
      { note: 'Urgent delivery needed.', createdBy: 'Admin', createdAt: '2023-10-03' }
    ],
    followUps: [
      {
        followUpDate: '2023-10-05',
        followUpNote: 'Confirm delivery timeline',
        done: false,
        responses: [
          {
            message: 'Confirmed call with vendor',
            respondedBy: 'Sadiq',
            respondedAt: '2023-10-04'
          },
          {
            message: 'Confirmed call with vendor',
            respondedBy: 'Sadiq',
            respondedAt: '2023-10-04'
          }
        ]
      },

    ],
    createdAt: '2023-10-01',
    updatedAt: '2023-10-03'
  });



  // const dummyData = {

  //   "clientId": "663c1234567890abcdef111",
  //   "items": [
  //     {
  //       "description": "5 Cafe Chair && 10 tables",
  //       "hsn": "9401",
  //       "unit": "pcs",
  //       "quantity": 15,
  //       "finalUnitPrice": 2200,
  //       "imageLink": "",
  //       "vendors": [
  //         {
  //           "vendorId": "663c123abc111",
  //           "description": "5 cafe chairs",
  //           "quantity": 5,
  //           "costPerUnit": 1800,
  //           "advance": 4000,
  //           "deliveryDate": "2025-05-15"
  //         },
  //         {
  //           "vendorId": "663c123abc111",
  //           "description": "5 tables",
  //           "quantity": 5,
  //           "costPerUnit": 1800,
  //           "advance": 4000,
  //           "deliveryDate": "2025-05-15"
  //         },
  //         {
  //           "vendorId": "663c123abc111",
  //           "description": "5 tables",
  //           "quantity": 5,
  //           "costPerUnit": 1800,
  //           "advance": 4000,
  //           "deliveryDate": "2025-05-15"
  //         },

  //       ]
  //     },
  //     {
  //       "description": "Cafe Chair",
  //       "hsn": "9401",
  //       "unit": "pcs",
  //       "quantity": 10,
  //       "finalUnitPrice": 2200,
  //       "vendors": [
  //         {
  //           "vendorId": "663c123abc111",
  //           "quantity": 5,
  //           "costPerUnit": 1800,
  //           "advance": 4000,
  //           "deliveryDate": "2025-05-15"
  //         },
  //         {
  //           "vendorId": "663c123abc111",
  //           "quantity": 5,
  //           "costPerUnit": 1800,
  //           "advance": 4000,
  //           "deliveryDate": "2025-05-15"
  //         }
  //       ]
  //     }
  //   ],
  //   "taxPercent": 18,
  //   "transport": 1000,
  //   "installation": 500,
  //   "notes": "Client prefers premium fabric finish."
  // }



  const handleVendorDetailsChangeHandler = (event) => {

    const { name, value } = event.target;

    console.log(name, value);

    const updatedVendors = [...editVendorData];

    updatedVendors[editVendorModal] = { ...updatedVendors[editVendorModal], [name]: value };

    setEditVendorDataAtQuotes(updatedVendors);

  };



  const handleVendorDetailsChangeHandlerAtQuotes = (e, key) => {

    const { name, value } = e.target;

    console.log("name ", name);

    console.log("value is ", value);

    console.log("edit vendor data at  quotes ", editVendorDataAtQuotes);

    setEditVendorDataAtQuotes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]:
          name === "quantity" || name === "costPerUnit" || name === "advance"
            ? Number(value)
            : value,
      },
    }));
  };


  const handleEditVendor = (index) => {


    console.log("handle edit vendor handler ", index);

    // create an shallow copy 

    const updatedVendors = [...client.vendorAssignments];

    setEditVendorModal(index);

    setEditVendorData(updatedVendors);

  };


  // const [userData,setUserData] = useState({

  //   name:"",
  //   phoneNo:"",

  // });




  const handleEditVendorAtQuotes = (quoteIndex, itemIndex, vendorIdx) => {
    const vendorKey = `${quoteIndex}-${itemIndex}-${vendorIdx}`;
    const itemKey = `${quoteIndex}-${itemIndex}`;

    const vendor = dummyData[quoteIndex].items[itemIndex].vendors[vendorIdx];
    const item = dummyData[quoteIndex].items[itemIndex];

    // Set vendor editing state
    setEditingVendorKey(vendorKey);
    setEditVendorDataAtQuotes(prev => ({
      ...prev,
      [vendorKey]: { ...vendor }
    }));

    // Set item editing state (merge)
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [itemKey]: { ...item }
    }));
    setEditItemKey(itemKey);
  };


  const handleEditItemAtQuotes = (quoteIndex, itemIndex) => {
    const itemKey = `${quoteIndex}-${itemIndex}`;
    const item = dummyData[quoteIndex].items[itemIndex];

    setEditItemKey(itemKey);
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [itemKey]: { ...item }
    }));
  };







  const handleSaveVendor = async (idx) => {

    try {

      console.log("handle save vendor handler ");

      console.log("vendor name is", editVendorData[idx]);

      // now we have to check and send only the updated data to the backend 

      const updatedVendorData = {

        vendorId: editVendorData[idx]._id,
        enqueryId: client._id,

      };


      Object.values(client.vendorAssignments[idx]).forEach((value, index) => {

        if (value !== editVendorData[idx][Object.keys(editVendorData[idx])[index]]) {
          updatedVendorData[Object.keys(editVendorData[idx])[index]] = editVendorData[idx][Object.keys(editVendorData[idx])[index]];
        }

      })

      if (Object.values(updatedVendorData).length === 2) {

        console.log("updated vendor data ", updatedVendorData);

        setEditVendorModal(null);
        return;

      }

      console.log("updated vendor data ", updatedVendorData);


      const result = await assignVendorToEnquery(updatedVendorData);


      console.log("updated data is ", updatedVendorData);

      // now we have to update the vendorAssignments array

      const updatedVendors = [...client.vendorAssignments];

      Object.keys(updatedVendorData).forEach((key, index) => {

        updatedVendors[idx][key] = updatedVendorData[key];

      })

      console.log("updated vendors data is ", updatedVendorData);

      setClient({ ...client, vendorAssignments: updatedData });

      setEditVendorData([]);


    } catch (error) {

      console.log("error is ", error);

    }

  }



  const handleSaveVendorChangesAtQuotes = async (versionIndex, itemIndex, vendorIdx) => {

    try {

      const updatedDummyData = [...dummyData];

      const updatedVendorData = editVendorDataAtQuotes[`${versionIndex}-${itemIndex}-${vendorIdx}`];

      updatedDummyData[versionIndex].items[itemIndex].vendors[vendorIdx] = {

        ...updatedDummyData[versionIndex].items[itemIndex].vendors[vendorIdx],
        ...updatedVendorData

      }

      setDummyData(updatedDummyData);

      setEditingVendorKey({});

    } catch (error) {

      console.log("error is ", error);

    }
  }



  const handleDeleteVendor = async (vendorId) => {

    try {

      // const result = await deleteVendorFromEnquery({vendorId, enqueryId: client._id});
      // Make a call to the `deleteVendorFromEnquery` function to delete the vendor.
      const result = await deleteVendorFromEnquery({ vendorId, enqueryId: client._id });

      // now we have to filter out the vendorAssignments array
      // Filter out the vendor from the `vendorAssignments` array.

      const updatedVendors = client.vendorAssignments.filter((vendor) => vendor.vendorId !== vendorId);

      console.log("updated vemdors ", updatedVendors)
      console.log("updated vendors ", updatedVendors);

      setClient({ ...client, vendorAssignments: updatedVendors });
      // Update the `client` state with the new `vendorAssignments` array.


    } catch (error) {

      console.log("error is ", error);

    }

  };


  const handleDeleteVendorAtQuotes = async (vendorId, itemIndex, versionIndex) => {
    try {
      // Send API request
      // const result = await deleteVendorFromEnqueryAtQuotes({ vendorId, enqueryId: client._id });

      // Clone the existing data
      const updatedData = [...dummyData]; // array of quote versions

      // Filter out the vendor for the correct item
      updatedData[versionIndex].items[itemIndex].vendors = updatedData[versionIndex].items[itemIndex].vendors.filter(
        (vendor) => vendor.vendorId !== vendorId
      );

      setDummyData(updatedData); // update state

    } catch (error) {

      console.log("Error deleting vendor: ", error);

    }

  };


  const addNewVendorAtQuotes = async (versionIndex, itemIndex) => {


    console.log("add new vendor ke andar ", versionIndex, itemIndex);

    const updatedData = [...dummyData];

    let updatedVendors = updatedData[versionIndex].items[itemIndex].vendors;

    console.log("updated vendors ", updatedVendors);

    if (!updatedVendors) {

      console.log("vendors array naii hai");

      updatedVendors = [];

    }

    console.log("updatedVendors at the add new vendor ke andar ", updatedVendors);

    updatedVendors.push({

      vendorId: "",
      description: "", // Optional
      quantity: "",
      costPerUnit: "",
      advance: "",
      deliveryDate: Date.now(),

    });


    updatedData[versionIndex].items[itemIndex].vendors = updatedVendors;

    setDummyData(updatedData);

    handleEditVendorAtQuotes(versionIndex, itemIndex, updatedData[versionIndex].items[itemIndex].vendors.length - 1);

  }


  const addVersionDataAtQuotes = async () => {



  }



  const handleNewVendorAssignToEnqueryHandler = async (data) => {

    try {

      console.log("handle new vendor assign handler ke andar  ", data);

      // enqueryId, vendorId

      data.enqueryId = client._id;

      data.vendorId = "";

      const result = await assignVendorToEnquery(data);

      setClient({ ...client, vendorAssignments: [...client.vendorAssignments, result] });

    } catch (error) {

      console.log("error is ", error);

    }

  }


  const NewFollowUpAddHandler = async (data) => {

    try {

      data.enqueryId = client._id;

      console.log("add new follow up handler ke andar ", data);

      setClient({ ...client, followUps: [...client.followUps, data] });

    } catch (error) {

      console.log("error is", error);

    }

  }



  const addNewQuotation = async (data) => {

    console.log("submit handler data ", data);

    const formData = new FormData();

    console.log("client id is ", client._id);

    formData.append("clientId", client._id);

    formData.append("taxPercentage", data.taxPercentage);

    formData.append("transport", data.transport);

    formData.append("installation", data.installation);

    formData.append("totalAmount", data.totalAmount);

    formData.append("reason", data.reason);

    formData.append("image", data.image);

    // if (data?.items?.length) {
    //   data.items.forEach((item, index) => {
    //     formData.append(`items[${index}][description]`, item.description);
    //     formData.append(`items[${index}][hsn]`, item.hsn);
    //     formData.append(`items[${index}][unit]`, item.unit);
    //     formData.append(`items[${index}][quantity]`, item.quantity);
    //     formData.append(`items[${index}][finalUnitPrice]`, item.finalUnitPrice);
    //     formData.append(`items[${index}][subtotal]`, item.subtotal);
    //   });
    // }

    formData.append("items", JSON.stringify(data.items)); // Important!

    console.log("form data is ", formData.get("clientId"));

    console.log("items data ", JSON.parse(formData.get("items")));


    try {

      // const result = await addNewQuotationToClient(formData);

      // console.log("result ka data ", result);

      setDummyData([...dummyData, data]);

      setAddNewQuoteFormModal(false);

    } catch (error) {

      console.log("error is ", error);

    }

  };


  const editItemChangeHandler = (e) => {

    const { name, value } = e.target.value;
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        name: value
      }
    }));

  }



  const data = useMemo(() => [client], [client]);

  const columns = useMemo(
    () =>
      Object.keys(client)
        .filter((key) => typeof client[key] !== 'object') // skip arrays/objects
        .map((key) => ({
          accessorKey: key,
          header: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        })),
    [client]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  useEffect(() => {

    console.log("hellow ");

  }, [editingVendorKey]);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Card className="overflow-auto p-5 space-y-8">
        {/* Client Info Table */}
        <div>
          <h2 className="text-xl font-bold mb-3">Client Info</h2>
          <Card className="overflow-auto">
            <table className="min-w-full border">
              <thead className="bg-muted text-xs font-medium text-gray-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="border px-3 py-2 text-left">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="text-sm">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="border px-3 py-2">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>

        {/* Vendor Assignments */}

        <div className=''>

          <div className='flex justify-between items-center py-2'>

            <h2 className="text-xl font-bold mb-3">Vendor Assignments</h2>

            <Button onClick={() => setAddNewVendorModal(true)}>Add Vendor </Button>

            {/* <Button>Add Vendor</Button> */}

          </div>
          <table className="min-w-full border text-sm">
            <thead className="bg-muted">
              <tr>

                {

                  vendor_label_data.map((data) => (

                    <th className="border px-3 py-2">{data}</th>

                  ))
                }
              </tr>
            </thead>

            {/* vendor assignment */}

            <tbody>
              {client.vendorAssignments.map((vendor, idx) => (
                <tr key={idx} className="border-b">
                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="text"
                        value={editVendorModal === idx ? editVendorData[idx].vendorName || "" : vendor.vendorName}
                        name='vendorName'
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.vendorName
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="text"
                        name='productDescription'
                        value={editVendorModal === idx ? editVendorData[idx].productDescription || "" : vendor.productDescription}
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.productDescription
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="number"
                        value={editVendorModal === idx ? editVendorData[idx].advancePaid || "" : vendor.advancePaid}
                        name='advancePaid'
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.advancePaid
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="number"
                        value={editVendorModal === idx ? editVendorData[idx].estimatedCost || "" : vendor.estimatedCost}
                        name='estimatedCost'
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.estimatedCost
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="number"
                        value={editVendorModal === idx ? editVendorData[idx].quantity || "" : vendor.quantity}
                        name='quantity'
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.quantity
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <input
                        type="date"
                        name='deliveryEstimate'
                        value={editVendorModal === idx ? editVendorData[idx].deliveryEstimate || "" : vendor.deliveryEstimate}
                        onChange={handleVendorDetailsChangeHandler}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      vendor.deliveryEstimate
                    )}
                  </td>

                  <td className="border px-3 py-2">
                    {editVendorModal === idx ? (
                      <select onChange={handleVendorDetailsChangeHandler} name='deliveryStatus' value={editVendorModal === idx ? editVendorData[idx].deliveryStatus || "" : vendor.deliveryStatus}>

                        {

                          delivery_status.map((status, idx) => (
                            <option key={idx} value={status}>{status}</option>
                          ))
                        }

                      </select>

                    ) : (

                      vendor.deliveryStatus

                    )}
                  </td>

                  <td className="border px-3 py-2 flex gap-3">
                    {

                      editVendorModal === idx ? (<button onClick={() => handleSaveVendor(idx)}>Save</button>) : (

                        <TiEdit size={30} onClick={() => handleEditVendor(idx)} className="cursor-pointer" />

                      )
                    }

                    <MdDeleteForever size={30} onClick={() => handleDeleteVendor(vendor.vendorId)} className="cursor-pointer" />

                  </td>
                </tr>

              ))}
            </tbody>

          </table>


        </div>



        {/* add new vendor modal */}

        {

          addNewVendorModal && <AddNewVendorForm

            setAddNewVendorModal={setAddNewVendorModal}
            setNewVendorAssingmentFormData={setNewVendorAssingmentFormData}
            handleNewVendorAssignToEnqueryHandler={handleNewVendorAssignToEnqueryHandler}

          />

        }

        {/* add new follow up modal */}

        {

          addNewFollowUpModal && <AddNewFollowUp

            setAddNewFollowUpModal={setAddNewFollowUpModal}
            NewFollowUpAddHandler={NewFollowUpAddHandler}

          ></AddNewFollowUp>

        }

        {/*  Add New Quote Form Modal  */}

        {

          addNewQuoteFormModal && <AddNewQuoteForm
            setAddNewQuoteFormModal={setAddNewQuoteFormModal}
            addNewQuotation={addNewQuotation}

          />
        }

        {/* Follow Ups */}

        <div>

          <div className='flex justify-between items-center'>

            <h2 className="text-xl font-bold mb-3">Follow Ups</h2>

            <Button onClick={() => setAddNewFollowUpModal(true)}>Add Follow Up</Button>

          </div>

          {client.followUps.map((followUp, idx) => (
            <div key={idx} className="mb-4">
              <table className="min-w-full border mt-2 text-sm">
                <thead className="bg-muted">
                  <tr>

                    <th className="border px-3 py-2">Follow-Up Date</th>
                    <th className="border px-3 py-2">Note</th>
                    <th className="border px-3 py-2">Status</th>
                    <th className="border px-3 py-2">Message</th>
                    <th className="border px-3 py-2">Responded By</th>
                    <th className="border px-3 py-2">Responded At</th>
                    <th className='border px-3 py-2'>Delete Edit </th>

                  </tr>
                </thead>


                {

                  followUp.responses.length > 0 && (

                    <tbody>
                      {followUp.responses.map((resp, ridx) => (
                        <tr key={ridx} className="border-b">
                          <td className="border px-3 py-2">{followUp.followUpDate}</td>
                          <td className="border px-3 py-2">{followUp.followUpNote}</td>
                          <td className="border px-3 py-2">{followUp.done ? "Done" : "Pending"}</td>
                          <td className="border px-3 py-2">{resp.message}</td>
                          <td className="border px-3 py-2">{resp.respondedBy}</td>
                          <td className="border px-3 py-2">{resp.respondedAt}</td>
                          <td className="border px-3 py-2">

                            <MdDeleteForever size={30} onClick={() => handleDeleteFollowUp(followUp.followUpId)} className="cursor-pointer" />

                          </td>

                        </tr>
                      ))}
                    </tbody>

                  )
                }
              </table>
            </div>
          ))}

        </div>

        {/* Quotes rivisons and other info  and also update the Quote */}

        <div>

          <div className='flex justify-between items-center'>

            <h2 className="text-xl font-bold mb-3">Quote Rivisons</h2>

            <Button onClick={() => setAddNewQuoteFormModal(true)}>Add New Quote</Button>

          </div>


          <table className="w-full border-collapse border text-sm text-left">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Version</th>
                <th className="border px-3 py-2">Item Description</th>
                <th className="border px-3 py-2">HSN</th>
                <th className="border px-3 py-2">Unit</th>
                <th className="border px-3 py-2">Qty</th>
                <th className="border px-3 py-2">Final Unit Price</th>
                <th className="border px-3 py-2">Tax %</th>
                <th className="border px-3 py-2">Transport</th>
                <th className="border px-3 py-2">Installation</th>
                <th className="border px-3 py-2">Vendor ID</th>
                <th className="border px-3 py-2">Vendor Desc</th>
                <th className="border px-3 py-2">Vendor Qty</th>
                <th className="border px-3 py-2">Cost/Unit</th>
                <th className="border px-3 py-2">Advance</th>
                <th className="border px-3 py-2">Delivery Date</th>
                <th className='border  px-3 py-2'>Edit & Remove Vendor</th>
                <th className='border  px-3 py-2'>Add New Vendor</th>
              </tr>
            </thead>
            <tbody>
              {dummyData?.map((quote, versionIdx) =>
                quote.items.map((item, itemIdx) => {
                  const hasVendors = item.vendors && item.vendors.length > 0;
                  const mainRowKey = `${versionIdx}-${itemIdx}`;

                  console.log("editing item key ", editItemKey);

                  if (editItemKey.length > 0 && isMainRowEditing) {

                    console.log("aa gaya");

                    let check = editItemKey == mainRowKey;

                    console.log("")
                    setMainRowEditing(check);

                  }


                  return hasVendors ? (
                    item.vendors.map((vendor, vendorIdx) => {
                      const rowKey = `${versionIdx}-${itemIdx}-${vendorIdx}`;
                      const isEditing = editingVendorKey === rowKey;

                      return (
                        <tr key={rowKey} className="border-b">
                          {vendorIdx === 0 && (
                            <>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{quote.version}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{item.description}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{item.hsn}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{item.unit}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{item.quantity}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>₹{item.finalUnitPrice}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>{quote.taxPercent}%</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>₹{quote.transport}</td>
                              <td className="border px-3 py-2" rowSpan={item.vendors.length}>₹{quote.installation}</td>
                            </>
                          )}

                          {/* Vendor Fields */}
                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                name="vendorId"
                                value={editVendorDataAtQuotes[rowKey]?.vendorId || ""}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              vendor.vendorId
                            )}
                          </td>

                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="text"
                                name="description"
                                value={editVendorDataAtQuotes[rowKey]?.description || ""}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              vendor.description
                            )}
                          </td>

                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="number"
                                name="quantity"
                                value={editVendorDataAtQuotes[rowKey]?.quantity || ""}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              vendor.quantity
                            )}
                          </td>

                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="number"
                                name="costPerUnit"
                                value={editVendorDataAtQuotes[rowKey]?.costPerUnit || ""}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              `₹${vendor.costPerUnit}`
                            )}
                          </td>

                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="number"
                                name="advance"
                                value={editVendorDataAtQuotes[rowKey]?.advance || ""}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              `₹${vendor.advance}`
                            )}
                          </td>

                          <td className="border px-3 py-2">
                            {isEditing ? (
                              <input
                                type="date"
                                name="deliveryDate"
                                value={formatDateForInput(editVendorDataAtQuotes[rowKey]?.deliveryDate)}
                                onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                                className="w-full px-2 py-1 border rounded"
                              />
                            ) : (
                              new Date(vendor.deliveryDate).toLocaleDateString()
                            )}
                          </td>

                          <td className="border px-3 py-2 flex gap-3">
                            {isEditing ? (
                              <Button onClick={() => handleSaveVendorChangesAtQuotes(versionIdx, itemIdx, vendorIdx)}>Save</Button>
                            ) : (
                              <Button onClick={() => handleEditVendorAtQuotes(versionIdx, itemIdx, vendorIdx)}>Edit</Button>
                            )}

                            <Button className="bg-slate-600 rounded-full p-2" onClick={() => handleDeleteVendorAtQuotes(vendor.vendorId, itemIdx, versionIdx)}>
                              Delete
                            </Button>
                          </td>

                          {vendorIdx === 0 && (
                            <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                              <Button onClick={() => addNewVendorAtQuotes(versionIdx, itemIdx)}>Add New Vendor</Button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr key={`${versionIdx}-${itemIdx}-no-vendor`} className="border-b">
                      <td className="border px-3 py-2">{quote.version}</td>

                      <td className="border px-3 py-2">
                        {isMainRowEditing ? (
                          <Input
                            name="description"
                            value={editItemDataAtQuotes[mainRowKey]?.description || ""}
                            onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                          />
                        ) : (
                          item.description
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {isMainRowEditing ? (
                          <Input
                            name="hsn"
                            value={editItemDataAtQuotes[mainRowKey]?.hsn || ""}
                            onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                          />
                        ) : (
                          item.hsn
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {isMainRowEditing ? (
                          <Input
                            name="unit"
                            value={editItemDataAtQuotes[mainRowKey]?.unit || ""}
                            onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                          />
                        ) : (
                          item.unit
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {isMainRowEditing ? (
                          <Input
                            name="quantity"
                            type="number"
                            value={editItemDataAtQuotes[mainRowKey]?.quantity || ""}
                            onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                          />
                        ) : (
                          item.quantity
                        )}
                      </td>

                      <td className="border px-3 py-2">
                        {isMainRowEditing ? (
                          <Input
                            name="finalUnitPrice"
                            type="number"
                            value={editItemDataAtQuotes[mainRowKey]?.finalUnitPrice || ""}
                            onChange={(e) => handleItemDetailsChangeHandlerAtQuotes(e, mainRowKey)}
                          />
                        ) : (
                          `₹${item.finalUnitPrice}`
                        )}
                      </td>

                      <td className="border px-3 py-2">{quote.taxPercent}%</td>
                      <td className="border px-3 py-2">₹{quote.transport}</td>
                      <td className="border px-3 py-2">₹{quote.installation}</td>
                      <td className="border px-3 py-2 text-center" colSpan={6}>No vendors assigned</td>
                      <td className="border px-3 py-2" colSpan={2}>
                        <Button onClick={() => addNewVendorAtQuotes(versionIdx, itemIdx)}>Add New Vendor</Button>
                      </td>
                      <td className="border px-3 py-2" colSpan={2}>
                        <Button onClick={() => handleEditItemAtQuotes(versionIdx,itemIdx)}>Edit iTem</Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>


          </table>

        </div>

      </Card>
    </div>
  );
}



