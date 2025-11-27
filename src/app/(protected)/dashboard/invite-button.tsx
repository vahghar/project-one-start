"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import useProject from "@/hooks/use-project"
import { toast } from "react-toastify"
import { Users, Copy, Check } from "lucide-react"

const InviteButton = () => {
  const { projectId } = useProject()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [inviteLink, setInviteLink] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      setInviteLink(`${window.location.origin}/join/${projectId}`)
    }
  }, [projectId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteLink)
    setCopied(true)
    
    toast.success("Link copied", {
      style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" },
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium text-slate-100">
              Invite Team Members
            </DialogTitle>
            <p className="mt-2 text-sm text-slate-400">
              Share this link with your team to give them access to the project.
            </p>
          </DialogHeader>

          <div className="mt-4 flex items-center gap-2">
            <Input
              className="bg-slate-900 border-slate-800 text-slate-300 focus-visible:ring-purple-500/20 focus-visible:border-purple-500 h-10"
              readOnly
              value={inviteLink}
            />
            <Button
              onClick={copyToClipboard}
              variant="outline"
              className="h-10 border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-400"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPDATED BUTTON: 
         - Uses 'variant="outline"'
         - Transparent background
         - Subtle purple border that gets slightly stronger on hover
         - Text is a softer purple/lilac
      */}
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="bg-transparent border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:border-purple-500/50 hover:text-purple-300 transition-all"
      >
        <Users className="mr-2 h-4 w-4" />
        Invite Team
      </Button>
    </>
  )
}

export default InviteButton