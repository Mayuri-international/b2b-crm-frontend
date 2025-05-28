'use client'

import { Button } from "../ui/button";
import { qouteTablesHeader, user_role } from "@/lib/data";
import { useState } from "react";
import { formatDateForInput } from '@/lib/utils';
import AddNewQuoteForm from "./NewQuoteForm";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import {
  updateVendorDataAtQuotes,
  addNewVendor,
  deleteVendor,
  setLoading,
  setError,
  addNewQuote
} from "@/app/store/slice/quoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { handleAxiosError } from "@/lib/handleAxiosError";
import { addNewQuotationToClient } from "@/lib/api";
import { useForm } from "react-hook-form";

import { clearAllQuoteData } from "@/app/store/slice/quoteSlice";

export default function QuoteRivisionComponent({ dummyData, client, setClient }) {
  const dispatch = useDispatch();
  const { data: quoteData, loading, error } = useSelector((state) => state.quote);
  const membersData = useSelector((state) => state.members.data);
  const { register, handleSubmit, formState: { errors } } = useForm();

  // dispatch(clearAllQuoteData());
  
  // Use quoteData instead of dummyData for Redux state
  const data = quoteData || dummyData;
  
  // Filter vendors from members data
  const vendorData = membersData?.filter((val) => val.role === user_role.vendor) || [];

  // Helper function to get vendor name by ID
  const getVendorNameById = (vendorId) => {
    const vendor = vendorData.find(v => v._id === vendorId);
    return vendor ? vendor.name : 'Unknown Vendor';
  };

  const [addNewQuoteFormModal, setAddNewQuoteFormModal] = useState(false);
  const [isMainRowEditing, setMainRowEditing] = useState(false);
  const [editItemDataAtQuotes, setEditItemDataAtQuotes] = useState({});
  const [editItemKey, setEditItemKey] = useState({});
  const [editingVendorKey, setEditingVendorKey] = useState(null);
  const [editVendorDataAtQuotes, setEditVendorDataAtQuotes] = useState({});
  const [editingQuoteIndex, setEditingQuoteIndex] = useState(null);
  const [editQuoteData, setEditQuoteData] = useState({}); // this is the main thing 


  const handleVendorDetailsChangeHandlerAtQuotes = (e, key) => {
    const { name, value } = e.target;
    setEditVendorDataAtQuotes((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: name === "vendorId" ? value : 
                name === "quantity" || name === "costPerUnit" || name === "advance"
                ? Number(value)
                : value,
      },
    }));
  };

  const addNewVendorAtQuotes = async (versionIndex, itemIndex) => {
    try {
      dispatch(setLoading(true));
      const newVendor = {
        vendorId: "",
        description: "",
        quantity: "",
        costPerUnit: "",
        advance: "",
        deliveryDate: Date.now(),
      };

      dispatch(addNewVendor({ versionIndex, itemIndex, vendor: newVendor }));
      handleEditVendorAtQuotes(versionIndex, itemIndex, data[versionIndex].items[itemIndex].vendors.length);
    } catch (error) {
      dispatch(setError(error.message));
      handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditItemAtQuotes = (quoteIndex, itemIndex) => {
    const itemKey = `${quoteIndex}-${itemIndex}`;
    const item = data[quoteIndex].items[itemIndex];
    setEditItemKey(itemKey);
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [itemKey]: { ...item }
    }));
    setEditingQuoteIndex(itemKey);
    setEditQuoteData({ ...data[quoteIndex] });
  };

  const handleQuoteFieldChange = (e) => {
    const { name, value } = e.target;
    setEditQuoteData(prev => ({
      ...prev,
      [name]: ["taxPercentage", "transport", "installation", "totalAmount"].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSaveVendorChangesAtQuotes = async (versionIndex, itemIndex, vendorIdx) => {
    try {
      // Validate required fields
      const vendorKey = `${versionIndex}-${itemIndex}-${vendorIdx}`;
      let vendorData = editVendorDataAtQuotes[vendorKey];
      
      if (!vendorData?.vendorId) {
        toast.error("Please select a vendor");
        return;
      }
      if (!vendorData?.description?.trim()) {
        toast.error("Please enter a description");
        return;
      }
      if (!vendorData?.quantity) {
        toast.error("Please enter quantity");
        return;
      }
      if (!vendorData?.costPerUnit) {
        toast.error("Please enter cost per unit");
        return;
      }
      if (!vendorData?.deliveryDate) {
        toast.error("Please select delivery date");
        return;
      }

      console.log("vendor key ",vendorKey);

      console.log("vendor data is",vendorData);

      // add version and item version

      vendorData = {
        ...vendorData,
        version: data[versionIndex].version,
        itemIndex: itemIndex,

      };

      console.log("vendor data is : ",vendorData);

      dispatch(setLoading(true));
      
      // Create a deep copy of the data to avoid mutation
      const updatedData = JSON.parse(JSON.stringify(data));
      
      // Get the vendor data from the edit state
      const updatedVendorData = editVendorDataAtQuotes[vendorKey];
      
      // Update the vendor data in the new array
      if (updatedData[versionIndex]?.items[itemIndex]?.vendors) {
        updatedData[versionIndex].items[itemIndex].vendors = [
          ...updatedData[versionIndex].items[itemIndex].vendors.slice(0, vendorIdx),
          {
            ...updatedData[versionIndex].items[itemIndex].vendors[vendorIdx],
            ...updatedVendorData
          },
          ...updatedData[versionIndex].items[itemIndex].vendors.slice(vendorIdx + 1)
        ];
      }

      // Dispatch the update with the new array
      dispatch(updateVendorDataAtQuotes(updatedData));
      setEditingVendorKey(null);
      toast.success("Vendor details updated successfully");
    } catch (error) {
      console.log("error is ", error);
      dispatch(setError(error.message));
      handleAxiosError(error);
      toast.error("Failed to update vendor details");
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleEditVendorAtQuotes = (quoteIndex, itemIndex, vendorIdx) => {
    const vendorKey = `${quoteIndex}-${itemIndex}-${vendorIdx}`;
    const itemKey = `${quoteIndex}-${itemIndex}`;
    const vendor = data[quoteIndex].items[itemIndex].vendors[vendorIdx];
    const item = data[quoteIndex].items[itemIndex];
    setEditingVendorKey(vendorKey);
    setEditVendorDataAtQuotes(prev => ({
      ...prev,
      [vendorKey]: { ...vendor }
    }));
  };

  const handleDeleteVendorAtQuotes = async (vendorId, itemIndex, versionIndex) => {
    try {
      dispatch(setLoading(true));
      dispatch(deleteVendor({ versionIndex, itemIndex, vendorId }));
    } catch (error) {
      dispatch(setError(error.message));
      handleAxiosError(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const editItemChangeHandler = (e, key) => {
    const { name, value } = e.target;
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value
      }
    }));
  }

  const addNewQuotation = async (formData) => {
    try {
      dispatch(setLoading(true));
      
      // Call the API to add new quotation
      const response = await addNewQuotationToClient(formData);

      console.log("response ka data at add new quotation", response.data);
      
        dispatch(addNewQuote(response.data));
        setAddNewQuoteFormModal(false);
        toast.success("Quote added successfully!");

    } catch (error) {

      console.log("error is ", error);

      console.error("Error adding quote:", error);
      dispatch(setError(error.message));
      handleAxiosError(error);
      toast.error("Failed to add quote");

    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSaveEditItemAtQuotes = async (versionIdx, itemIdx) => {
    try {
      const itemKey = `${versionIdx}-${itemIdx}`;
      const editedItem = editItemDataAtQuotes[itemKey];
      if (!editedItem) {
        toast.error("No changes to save.");
        return;
      }
      const updatedData = [...data];
      updatedData[versionIdx].items[itemIdx] = {
        ...updatedData[versionIdx].items[itemIdx],
        ...editedItem,
      };
      setEditItemKey({});
      setEditItemDataAtQuotes({});
      setEditingQuoteIndex({});
    } catch (error) {
      console.log("error is ", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="w-screen max-w-[96%] overflow-x-scroll">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center mb-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-bold mb-3">Quote Rivisons</h2>
        <Button onClick={() => setAddNewQuoteFormModal(true)}>Add New Quote</Button>
      </div>
      <table className="w-full border-collapse border text-sm text-left">
        <thead>
          <tr className="bg-gray-100">
            {qouteTablesHeader.map((data) => (
              <th className="border px-3 py-2">{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.map((quote, versionIdx) =>
            quote?.items?.map((item, itemIdx) => {
              const hasVendors = item.vendors && item.vendors.length > 0;
              const mainRowKey = `${versionIdx}-${itemIdx}`;
              const isEditingMainItem = editItemKey === mainRowKey;
              return hasVendors ? (
                item.vendors.map((vendor, vendorIdx) => {
                  const rowKey = `${versionIdx}-${itemIdx}-${vendorIdx}`;
                  const isEditing = editingVendorKey === rowKey;
                  return (
                    <tr key={rowKey} className="border-b">
                      {vendorIdx === 0 && (
                        <>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>{quote.version}</td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                            {isEditingMainItem && editItemDataAtQuotes ? (
                              <input
                                name="description"
                                value={editItemDataAtQuotes[mainRowKey]?.description || ""}
                                onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                                className="border px-2 py-2"
                              />
                            ) : (
                              item.description
                            )}
                          </td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                            {isEditingMainItem && editItemDataAtQuotes ? (
                              <input
                                name="hsn"
                                type="text"
                                value={editItemDataAtQuotes[mainRowKey]?.hsn || ""}
                                onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                                className="border px-2 py-2"
                              />
                            ) : (
                              item.hsn
                            )}
                          </td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                            {isEditingMainItem && editItemDataAtQuotes ? (
                              <input
                                name="unit"
                                type="text"
                                value={editItemDataAtQuotes[mainRowKey]?.unit || ""}
                                onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                                className="border px-2 py-2"
                              />
                            ) : (
                              item.unit
                            )}
                          </td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                            {isEditingMainItem && editItemDataAtQuotes ? (
                              <input
                                name="quantity"
                                type="text"
                                value={editItemDataAtQuotes[mainRowKey]?.quantity || ""}
                                onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                                className="border px-2 py-2"
                              />
                            ) : (
                              item.quantity
                            )}
                          </td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>
                            {isEditingMainItem && editItemDataAtQuotes ? (
                              <input
                                name="finalUnitPrice"
                                type="number"
                                value={editItemDataAtQuotes[mainRowKey]?.finalUnitPrice || ""}
                                onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                                className="border px-2 py-2"
                              />
                            ) : (
                              `₹${item.finalUnitPrice}`
                            )}
                          </td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>{quote.taxPercent}%</td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>₹{quote.transport}</td>
                          <td className="border px-3 py-2" rowSpan={item.vendors.length}>₹{quote.installation}</td>
                        </>
                      )}
                      {/* Vendor Fields */}
                      <td className="border px-3 py-2 min-w-xs">
                        {isEditing ? (
                          <select 
                            name="vendorId" 
                            value={editVendorDataAtQuotes[rowKey]?.vendorId || ""}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className={`w-full px-2 py-1 border rounded bg-white ${
                              !editVendorDataAtQuotes[rowKey]?.vendorId ? 'border-red-500' : ''
                            }`}
                          >
                            <option value="">Select a vendor *</option>
                            {vendorData.map((vendor) => (
                              <option key={vendor._id} value={vendor._id}>
                                {vendor.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          getVendorNameById(vendor.vendorId)
                        )}
                      </td>
                      <td className="border px-3 py-2 relative min-w-xs">
                        {isEditing ? (
                          <input
                            type="text"
                            name="description"
                            value={editVendorDataAtQuotes[rowKey]?.description || ""}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className={`w-full px-2 border rounded h-16 text-start ${
                              !editVendorDataAtQuotes[rowKey]?.description?.trim() ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter description *"
                          />
                        ) : (
                          vendor.description
                        )}
                      </td>
                      <td className="border px-3 py-2 min-w-[150px]">
                        {isEditing ? (
                          <input
                            type="number"
                            name="quantity"
                            value={editVendorDataAtQuotes[rowKey]?.quantity || ""}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className={`w-full px-2 py-1 border rounded ${
                              !editVendorDataAtQuotes[rowKey]?.quantity ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter quantity *"
                            min="1"
                          />
                        ) : (
                          vendor.quantity
                        )}
                      </td>
                      <td className="border px-3 py-2 min-w-[150px]">
                        {isEditing ? (
                          <input
                            type="number"
                            name="costPerUnit"
                            value={editVendorDataAtQuotes[rowKey]?.costPerUnit || ""}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className={`w-full px-2 py-1 border rounded ${
                              !editVendorDataAtQuotes[rowKey]?.costPerUnit ? 'border-red-500' : ''
                            }`}
                            placeholder="Enter cost per unit *"
                            min="0"
                          />
                        ) : (
                          `₹${vendor.costPerUnit}`
                        )}
                      </td>
                      <td className="border px-3 py-2 min-w-[150px]">
                        {isEditing ? (
                          <input
                            type="number"
                            name="advance"
                            value={editVendorDataAtQuotes[rowKey]?.advance || ""}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className="w-full px-2 py-1 border rounded"
                            placeholder="Enter advance amount"
                            min="0"
                          />
                        ) : (
                          `₹${vendor.advance}`
                        )}
                      </td>
                      <td className="border px-3 py-2 min-w-[150px]">
                        {isEditing ? (
                          <input
                            type="date"
                            name="deliveryDate"
                            value={formatDateForInput(editVendorDataAtQuotes[rowKey]?.deliveryDate)}
                            onChange={(e) => handleVendorDetailsChangeHandlerAtQuotes(e, rowKey)}
                            className={`w-full px-2 py-1 border rounded ${
                              !editVendorDataAtQuotes[rowKey]?.deliveryDate ? 'border-red-500' : ''
                            }`}
                            required
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
                      {vendorIdx === 0 && (
                        <td className="border px-3 py-2" >
                          {editingQuoteIndex === mainRowKey ? (
                            <div className="flex gap-3">
                              <Button onClick={() => handleSaveEditItemAtQuotes(versionIdx, itemIdx)}>Save</Button>
                              <Button onClick={() => {
                                setEditingQuoteIndex({});
                                setEditItemDataAtQuotes({});
                                setEditItemKey({});
                              }}>Cancel</Button>
                            </div>
                          ) : (
                            <Button onClick={() => handleEditItemAtQuotes(versionIdx, itemIdx)}>Edit iTem</Button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr key={`${versionIdx}-${itemIdx}-no-vendor`} className="border-b">
                  <td className="border px-3 py-2">{quote.version}</td>
                  <td className="border px-3 py-2">
                    {isEditingMainItem && editItemDataAtQuotes ? (
                      <input
                        name="description"
                        value={editItemDataAtQuotes[mainRowKey]?.description || ""}
                        onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                        className="border px-2 py-2"
                      />
                    ) : (
                      item.description
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {isEditingMainItem && editItemDataAtQuotes ? (
                      <input
                        name="hsn"
                        type="text"
                        value={editItemDataAtQuotes[mainRowKey]?.hsn || ""}
                        onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                        className="border px-2 py-2"
                      />
                    ) : (
                      item.hsn
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {isEditingMainItem && editItemDataAtQuotes ? (
                      <input
                        name="unit"
                        type="text"
                        value={editItemDataAtQuotes[mainRowKey]?.unit || ""}
                        onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                        className="border px-2 py-2"
                      />
                    ) : (
                      item.unit
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {isEditingMainItem && editItemDataAtQuotes ? (
                      <input
                        name="quantity"
                        type="text"
                        value={editItemDataAtQuotes[mainRowKey]?.quantity || ""}
                        onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                        className="border px-2 py-2"
                      />
                    ) : (
                      item.quantity
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {isEditingMainItem && Object.keys(editItemDataAtQuotes).length != 0 ? (
                      <input
                        name="finalUnitPrice"
                        type="number"
                        value={editItemDataAtQuotes[mainRowKey]?.finalUnitPrice || ""}
                        onChange={(e) => editItemChangeHandler(e, mainRowKey)}
                        className="border px-2 py-2"
                      />
                    ) : (
                      `₹${item.finalUnitPrice}`
                    )}
                  </td>
                  <td className="border px-3 py-2">
                    {quote.taxPercent}
                  </td>
                  <td className="border px-3 py-2">₹{quote.transport}</td>
                  <td className="border px-3 py-2">₹{quote.installation}</td>
                  <td className="border px-3 py-2 text-center" colSpan={6}>No vendors assigned</td>
                  <td className="border px-3 py-2" colSpan={2}>
                    <Button onClick={() => addNewVendorAtQuotes(versionIdx, itemIdx)}>Add New Vendor</Button>
                  </td>
                  <td className="border px-3 py-2" >
                    {editingQuoteIndex === mainRowKey ? (
                      <div className="flex gap-3">
                        <Button onClick={() => handleSaveEditItemAtQuotes(versionIdx, itemIdx)}>Save</Button>
                        <Button onClick={() => {
                          setEditingQuoteIndex({});
                          setEditItemDataAtQuotes({});
                          setEditItemKey({});
                        }}>Cancel</Button>
                      </div>
                    ) : (
                      <Button onClick={() => handleEditItemAtQuotes(versionIdx, itemIdx)}>Edit iTem</Button>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {/*  Add New Quote Form Modal  */}
      {addNewQuoteFormModal && <AddNewQuoteForm
        dummyData={data}
        setAddNewQuoteFormModal={setAddNewQuoteFormModal}
        addNewQuotation={addNewQuotation}
        client={client}
      />}
    </div>
  )
}

