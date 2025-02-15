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
          toast.success("Project archived successfully", {
            icon: <Archive className="text-purple-500" />,
            style: { background: "#1F2937", color: "#F3F4F6" },
          })
          refetch()
        },
        onError: () => {
          toast.error("Error archiving project", {
            icon: <AlertTriangle className="text-red-500" />,
            style: { background: "#1F2937", color: "#F3F4F6" },
          })
        },
      },
    )
    setShowDialog(false)
  }

  return (
    <>
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-gray-900 text-white border border-purple-500/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-purple-400">Archive Project</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Are you sure you want to archive this project? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchive} className="bg-red-600 hover:bg-red-700">
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        variant="destructive"
        onClick={() => setShowDialog(true)}
        disabled={archiveProject.isPending}
        className="bg-red-900 hover:bg-red-800 text-white"
      >
        <Archive className="mr-2 h-4 w-4" /> Archive
      </Button>
    </>
  )
}

export default ArchiveButton

