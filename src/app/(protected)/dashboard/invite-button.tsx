"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useProject from "@/hooks/use-project"
import { toast } from "react-toastify"
import { Users, Copy } from "lucide-react"

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = React.useState(false)
  const inviteLink = `${window.location.origin}/join/${projectId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    toast.success("Link copied to clipboard", {
      icon: <Copy className="text-purple-500" />,
      style: { background: "#1F2937", color: "#F3F4F6" },
    })
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-gray-900 text-white border border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-purple-400">Invite Team Members</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-400 mt-2">Share this link with your team members:</p>
          <div className="relative mt-4">
            <Input className="bg-gray-800 text-white border-purple-500/20 pr-10" readOnly value={inviteLink} />
            <Button
              className="absolute right-0 top-0 h-full px-3 bg-purple-600 hover:bg-purple-700"
              onClick={copyToClipboard}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Button onClick={() => setOpen(true)} className="bg-purple-600 hover:bg-purple-700 text-white">
        <Users className="mr-2 h-4 w-4" /> Invite Team
      </Button>
    </>
  )
}

export default InviteButton

