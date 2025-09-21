import React from 'react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

const LatestOrders = () => {
    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Payment ID</TableHead>
                        <TableHead>Total Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>

                    {
                        Array.from({ length: 10 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell className="font-medium">{`INV00${i + 1}`}</TableCell>
                                <TableCell>{`PAY${i + 1}`}</TableCell>
                                <TableCell>3</TableCell>
                                <TableCell>Pending</TableCell>
                                <TableCell className='text-end'>100</TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </div>
    )
}

export default LatestOrders
