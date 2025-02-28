import { TextField } from '@mui/material'
import React from 'react'
interface Prop {
    addNewItem: () => void;
    handleNewItem: (e: React.ChangeEvent<HTMLInputElement>) => void;
    newItem: string;
}
export const CreateNewToDo: React.FC<Prop> = ({ addNewItem, handleNewItem, newItem }) => {
    return (
        <div>
            <input type="text" placeholder="Enter a new to-do" value={newItem} onChange={handleNewItem} ></input>
            <button onClick={addNewItem}> add</button>
        </div>
    )
}
