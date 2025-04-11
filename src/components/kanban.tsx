'use cleint'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from './ui/button'
import { PlusIcon } from 'lucide-react'

const KanbanHeader = ({ board, taskCount }) => {
  return (
    <div className='flex items-center justify-between px-2 py-1.5'>
      <div className='flex items-center gap-x-2'>
        <h2 className='text-sm font-medium'>{board.name}</h2>
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
  const [boards, setBoards] = useState([
    {
      id: uuidv4(),
      name: 'BACKLOG',
      cards: [
        {
          id: uuidv4(),
          title: 'Do something awesome',
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          title: 'Do something awesome 2',
          createdAt: new Date(),
        },
      ],
    },
    {
      id: uuidv4(),
      name: 'TODO',
      cards: [
        {
          id: uuidv4(),
          title: 'Do something awesome',
          createdAt: new Date(),
        },
        {
          id: uuidv4(),
          title: 'Do something awesome 2',
          createdAt: new Date(),
        },
      ],
    },
  ])

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className='flex overflow-x-auto'>
        {boards.map((board) => {
          return (
            <div key={board.id} className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]'>
              <KanbanHeader board={board} taskCount={board.cards.length} />
              <Droppable droppableId={board.id} key={board.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='min-h-[200px] py-1.5'>
                    {board.cards?.map((task, index) => (
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
