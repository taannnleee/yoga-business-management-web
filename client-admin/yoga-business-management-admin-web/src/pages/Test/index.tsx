import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Item {
    id: string;
    content: string;
}

const Test: React.FC = () => {
    // Chia các item thành 2 cột
    const [itemsLeft, setItemsLeft] = useState<Item[]>([
        { id: "1", content: "Item 1" },
        { id: "2", content: "Item 2" },
    ]);

    const [itemsRight, setItemsRight] = useState<Item[]>([
        { id: "3", content: "Item 3" },
        { id: "4", content: "Item 4" },
    ]);

    // Hàm xử lý khi kéo thả kết thúc
    const handleOnDragEnd = (result: DropResult) => {
        const { source, destination } = result;

        // Kiểm tra nếu không có điểm đến (ví dụ: kéo thả ra ngoài danh sách)
        if (!destination) return;

        // Nếu kéo thả trong cùng một cột
        if (source.droppableId === destination.droppableId) {
            const sourceItems = source.droppableId === "left" ? itemsLeft : itemsRight;
            const updatedItems = Array.from(sourceItems);
            const [reorderedItem] = updatedItems.splice(source.index, 1);
            updatedItems.splice(destination.index, 0, reorderedItem);

            // Cập nhật trạng thái tương ứng
            if (source.droppableId === "left") {
                setItemsLeft(updatedItems);
            } else {
                setItemsRight(updatedItems);
            }
        } else {
            // Nếu kéo thả giữa các cột
            const sourceItems = source.droppableId === "left" ? itemsLeft : itemsRight;
            const destinationItems = destination.droppableId === "left" ? itemsLeft : itemsRight;

            const updatedSourceItems = Array.from(sourceItems);
            const updatedDestinationItems = Array.from(destinationItems);

            const [movedItem] = updatedSourceItems.splice(source.index, 1);
            updatedDestinationItems.splice(destination.index, 0, movedItem);

            // Cập nhật lại các state
            if (source.droppableId === "left") {
                setItemsLeft(updatedSourceItems);
            } else {
                setItemsRight(updatedSourceItems);
            }

            if (destination.droppableId === "left") {
                setItemsLeft(updatedDestinationItems);
            } else {
                setItemsRight(updatedDestinationItems);
            }
        }
    };

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
                {/* Cột trái */}
                <Droppable droppableId="left">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                width: "45%",
                                padding: "20px",
                                background: "#f0f0f0",
                                borderRadius: "8px",
                            }}
                        >
                            {itemsLeft.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                padding: "10px",
                                                margin: "5px 0",
                                                background: "#fff",
                                                borderRadius: "4px",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>

                {/* Cột phải */}
                <Droppable droppableId="right">
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                                width: "45%",
                                padding: "20px",
                                background: "#f0f0f0",
                                borderRadius: "8px",
                            }}
                        >
                            {itemsRight.map((item, index) => (
                                <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                padding: "10px",
                                                margin: "5px 0",
                                                background: "#fff",
                                                borderRadius: "4px",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                                                ...provided.draggableProps.style,
                                            }}
                                        >
                                            {item.content}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
};

export default Test;
