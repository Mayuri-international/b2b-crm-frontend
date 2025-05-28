'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { TiEdit } from "react-icons/ti";
import { MdAddBusiness, MdDeleteForever, MdSave } from "react-icons/md";

import AddNewFollowUp from '@/components/client/AddNewFollowUp';

import { Input } from '@/components/ui/input';

import { useQueryClient } from '@tanstack/react-query';

import { useParams } from 'next/navigation';

import { flattenObject } from '@/lib/utils';

import toast from 'react-hot-toast';

import { FollowUpCompo } from '@/components/client/FollowUpCompo';

import { qouteTablesHeader } from "../../../../lib/data";

import QuoteRivisionComponent from '@/components/client/QuoteRevisionCompo';

import { getAllQuote } from '@/lib/api';


import { useSelector, useDispatch } from 'react-redux';
import { setQuoteData } from '@/app/store/slice/quoteSlice';

import { handleAxiosError } from '@/lib/handleAxiosError';

export default function Clients() {

  const queryClient = useQueryClient();

  const { slug } = useParams();

  const dispatch = useDispatch();

  const cachedQueryData = queryClient.getQueryData(['clientQueries']);

  console.log("cachedQueryData", cachedQueryData);

  const quoteData = useSelector((state) => state.quote.data);

  // filtered Query Data 

  const filterQueryData = cachedQueryData && cachedQueryData.find((data) => data._id == slug);

  console.log("filter query data is ", filterQueryData);

  console.log("quote data is :", quoteData);


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
      totalAmount: 33000 + 22000 + 9900 + 1000 + 500, // Helper function below
      status: "Finalized"
    }

    ]

  )


  const [client, setClient] = useState(filterQueryData);


  const flattenedClient = useMemo(() => flattenObject(client), [client]);
  const data = useMemo(() => [flattenedClient], [flattenedClient]);

  console.log("data is ", data);

  const removedFields = [
    "_id",
    "createdAt",
    "assignedBy._id",
    "assignedTo._id",
    "updatedAt",
    "followUps",
    "attachments",
    "communicationNotes"
  ];

  const columns = useMemo(
    () =>
      Object.keys(flattenedClient)
        .filter((key) => !removedFields.includes(key)) // ← fix: compare the key itself
        .map((key) => ({
          accessorKey: key,
          accessorFn: (row) => row[key],
          header: key
            .replace(/\./g, ' → ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
        })),
    [flattenedClient]
  );


  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });


  console.log("data is ", data);

  useEffect(() => {

    console.log("quote data is :", quoteData);

    async function fetchQuoteData() {

      try {

        const result = await getAllQuote(client._id);

        dispatch(setQuoteData(result));

      } catch (error) {

        console.log("error is ", error);

        handleAxiosError(error);

      }

    }


    if (!quoteData) {

      fetchQuoteData();

    }


  }, []);


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


        {/* Follow Ups  Component */}

        <FollowUpCompo client={client} setClient={setClient}></FollowUpCompo>

        {/* Quotes rivisons and other info  and also update the Quote */}

        <QuoteRivisionComponent
          dummyData={quoteData}
          dispatch = {dispatch}
          client={client}
          setClient={setClient}
        />

      </Card>

    </div>
  );
}

