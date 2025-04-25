"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function CalendarExample() {
    const [date, setDate] = useState<DateRange | undefined>()
    const [data, setData] = useState<any[]>([])
    const [places, setPlaces] = useState<string[]>([])
    const [selectedPlace, setSelectedPlace] = useState<string>("")

    useEffect(() => {
        fetch("http://localhost:3001/places")
            .then(res => res.json())
            .then(data => {
                setPlaces(data)
                setSelectedPlace(data[0]) // автоматично обираємо перше значення
            })
    }, [])

    const handleClick = async () => {
        if (!date?.from || !date?.to || !selectedPlace) return
        const from = format(date.from, "yyyy-MM-dd")
        const to = format(date.to, "yyyy-MM-dd")
        const url = `http://localhost:3001/weather?place=${selectedPlace}&from=${from}&to=${to}`
        const res = await fetch(url)
        const json = await res.json()
        setData(json)
    }

    return (
        <div className="flex flex-col gap-4">
            <Calendar
                mode="range"
                selected={date}
                onSelect={setDate}
            />

            <select
                className="border border-gray-300 rounded-md p-2"
                value={selectedPlace}
                onChange={(e) => setSelectedPlace(e.target.value)}
            >
                {places.map(place => (
                    <option key={place} value={place}>
                        {place}
                    </option>
                ))}
            </select>

            <Button onClick={handleClick}>Show Graph</Button>

            {data.length > 0 && (
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}
