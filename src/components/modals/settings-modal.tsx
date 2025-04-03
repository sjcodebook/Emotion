'use client'

import { Label } from '@/components/ui/label'
import { DialogContent, Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ModeToggle } from '@/components/mode-toggle'
import { useSettings } from '@/hooks/use-settings'

const Settings = () => {
  const settings = useSettings()

  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className='border-b pb-3'>
          <DialogTitle>
            <span className='text-xl font-medium'>My settings</span>
          </DialogTitle>
        </DialogHeader>
        <div className='flex items-center justify-between'>
          <div className='flex flex-col gap-y-1'>
            <Label>Appearance</Label>
            <span className='text-[0.8rem] text-muted-foreground'>
              Customize how Emotion looks on your device
            </span>
          </div>
          <ModeToggle />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Settings
