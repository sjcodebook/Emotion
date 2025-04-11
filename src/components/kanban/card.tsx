import { Trash2 } from 'lucide-react'

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

export default KanbanCard
