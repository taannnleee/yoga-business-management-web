import React from "react";

// You can modify this component to take in `richText` content from your database.
interface RichTextDisplayProps {
    content: string; // rich HTML content stored in the database
}

const RichTextDisplay: React.FC<RichTextDisplayProps> = ({ content }) => {
    return (
        <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: content }} // Render HTML content
        />
    );
};

export default RichTextDisplay;
