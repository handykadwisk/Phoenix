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
        setItems(initialItems); // Set items saat komponen pertama kali di-render
        initializeSequenceMap(initialItems); // Initialize sequence map
        updateMenuSequenceWithChildren(initialItems); // Urutkan sequence ketika komponen pertama kali di-render
    }, [initialItems]);

    useEffect(() => {
        if (onItemsChange) {
            onItemsChange(items); // Trigger perubahan items jika onItemsChange ada
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
            item.children?.forEach(updateSequenceForItem); // Rekursif untuk anak-anak
        };

        newItems.forEach(updateSequenceForItem); // Urutkan sequence saat komponen dibuka
        setItems(newItems); // Update state items setelah diurutkan
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
        updateMenuSequenceWithChildren(newItems); // Update urutan sequence setelah drag-and-drop
        setItems(newItems);
        if (onSave) {
            onSave(); // Simpan perubahan
        }
    };

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


// import React, { useState, useEffect } from 'react';

// type MenuItem = {
//   id: number;
//   menu_name: string;
//   menu_sequence: number;
//   children?: MenuItem[]; // Optional submenu
// };

// type SequenceEditProps = {
//   initialItems: MenuItem[];
//   onItemsChange?: (items: MenuItem[]) => void;
//   onSave?: () => void;
// };

// const SequenceEdit: React.FC<SequenceEditProps> = ({
//   initialItems,
//   onItemsChange = () => {},
//   onSave = () => {},
// }) => {
//   const [items, setItems] = useState<MenuItem[]>(initialItems || []);
//   const [draggedItemId, setDraggedItemId] = useState<number | null>(null);
//   const [dropTargetId, setDropTargetId] = useState<number | null>(null);

//   useEffect(() => {
//     setItems(initialItems);
//     updateMenuSequenceWithChildren(initialItems);
//   }, [initialItems]);

//   useEffect(() => {
//     if (onItemsChange) {
//       onItemsChange(items);
//     }
//   }, [items, onItemsChange]);

//   const updateMenuSequenceWithChildren = (newItems: MenuItem[]) => {
//     let sequenceCounter = 1;

//     const updateSequenceForItem = (item: MenuItem) => {
//       item.menu_sequence = sequenceCounter;
//       sequenceCounter++;
//       item.children?.forEach(updateSequenceForItem); // Rekursif untuk anak-anak
//     };

//     newItems.forEach(updateSequenceForItem); // Urutkan sequence
//     setItems(newItems); // Set ulang state items setelah diurutkan
//   };

//   const handleDragStart = (itemId: number) => {
//     setDraggedItemId(itemId); // Simpan item yang sedang di-drag
//   };

//   const handleDrop = (targetId: number) => {
//     if (draggedItemId === null) return;
  
//     const moveItem = (items: MenuItem[], draggedId: number, targetId: number): MenuItem[] => {
//       const draggedIndex = items.findIndex(item => item.id === draggedId);
//       const targetIndex = items.findIndex(item => item.id === targetId);
  
//       if (draggedIndex === -1 || targetIndex === -1) return items; // Safety check
  
//       const updatedItems = [...items];
//       const [draggedItem] = updatedItems.splice(draggedIndex, 1);
//       updatedItems.splice(targetIndex, 0, draggedItem);
  
//       updatedItems.forEach(item => {
//         if (item.children && Array.isArray(item.children)) {
//           // Pastikan children adalah array sebelum diproses
//           item.children = moveItem(item.children, draggedId, targetId);
//         }
//       });
  
//       return updatedItems;
//     };
  
//     const newItems = moveItem(items, draggedItemId, targetId);
//     updateMenuSequenceWithChildren(newItems); // Update urutan
//     setDraggedItemId(null);
//     setDropTargetId(null);
  
//     if (onSave) {
//       onSave(); // Simpan perubahan
//     }
//   };

//   const handleDragOver = (e: React.DragEvent<HTMLDivElement>, itemId: number) => {
//     console.log(itemId);
    
//     e.preventDefault();
//     setDropTargetId(itemId); // Set target drop saat item di-drag over
//   };
  
//   const renderItems = (items: MenuItem[]) => (
//     <>
//       {items.map(item => (
//         <div
//           key={item.id}
//           draggable
//           onDragStart={() => handleDragStart(item.id)}
//           onDrop={() => handleDrop(item.id)}
//           onDragOver={(e) => handleDragOver(e, item.id)}
//           style={{
//             padding: '12px',
//             margin: '8px 0',
//             backgroundColor: dropTargetId === item.id ? '#f0f0f0' : '#fff',
//             border: '1px solid #ddd',
//             borderRadius: '4px',
//             cursor: 'move',
//           }}
//         >
//           <div>
//             {item.menu_sequence}. {item.menu_name}
//           </div>
//           {item.children && item.children.length > 0 && (
//             <div style={{ marginLeft: '20px' }}>
//               {renderItems(item.children)} {/* Rekursif untuk submenu */}
//             </div>
//           )}
//         </div>
//       ))}
//     </>
//   );
  

//   return <div>{renderItems(items)}</div>;
// };

// export default SequenceEdit;
