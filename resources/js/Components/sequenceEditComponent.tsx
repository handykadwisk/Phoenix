import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type Item = {
    MILESTONE_ID: number;
    MILESTONE_NAME: string;
    MILESTONE_SEQUENCE: number;
    children?: Item[];
};

type SequenceEditProps = {
    initialItems: Item[];
    onItemsChange?: (items: Item[]) => void;
    onSave?: () => void;
};

const SequenceEditComponent: React.FC<SequenceEditProps> = ({ initialItems, onItemsChange, onSave }) => {
    const [items, setItems] = useState<Item[]>(initialItems || []);

    useEffect(() => {
        setItems(initialItems);
        updateMenuSequenceWithChildren(initialItems);
    }, [initialItems]);

    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items);
        }
    }, [items, onItemsChange]);

    // Fungsi untuk memperbarui urutan sequence berdasarkan aturan parent-child
    const updateMenuSequenceWithChildren = (newItems: Item[]) => {
        let parentSequenceCounter = 1;

        newItems?.forEach((parent) => {
            parent.MILESTONE_SEQUENCE = parentSequenceCounter++;
            if (parent.children) {
                let childSequenceCounter = 1;
                parent?.children.forEach(child => {
                    child.MILESTONE_SEQUENCE = childSequenceCounter++;
                    if (child.children) {
                        let grandChildSequenceCounter = 1;
                        child.children.forEach(grandChild => {
                            grandChild.MILESTONE_SEQUENCE = grandChildSequenceCounter++;
                        });
                    }
                });
            }
        });

        setItems([...newItems]);
    };

    // Fungsi yang menangani drag & drop
    const onDragEnd = (result: DropResult): void => {
        if (!result.destination) return;

        const sourceIndex = result.source.index;
        const destinationIndex = result.destination.index;

        const newItems = [...items];

        const moveItem = (items: Item[], sourceIndex: number, destinationIndex: number, draggableId: string): Item[] => {
            const parentIndex = items.findIndex(parent => parent.children?.some(child => child.MILESTONE_ID.toString() === draggableId));
            if (parentIndex !== -1) {
                const parent = items[parentIndex];
                if (parent.children) {
                    const childIndex = parent.children.findIndex(child => child.MILESTONE_ID.toString() === draggableId);
                    if (childIndex !== -1) {
                        const [movedChild] = parent.children.splice(sourceIndex, 1);
                        parent.children.splice(destinationIndex, 0, movedChild);
                        return items;
                    } else {
                        parent.children = moveItem(parent.children, sourceIndex, destinationIndex, draggableId);
                    }
                }
            } else {
                items.forEach(item => {
                    if (item.children) {
                        item.children = moveItem(item.children, sourceIndex, destinationIndex, draggableId);
                    }
                });
            }
            return items;
        };

        if (result.type === 'PARENT') {
            // Perpindahan parent item
            const [movedItem] = newItems.splice(sourceIndex, 1);
            newItems.splice(destinationIndex, 0, movedItem);
        } else {
            // Perpindahan child item atau grandchild item
            moveItem(newItems, sourceIndex, destinationIndex, result.draggableId);
        }

        updateMenuSequenceWithChildren(newItems);
        setItems(newItems);
        if (onSave) {
            onSave();
        }
    };

    // Fungsi untuk merender daftar item beserta child-nya
    const renderItems = (items: Item[], parentId: number | null = null) => (
        <Droppable droppableId={`droppable-${parentId !== null ? `child-${parentId}` : 'parent'}`} type={parentId !== null ? 'CHILD' : 'PARENT'}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items?.map((item, index) => (
                        item?.MILESTONE_ID ? (
                            <Draggable key={item?.MILESTONE_ID.toString()} draggableId={item?.MILESTONE_ID.toString()} index={index}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="p-3 mb-2 bg-white border rounded-md shadow-md"
                                    >
                                        <div>
                                            {item.MILESTONE_SEQUENCE}. {item.MILESTONE_NAME}
                                        </div>
                                        {item.children && item.children.length > 0 && (
                                            <div className="ml-6">
                                                {renderItems(item.children, item.MILESTONE_ID)}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ) : null
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
    console.clear();
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            {renderItems(items)}
        </DragDropContext>
    );
};

export default SequenceEditComponent;