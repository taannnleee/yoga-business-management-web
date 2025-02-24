'use client'
import { TextField } from '@mui/material';
import { Button } from 'antd';
import { ChangeEvent, useState } from 'react';
import React, { use } from 'react'
import { CreateNewToDo } from './CreateNewToDo';

function Page() {
    const [item, setItem] = useState<string[]>(["Item1", "Item2"])
    const [newItem, setNewItem] = useState("")
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewItem(e.target.value)
    }
    const onClickButton = () => {
        setItem([newItem, ...item])
        setNewItem("")
    }
    return (
        <div>

            <CreateNewToDo onChange={onChange} onClickButton={onClickButton} text={newItem}></CreateNewToDo>
            {
                item.map((item) => {
                    return <div>{item}</div>
                })
            }
        </div>
    )
}
export default Page;
