"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import useProject from "@/hooks/use-project"
import useRefetch from "@/hooks/use-refetch"
import { api } from "@/trpc/react"
import { toast } from "react-toastify"
import { Archive, AlertTriangle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ArchiveButton = () => {
  const archiveProject = api.project.archiveProject.useMutation()
  const { projectId } = useProject()
  const refetch = useRefetch()
  const [showDialog, setShowDialog] = React.useState(false)

  const handleArchive = () => {
    archiveProject.mutate(
      { projectId },
      {
        onSuccess: () => {
          toast.success("Project archived", {
            style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" },
          })
          refetch()
        },
        onError: () => {
          toast.error("Error archiving project", {
            style: { background: "#1e293b", color: "#fff", border: "1px solid #334155" },
          })
        },
      },
    )
    setShowDialog(false)
  }

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-slate-950 text-slate-100 border-slate-800 shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-slate-100">
              Archive Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-slate-400">
              Are you sure you want to archive this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-white">
              Cancel
            </AlertDialogCancel>
            {/* Kept solid red inside the modal only, to warn user this is destructive */}
            <AlertDialogAction 
              onClick={handleArchive} 
              className="bg-red-600 hover:bg-red-700 text-white border-0"
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MINIMALIST OUTLINE BUTTON */}
      <Button
        variant="outline"
        onClick={() => setShowDialog(true)}
        disabled={archiveProject.isPending}
        className="bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-300 transition-all"
      >
        <Archive className="mr-2 h-4 w-4" /> 
        Archive
      </Button>
    </>
  )
}

export default ArchiveButton