'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { taskAssigningStatus } from "@/lib/data";

import { useParams,useRouter } from "next/navigation";

import SpecificClientDetails from "@/components/client/SpecificClientDetails";

import axios from "axios";

import { format, parseISO } from 'date-fns';

import { fetchAllSalesPerson, fetchAllUserQueries, fetchUserQueries, assignSalesPersonToEnquery } from "@/lib/api";


export default function ClientDashboardPage() {

    const router = useRouter();

    const [clients, setClients] = useState(null);
    const [filters, setFilters] = useState({
        email: "",
        name: "",
        phone: "",
        date: "",
        status: "",
    });

    const [salesUsers, setSalesUsers] = useState(null);

    const [filteredClients, setFilteredClients] = useState(null);

    useEffect(() => {
        const updated = clients && clients.filter((client) => {
            const emailMatch = client.email?.toLowerCase().includes(filters.email.toLowerCase());
            const nameMatch = client.name?.toLowerCase().includes(filters.name.toLowerCase());
            const phoneMatch = client.phone?.toLowerCase().includes(filters.phone.toLowerCase());
            const statusMatch = filters.status ? client.status === filters.status : true;
            const dateMatch = filters.date
                ? new Date(client.date).toLocaleDateString() ===
                new Date(filters.date).toLocaleDateString()
                : true;
            return emailMatch && nameMatch && phoneMatch && statusMatch && dateMatch;
        });
        setFilteredClients(updated);
    }, [filters, clients]);

    const handleAssign = (clientId, userId) => {
        const updatedClients = clients.map(client =>
            client.id === clientId ? { ...client, assignedTo: userId, status: "Assigned" } : client
        );
        setClients(updatedClients);
    };

    function formatDate(dateString) {
        if (!dateString) return 'N/A'; // or return empty string, or show fallback text
        try {
            return format(parseISO(dateString), 'dd MMM yyyy, hh:mm a');
        } catch (err) {
            console.error("Invalid date string:", dateString, err);
            return 'Invalid date';
        }
    }

    async function selectSalesUser(enqueryId, salesPersonId) {

        try {

            console.log("clientId is ", enqueryId, "userId is ", salesPersonId);

            const response = await assignSalesPersonToEnquery({ enqueryId, salesPersonId });

            const updatedClients = clients.map(client =>
                client._id === enqueryId ? { ...client, assignedTo: salesPersonId, status: "Assigned" } : client
            );
            setClients(updatedClients);

        } catch (error) {

            console.log("error is ", error);

        }
    }


    useEffect(() => {

        async function fetchUserQueries() {

            try {

                const res = await fetchAllUserQueries();

                setClients(res);

            } catch (error) {

                console.log("error is ", error);

            }
        }

        async function fetchSalesPerson() {

            try {


                const result = await fetchAllSalesPerson();

                setSalesUsers(result);

            } catch (error) {

                console.log("error is ", error);

            }
        }


        fetchUserQueries();
        fetchSalesPerson();

    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl font-semibold mb-4">Client Inquiries list</h1>
                <Button>Download Excel</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <Label>Name</Label>
                    <Input
                        type="text"
                        placeholder="Search by name"
                        value={filters.name}
                        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Email</Label>
                    <Input
                        type="text"
                        placeholder="Search by email"
                        value={filters.email}
                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Phone</Label>
                    <Input
                        type="text"
                        placeholder="Search by phone"
                        value={filters.phone}
                        onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Date</Label>
                    <Input
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Status</Label>
                    <select
                        className="w-full border p-2 rounded"
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    >
                        <option value="">All</option>
                        {Object.values(taskAssigningStatus).map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <Card>
                <CardContent className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Requirement</TableHead>
                                <TableHead>Platform</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Website</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assign To</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients && filteredClients?.map(client => (
                                <TableRow key={client.id} onClick ={()=> router.push(`/client-dashboard/${client._id}`)}>
                                    <TableCell>{client.name}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>{client.requirement}</TableCell>
                                    <TableCell>{client.sourcePlatform}</TableCell>
                                    <TableCell>{client.phone}</TableCell>
                                    <TableCell>{formatDate(client.createdAt)}</TableCell>
                                    <TableCell>{client.sourceWebsite}</TableCell>
                                    <TableCell>
                                        <Badge variant={client.status === "Assigned" ? "default" : "outline"}>{client.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select onValueChange={value => selectSalesUser(client._id, value)}>
                                            <SelectTrigger>
                                                {client.assignedTo === "" ? (
                                                    <SelectValue placeholder="Assign" />
                                                ) : (
                                                    <SelectValue placeholder={client.assignedTo.name} />
                                                )}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {salesUsers && salesUsers.map(user => (
                                                    <SelectItem key={user._id} value={user._id}>{user.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

}


