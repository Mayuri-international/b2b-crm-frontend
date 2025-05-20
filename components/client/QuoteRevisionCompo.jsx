'use client'

import { Button } from "../ui/button";
import { qouteTablesHeader } from "@/lib/data";
import { useState } from "react";
import { formatDateForInput } from '@/lib/utils';
import AddNewQuoteForm from "./NewQuoteForm";
import { Input } from "../ui/input";
import toast from "react-hot-toast";

export default function QuoteRivisionComponent({ dummyData, setDummyData, client, setClient }) {

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
        [name]:
          name === "quantity" || name === "costPerUnit" || name === "advance"
            ? Number(value)
            : value,
      },
    }));
  };

  const addNewVendorAtQuotes = async (versionIndex, itemIndex) => {
    const updatedData = [...dummyData];
    let updatedVendors = updatedData[versionIndex].items[itemIndex].vendors;
    if (!updatedVendors) {
      updatedVendors = [];
    }
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

  const handleEditItemAtQuotes = (quoteIndex, itemIndex) => {
    const itemKey = `${quoteIndex}-${itemIndex}`;
    const item = dummyData[quoteIndex].items[itemIndex];
    setEditItemKey(itemKey);
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [itemKey]: { ...item }
    }));
    setEditingQuoteIndex(itemKey);
    setEditQuoteData({ ...dummyData[quoteIndex] });
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

  const handleEditVendorAtQuotes = (quoteIndex, itemIndex, vendorIdx) => {
    const vendorKey = `${quoteIndex}-${itemIndex}-${vendorIdx}`;
    const itemKey = `${quoteIndex}-${itemIndex}`;
    const vendor = dummyData[quoteIndex].items[itemIndex].vendors[vendorIdx];
    const item = dummyData[quoteIndex].items[itemIndex];
    setEditingVendorKey(vendorKey);
    setEditVendorDataAtQuotes(prev => ({
      ...prev,
      [vendorKey]: { ...vendor }
    }));
    setEditItemDataAtQuotes(prev => ({
      ...prev,
      [itemKey]: { ...item }
    }));
    setEditItemKey(itemKey);
  };

  const handleDeleteVendorAtQuotes = async (vendorId, itemIndex, versionIndex) => {
    try {
      const updatedData = [...dummyData];
      updatedData[versionIndex].items[itemIndex].vendors = updatedData[versionIndex].items[itemIndex].vendors.filter(
        (vendor) => vendor.vendorId !== vendorId
      );
      setDummyData(updatedData);
    } catch (error) {
      console.log("Error deleting vendor: ", error);
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

  const addNewQuotation = async (data) => {
    const formData = new FormData();
    formData.append("clientId", client._id);
    formData.append("taxPercentage", data.taxPercentage);
    formData.append("transport", data.transport);
    formData.append("installation", data.installation);
    formData.append("totalAmount", data.totalAmount);
    formData.append("reason", data.reason);
    formData.append("image", data.image);
    formData.append("items", JSON.stringify(data.items)); // Important!
    try {
      setDummyData([...dummyData, data]);
      setAddNewQuoteFormModal(false);
    } catch (error) {
      console.log("error is ", error);
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
      const updatedDummyData = [...dummyData];
      updatedDummyData[versionIdx].items[itemIdx] = {
        ...updatedDummyData[versionIdx].items[itemIdx],
        ...editedItem,
      };
      setDummyData(updatedDummyData);
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
          {dummyData?.map((quote, versionIdx) =>
            quote.items.map((item, itemIdx) => {
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
        setAddNewQuoteFormModal={setAddNewQuoteFormModal}
        addNewQuotation={addNewQuotation}
      />}
    </div>
  )
}

