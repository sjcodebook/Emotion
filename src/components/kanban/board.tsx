'use client'

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { PlusIcon } from 'lucide-react'
import { z } from 'zod'
import { DragDropContext, Droppable, Draggable, DropResult, DragUpdate } from '@hello-pangea/dnd'

import { documentSchema } from '@/zod-schemas/documents'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

import KanbanHeader from './header'
import KanbanCard from './card'
import { toast } from 'sonner'

import {
  createDocumentAction,
  archiveDocumentsAction,
  // getCurrentUserUnArchivedDocumentsAction,
} from '../../app/(app)/actions'
import { useQueryClient } from '@tanstack/react-query'
import { QueryKeyFactory } from '@/hooks/use-server-action-hooks'

export interface Task {
  id: string
  title: string
  createdAt: Date
}

export interface BoardContent {
  id: string
  name: string
  isHovered?: boolean
  cards: Task[]
}

const Kanban = ({
  document,
  onChange,
}: {
  document: z.infer<typeof documentSchema>
  onChange: (value: string) => void
}) => {
  const queryClient = useQueryClient()
  const [isDragging, setIsDragging] = useState(false)
  const [boards, setBoards] = useState<BoardContent[]>([])
  // const { data: allDocuments } = useServerActionQuery(getCurrentUserUnArchivedDocumentsAction, {
  //   input: undefined,
  //   queryKey: QueryKeyFactory.getCurrentUserUnArchivedDocumentsAction(),
  // })

  useEffect(() => {
    if (!document || !document.content || boards.length > 0) return
    const parsedContent = JSON.parse(document.content)
    setBoards(parsedContent ?? [])
  }, [boards, document])

  useEffect(() => {
    if (boards.length <= 0) return
    const parsedContent = JSON.stringify(boards)
    onChange(parsedContent)
  }, [boards, onChange])

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

  const handleBlockRemove = (id: string) => {
    setBoards((prev) => prev.filter((board) => board.id !== id))
  }

  const handleCardAdd = async (boardId: string) => {
    toast.loading('Creating task...')
    const [data, err] = await createDocumentAction({
      title: 'Untitled Document',
      parentDocumentId: document.id,
    })
    toast.dismiss()
    if (err || data?.error || !data?.data) {
      toast.error('Failed to create task. Please try again.')
      return
    }
    toast.success('Task created successfully!')
    const newTask = {
      id: data.data?.id,
      title: data.data?.title,
      createdAt: data.data?.createdAt,
    }
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id === boardId) {
          return {
            ...board,
            cards: [...board.cards, newTask],
          }
        }
        return board
      })
    )
    await queryClient.refetchQueries({
      queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(document.id),
    })
    await queryClient.refetchQueries({
      queryKey: QueryKeyFactory.getCurrentUserAllDocumentsAction(),
    })
  }

  const handleCardRemove = async (
    e: React.MouseEvent<HTMLDivElement>,
    boardId: string,
    taskId: string
  ) => {
    e.stopPropagation()
    toast.loading('Deleting task...')
    const [data, err] = await archiveDocumentsAction({
      parentDocumentId: taskId,
    })
    toast.dismiss()
    if (err || data?.error) {
      toast.error('Failed to delete task. Please try again.')
      return
    }
    toast.success('Task deleted successfully!')
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
    await queryClient.refetchQueries({
      queryKey: QueryKeyFactory.getCurrentUserDocumentByParentDocumentIdAction(document.id),
    })
    await queryClient.refetchQueries({
      queryKey: QueryKeyFactory.getCurrentUserAllDocumentsAction(),
    })
  }

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)
    setBoards((prevBoards) => prevBoards.map((board) => ({ ...board, isHovered: false })))

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

  const handleDragUpdate = (update: DragUpdate) => {
    const { destination } = update

    setBoards((prevBoards) =>
      prevBoards.map((board) => {
        if (destination && board.id === destination.droppableId) {
          return { ...board, isHovered: true }
        }
        return { ...board, isHovered: false }
      })
    )
  }

  return (
    <DragDropContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragUpdate={handleDragUpdate}>
      <div className='flex overflow-x-auto min-h-screen scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full scrollbar-thumb-gray-300 scrollbar-track-transparent pb-4'>
        {boards.map((board) => {
          return (
            <div
              key={board.id}
              className={cn(
                'flex-1 mx-2 p-1.5 rounded-md min-w-[280px] max-w-[280px] min-h-full transition-colors duration-200',
                isDragging ? 'border-1 border-dashed bg-transparent' : 'border-none',
                board.isHovered
                  ? 'bg-blue-50 border-blue-300'
                  : cn('border-neutral-300', !isDragging ? 'bg-muted' : 'bg-transparent')
              )}>
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
                              boardId={board.id}
                              task={task}
                              handleCardRemove={handleCardRemove}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
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
