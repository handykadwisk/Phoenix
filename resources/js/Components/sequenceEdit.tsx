import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

type MenuItem = {
    id: number;
    menu_name: string;
    menu_sequence: number;
    children?: MenuItem[]; // Sub-menu bersifat opsional
};

type SequenceEditProps = {
    initialItems: MenuItem[];
    onItemsChange?: (items: MenuItem[]) => void;
    onSave?: () => void;
};

const SequenceEdit: React.FC<SequenceEditProps> = ({ initialItems, onItemsChange, onSave }) => {
    const [items, setItems] = useState<MenuItem[]>(initialItems || []);
    const [sequenceMap, setSequenceMap] = useState<Record<number, number>>({});

    useEffect(() => {
        setItems(initialItems);
        initializeSequenceMap(initialItems);
    }, [initialItems]);

    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items);
        }
    }, [items, onItemsChange]);

    const initializeSequenceMap = (items: MenuItem[]) => {
        const initialMap: Record<number, number> = {};
        const setSequenceForItem = (item: MenuItem) => {
            initialMap[item.id] = item.menu_sequence;
            item.children?.forEach(setSequenceForItem);
        };
        items.forEach(setSequenceForItem);
        setSequenceMap(initialMap);
    };

    const updateMenuSequenceWithChildren = (newItems: MenuItem[]) => {
        let sequenceCounter = 1;

        const updateSequenceForItem = (item: MenuItem) => {
            item.menu_sequence = sequenceCounter;
            sequenceCounter++;
            item.children?.forEach(updateSequenceForItem);
        };

        newItems.forEach(updateSequenceForItem);
    };

    const onDragEnd = (result: DropResult, parentId: number | null = null): void => {
        if (!result.destination) return;

        const updateItems = (items: MenuItem[]): MenuItem[] => {
            if (parentId === null) {
                const newItems = Array.from(items);
                const [movedItem] = newItems.splice(result.source.index, 1);
                if (result.destination) {
                    newItems.splice(result.destination.index, 0, movedItem);
                }
                return newItems;
            } else {
                return items.map(item => {
                    if (item.id === parentId) {
                        const newChildren = Array.from(item.children || []);
                        const [movedSubItem] = newChildren.splice(result.source.index, 1);
                        if (result.destination) {
                            newChildren.splice(result.destination.index, 0, movedSubItem);
                        }
                        item.children = newChildren;
                    } else if (item.children) {
                        item.children = updateItems(item.children);
                    }
                    return item;
                });
            }
        };

        const newItems = updateItems(items);
        updateMenuSequenceWithChildren(newItems);
        setItems(newItems);
            // Panggil onSave setelah perubahan disimpan
            if (onSave) {
                onSave();
            }
    };
    // console.log("items",items);
    

    const renderItems = (items: MenuItem[], parentId: number | null = null) => (
        <Droppable droppableId={`droppable-${parentId !== null ? parentId : 'main'}`}>
            {(provided: any) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items.map((item, index) => (
                        <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                            {(provided:any) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    style={{
                                        padding: '12px',
                                        margin: '0 0 4px 0',
                                        backgroundColor: '#ffff',
                                        border: '1px solid #ddd',
                                        borderRadius: '4px',
                                        fontSize: '14px',
                                        ...provided.draggableProps.style,
                                    }}
                                    className='shadow-md'
                                >
                                    <div {...provided.dragHandleProps}>
                                    {item.menu_sequence}. {item.menu_name}
                                    </div>
                                    {/* Render anak-anak secara rekursif */}
                                    {item.children && item.children.length > 0 && (
                                        <DragDropContext onDragEnd={(result: DropResult) => onDragEnd(result, item.id)}>
                                            {renderItems(item.children, item.id)}
                                        </DragDropContext>
                                    )}
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
    

    return <DragDropContext onDragEnd={(result) => onDragEnd(result)}>{renderItems(items)}</DragDropContext>;
};

export default SequenceEdit;
