import { useRouter } from 'next/navigation'
import { DateTime } from 'luxon'
import { Trash2 } from 'lucide-react'

import { Task } from './board'

interface KanbanCardProps {
  boardId: string
  task: Task
  handleCardRemove: (e: React.MouseEvent<HTMLDivElement>, boardId: string, taskId: string) => void
}

const KanbanCard = ({ boardId, task, handleCardRemove }: KanbanCardProps) => {
  const router = useRouter()

  return (
    <div
      className='bg-white p-4 mb-2 rounded-lg shadow-md max-w-full hover:shadow-lg transition-shadow duration-200 ease-in-out hover:bg-gray-50 flex items-start justify-between gap-4'
      onClick={() => {
        router.push(`/dashboard/${task.id}`)
      }}>
      <div className='flex flex-col items-start justify-between gap-4'>
        <div className='flex items-start justify-start gap-x-3 w-full'>
          <p>📄</p>
          <p className='line-clamp-5 font-medium text-md'>{task.title}</p>
        </div>
        <p className='text-muted-foreground text-xs'>
          {DateTime.fromJSDate(new Date()).toFormat('MMMM dd, yyyy')}
        </p>
      </div>
      <div
        className='mt-0.5 size-4 cursor-pointer'
        onClick={(e) => {
          handleCardRemove(e, boardId, task.id)
        }}>
        <Trash2 className='size-3.5 text-muted-foreground' />
      </div>
    </div>
  )
}

export default KanbanCard
