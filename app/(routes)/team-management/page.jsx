'use client';

import * as React from 'react';

import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

const defaultData = [
  {
    id: 1,
    name: 'Abram Schleifer',
    email: 'abram@example.com',
    password: '********',
    role: 'Sales Assistant',
    office: 'Edinburgh',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: 2,
    name: 'Charlotte Anderson',
    email: 'charlotte@example.com',
    password: '********',
    role: 'Marketing Manager',
    office: 'London',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: 3,
    name: 'Ethan Brown',
    email: 'ethan@example.com',
    password: '********',
    role: 'Software Engineer',
    office: 'San Francisco',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
];

export default function TeamManagement() {
  const [data, setData] = useState(defaultData);
  const [globalFilter, setGlobalFilter] = useState('');

  const handleEdit = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

  const EditableCell = ({
    row,
    columnId,
    value,
  }) => {
    const [editingValue, setEditingValue] = React.useState(value);

    const handleCommit = () => {
      handleEdit(row.index, columnId, editingValue);
    };

    return (
      <Input
        value={editingValue}
        onChange={(e) => setEditingValue(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
      />
    );
  };

  const columns = [
    {
      header: 'User',
      accessorKey: 'name',
      cell: ({ row }) => {
        const member = row.original;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={member.image} alt={member.name} />
              <AvatarFallback>{member.name[0]}</AvatarFallback>
            </Avatar>
            <span>{member.name}</span>
          </div>
        );
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
      cell: ({ row, getValue }) => (
        <EditableCell
          row={row}
          columnId="email"
          value={getValue()}
        />
      ),
    },
    {
      header: 'Password',
      accessorKey: 'password',
      cell: ({ row, getValue }) => (
        <EditableCell
          row={row}
          columnId="password"
          value={getValue()}
        />
      ),
    },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row, getValue }) => (
        <EditableCell
          row={row}
          columnId="role"
          value={getValue()}
        />
      ),
    },
    {
      header: 'Office',
      accessorKey: 'office',
      cell: ({ row, getValue }) => (
        <EditableCell
          row={row}
          columnId="office"
          value={getValue()}
        />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-6">


      <h2 className="text-xl font-bold mb-4">Team Members</h2>

      <div className='flex justify-between items-center'>

        <div className="mb-4">
          <Input
            placeholder="Search..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
        </div>

        <div>

          <Button>Add New Member </Button>

        </div>

      </div>




      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
