import { Button } from '@/components/ui/button'
import { CirclePlus, TrashIcon } from 'lucide-react'

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

export default KanbanHeader
