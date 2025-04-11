'use cleint'

import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import { Button } from './ui/button'
import { CirclePlus, PlusIcon, Trash, Trash2, TrashIcon } from 'lucide-react'

const KanbanHeader = ({ board, taskCount, handleBlockRemove, handleCardAdd }) => {
  return (
    <div className='flex items-center justify-between px-2 py-2'>
      <div className='flex items-center justify-center gap-x-2'>
        <div className='bg-neutral-200 rounded-sm py-1 px-1.5'>
          <h2 className='text-sm font-medium'>{board.name}</h2>
        </div>
        <div className='text-sm text-neutral-700 font-medium'>{taskCount}</div>
      </div>
      <div className='flex items-center justify-center'>
        <Button
          onClick={() => handleBlockRemove(board.id)}
          variant='ghost'
          size='icon'
          className='size-8'>
          <TrashIcon className='size-5 text-neutral-500' />
        </Button>
        <Button
          onClick={() => {
            handleCardAdd(board.id)
          }}
          variant='ghost'
          size='icon'
          className='size-8'>
          <CirclePlus className='size-5 text-neutral-500' />
        </Button>
      </div>
    </div>
  )
}

const KanbanCard = ({ board, task, handleCardRemove }) => {
  return (
    <div className='bg-white p-4 mb-2 rounded-lg shadow-md max-w-full hover:shadow-lg transition-shadow duration-200 ease-in-out hover:bg-gray-50 flex items-start justify-between gap-4'>
      <div className='flex flex-col items-start justify-between gap-4'>
        <div className='flex items-start justify-start gap-x-3 w-full'>
          <p>📄</p>
          <p className='line-clamp-5 font-medium text-md'>{task.title}</p>
        </div>
        <p className='text-muted-foreground text-xs'>December 15, 2024</p>
      </div>
      <div
        className='mt-0.5 size-4 cursor-pointer'
        onClick={() => {
          handleCardRemove(board.id, task.id)
        }}>
        <Trash2 className='size-3.5 text-muted-foreground' />
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
          title: 'Write next 3rd to 10th days emails for hoot and hustle subscribers',
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

  const handleblockAdd = () => {
    setBoards((prev) => [
      ...prev,
      {
        id: uuidv4(),
        name: 'New Block',
        cards: [],
      },
    ])
  }

  const handleBlockRemove = (id) => {
    setBoards((prev) => prev.filter((board) => board.id !== id))
  }

  const handleCardAdd = (boardId) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: [
              ...board.cards,
              {
                id: uuidv4(),
                title: 'New Task',
                createdAt: new Date(),
              },
            ],
          }
        }
        return board
      })
    )
  }

  const handleCardRemove = (boardId, taskId) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: board.cards.filter((task) => task.id !== taskId),
          }
        }
        return board
      })
    )
  }

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result

    // If there's no destination, do nothing
    if (!destination) return

    // If the source and destination are the same, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    setBoards((prevBoards) => {
      const sourceBoardIndex = prevBoards.findIndex((board) => board.id === source.droppableId)
      const destinationBoardIndex = prevBoards.findIndex(
        (board) => board.id === destination.droppableId
      )

      const sourceBoard = prevBoards[sourceBoardIndex]
      const destinationBoard = prevBoards[destinationBoardIndex]

      const sourceCards = [...sourceBoard.cards]
      const [movedCard] = sourceCards.splice(source.index, 1)

      if (sourceBoardIndex === destinationBoardIndex) {
        // Moving within the same block
        sourceCards.splice(destination.index, 0, movedCard)
        const updatedBoard = { ...sourceBoard, cards: sourceCards }
        return prevBoards.map((board, index) => (index === sourceBoardIndex ? updatedBoard : board))
      } else {
        // Moving to a different block
        const destinationCards = [...destinationBoard.cards]
        destinationCards.splice(destination.index, 0, movedCard)

        const updatedSourceBoard = { ...sourceBoard, cards: sourceCards }
        const updatedDestinationBoard = {
          ...destinationBoard,
          cards: destinationCards,
        }

        return prevBoards.map((board, index) => {
          if (index === sourceBoardIndex) return updatedSourceBoard
          if (index === destinationBoardIndex) return updatedDestinationBoard
          return board
        })
      }
    })
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd} onDragStart={() => {}}>
      <div className='flex overflow-x-auto min-h-[350px] scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-4'>
        {boards.map((board) => {
          return (
            <div
              key={board.id}
              className='flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[280px] max-w-[280px] min-h-full'>
              <KanbanHeader
                board={board}
                taskCount={board.cards.length}
                handleCardAdd={handleCardAdd}
                handleBlockRemove={handleBlockRemove}
              />
              <Droppable droppableId={board.id} key={board.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className='min-h-[200px] py-3 px-2 max-w-full cursor-pointer'>
                    {board.cards?.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <div
                            className='max-w-full'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <KanbanCard
                              board={board}
                              task={task}
                              handleCardRemove={handleCardRemove}
                            />
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
        <div>
          <Button
            onClick={handleblockAdd}
            variant='outline'
            size='lg'
            className=' bg-white hover:bg-gray-50'>
            <PlusIcon className='size-5 text-neutral-500' />
            <div className='text-sm text-neutral-500 font-medium'>Add new block</div>
          </Button>
        </div>
      </div>
    </DragDropContext>
  )
}

export default Kanban
