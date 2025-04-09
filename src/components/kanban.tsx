'use cleint'

import { useState, useCallback, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react'

const boards = ['BACKLOG', 'IN PROGRESS', 'IN REVIEW', 'COMPLETED']

const data = []

const KanbanHeader = ({ board, taskCount }) => {
  return (
    <div className='flex items-center justify-between px-2 py-1.5'>
      <div className='flex items-center gap-x-2'>
        <h2 className='text-sm font-medium'>{board}</h2>
        <div className='size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium'>
          {taskCount}
        </div>
      </div>
      <Button onClick={() => {}} variant='ghost' size='icon' className='size-5'>
        <PlusIcon className='size-4 text-neutral-500' />
      </Button>
    </div>
  )
}

const KanbanCard = ({ task }) => {
  return (
    <div className='bg-white p-2.5 mb-1.5 rounded shadow-sm space-y-3'>
      <div className='flex items-start justify-between gap-x-2'>
        <p>{task.title}</p>
        <p className='text-sm font-medium'>{task.description}</p>
      </div>
    </div>
  )
}

const Kanban = () => {
  const [tasks, setTasks] = useState(() => {
    const initialTasks = {
      BACKLOG: [
        {
          id: '78236',
          title: 'Task 1',
          description: 'Description for Task 1',
        },
        {
          id: '78237',
          title: 'Task 2',
          description: 'Description for Task 2',
        },
      ],
      'IN PROGRESS': [
        {
          id: '78238',
          title: 'Task 3',
          description: 'Description for Task 3',
        },
      ],
      'IN REVIEW': [
        {
          id: '78239',
          title: 'Task 4',
          description: 'Description for Task 4',
        },
      ],
      COMPLETED: [
        {
          id: '78240',
          title: 'Task 5',
          description: 'Description for Task 5',
        },
      ],
    }

    return initialTasks
  })

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className='flex overflow-x-auto'>
        {boards.map((board, index) => {
          return (
            <div key={board} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
              <KanbanHeader board={board} taskCount={tasks[board]?.length} />
              <Droppable droppableId={board} key={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='min-h-[200px] py-1.5'>
                    {tasks[board]?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          )
        })}
      </div>
    </DragDropContext>
  )
}

export default Kanban
