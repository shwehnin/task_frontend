import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const TaskColumn = ({ status, tasks, onDeleted, moveCard }) => {
  const [, drop] = useDrop({
    accept: 'TASK',
    drop: (item) => {
      if (item.status !== status) {
        moveCard(item.index, 0, item.status, status);
      }
    },
  });

  return (
    <div ref={drop} className="min-h-[200px]">
      <h2 className="text-lg font-bold mb-3">{status} ({tasks.length})</h2>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <TaskCard 
            key={task._id} 
            task={task} 
            index={index}
            status={status}
            onDeleted={onDeleted}
            moveCard={moveCard}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskColumn;