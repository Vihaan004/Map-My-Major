import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ClassBox from './Class';

function SortableItem(props) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ClassBox 
        {...props} 
        onClick={(e) => {
          if (props.onClick) {
            props.onClick(e);
          }
        }}
      />
    </div>
  );
}

export default SortableItem;
