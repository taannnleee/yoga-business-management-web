import { Button, TextField } from '@mui/material'
import React, { ChangeEvent } from 'react'

interface Prop {
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    onClickButton: () => void
    text: string
}
export const CreateNewToDo : React.FC<Prop> = ({
    onChange,
    onClickButton,
    text
}) => {
    return (
        <div>
            <TextField onChange={onChange} value={text}></TextField>
            <Button onClick={onClickButton}>  Nhấn vào   </Button>
        </div>
    )
}
