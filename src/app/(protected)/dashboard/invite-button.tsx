'use client'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import useProject from '@/hooks/use-project'
import React from 'react'
import { toast } from 'react-toastify'

const InviteButton = () => {
    const { projectId } = useProject()
    const [open,setOpen] = React.useState(false)
    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite Team Members</DialogTitle>
                    </DialogHeader>
                    <p className='text-sm text-gray-500'>
                        Ask them to copy and paste this link
                    </p>
                    <Input className='mt-4' readOnly onClick={()=>{
                        navigator.clipboard.writeText(`${window.location.origin}/join/${projectId}`)
                        toast.success('Link copied to clipboard')
                    }} value={`${window.location.origin}/join/${projectId}`} />
                </DialogContent>
            </Dialog>
            <Button onClick={()=>setOpen(true)}>Invite Team Members</Button>
        </>
    )
}

export default InviteButton
