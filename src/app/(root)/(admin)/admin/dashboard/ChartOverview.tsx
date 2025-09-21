"use client"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart"

const chartData = [
    { month: "January", amount: 186 },
    { month: "February", amount: 305 },
    { month: "March", amount: 237 },
    { month: "April", amount: 73 },
    { month: "May", amount: 209 },
    { month: "June", amount: 214 },
    { month: "June", amount: 414 },
    { month: "July", amount: 267 },
    { month: "September", amount: 384 },
    { month: "October", amount: 155 },
    { month: "November", amount: 514 },
    { month: "December", amount: 454 },
]

const chartConfig = {
    amount: {
        label: "Amount",
        color: "#8e51ff",
    },
} satisfies ChartConfig

export function OrderOverview() {
    return (
        <div>
        <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                    cursor={true}
                    content={<ChartTooltipContent />}
                />
                <Bar dataKey="amount" fill="var(--color-amount)" radius={8} />
            </BarChart>
        </ChartContainer>
        </div>
    )
}
