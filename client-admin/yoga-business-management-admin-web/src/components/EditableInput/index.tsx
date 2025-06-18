import React, { useState, useEffect } from 'react';

interface EditableInputProps {
    defaultValue: string;
    onChange: (value: string) => void;
    className?: string;
    type?: 'text' | 'textarea';
    rows?: number;
}

const EditableInput: React.FC<EditableInputProps> = ({
    defaultValue,
    onChange,
    className = '',
    type = 'text',
    rows = 3,
}) => {
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue); // cập nhật lại nếu defaultValue thay đổi
    }, [defaultValue]);

    const handleFocus = () => {
        // Chỉ xóa nếu người dùng chưa thay đổi gì
        if (value === defaultValue) {
            setValue('');
        }
    };

    const handleBlur = () => {
        const trimmed = value.trim();

        if (trimmed === '') {
            // Khôi phục mặc định nếu người dùng để trống
            setValue(defaultValue);
            onChange(defaultValue);
        } else if (trimmed !== defaultValue) {
            // Chỉ gọi onChange nếu khác mặc định
            onChange(trimmed);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setValue(e.target.value);
    };

    const sharedProps = {
        className,
        value,
        onChange: handleChange,
        onFocus: handleFocus,
        onBlur: handleBlur,
    };

    return type === 'textarea' ? (
        <textarea {...sharedProps} rows={rows} />
    ) : (
        <input type="text" {...sharedProps} />
    );
};

export default EditableInput;
