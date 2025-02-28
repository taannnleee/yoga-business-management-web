"use client"
import React from 'react'
import { CreateNewToDo } from './CreateNewToDo'
import { useState } from 'react'
import { div } from '@tensorflow/tfjs-core'
import ListItem  from './ListItem'


const page = () => {
    const [listItem, setListItem] = useState<string[]>(["1", "2", "3"]);
    const [newItem, setNewItem] = useState<string>('');

    const addNewItem = () => {
        setListItem([...listItem, newItem]);
        setNewItem('');
    }
    const handleNewItem = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem(e.target.value);
    }
    return (
        <div>
            <CreateNewToDo addNewItem={addNewItem} handleNewItem={handleNewItem} newItem={newItem}></CreateNewToDo>
            <ListItem listItem={listItem}></ListItem>
        </div>
    )
}
export default page;
