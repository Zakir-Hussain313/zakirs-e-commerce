'use client'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Fuse from 'fuse.js'
import searchData from '@/lib/search';

const options = {
    keys: ['label', 'description', 'keywords'],
    threshold: 0.3
}

const SearchModel = ({ open, setOpen }) => {

    const [query, setQuery] = useState('');
    const [result, setResult] = useState([]);

    const fuse = new Fuse(searchData, options)

    useEffect(() => {
        if (query.trim() === '') {
            setResult([])
        }
        const res = fuse.search(query);
        setResult(res.map((r) => r.item))
    }, [query])

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Quick Search</DialogTitle>
                    <DialogDescription>
                        Find and Navigate to any admin section instantly.Type any keyword.
                    </DialogDescription>
                </DialogHeader>

                <Input
                    placeholder='Search...'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />

                <ul className='mt-4 max-h-60 overflow-y-auto'>
                    {
                        result.map((item, index) => (

                            <li key={index} className='hover:bg-black/10 rounded-lg px-3 py-3 delay-150'>
                                <Link href={item.url} onClick={() => setOpen(false)}>
                                    <h4 className='font-medium'>{ item.label }</h4>
                                    <p className='text-sm text-muted-foreground'>{item.description}</p>
                                </Link>
                            </li>
                        ))
                    }
                    {
                        query && result.length === 0 
                        &&
                        <div className='text-sm text-center text-red-500'>
                            No Result found.
                        </div>
                    }
                </ul>

            </DialogContent>
        </Dialog>
    )
}

export default SearchModel
