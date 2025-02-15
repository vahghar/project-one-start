'use client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Presentation, Upload } from 'lucide-react'
import React from 'react'
import { useDropzone, FileWithPath } from 'react-dropzone'
import { CircularProgressbar } from 'react-circular-progressbar'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { api } from '@/trpc/react'
import useProject from '@/hooks/use-project'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation' // Changed from 'next/router'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

const MeetingCard = () => {
    const {project} = useProject()

    const processMeeting = useMutation({mutationFn: async (data:{meetingUrl:string, meetingId: string, projectId: string})=>{
        const {meetingUrl, meetingId, projectId} = data
        const response  = await axios.post('/api/process-meeting',{meetingUrl, meetingId, projectId})
        return response.data;
    }})

    const [isUploading, setIsUploading] = React.useState(false)
    const router = useRouter()
    const [progress, setProgress] = React.useState(0)
    const uploadMeeting = api.project.uploadMeeting.useMutation()
    const [uploadedUrl, setUploadedUrl] = React.useState<string | null>(null)

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'audio/*': ['.mp3', '.wav', '.m4a', '.flac']
        },
        multiple: false,
        maxSize: 50_000_000,
        onDrop: async (acceptedFiles: FileWithPath[]) => {
            if (acceptedFiles.length === 0) return

            setIsUploading(true)
            setProgress(0)
            try {
                if(!project) return 
                const file = acceptedFiles[0];
                if(!file) return
                
                const url = await uploadToCloudinary(file as File)
                setUploadedUrl(url)

                for (let i = 1; i <= 100; i++) {
                    setProgress(i)
                    await new Promise((resolve) => setTimeout(resolve, 30))
                }

                uploadMeeting.mutate({
                    projectId: project?.id || "",
                    meetingUrl: url,
                    name: file.name
                },{
                    onSuccess:(meeting)=>{
                        toast.success('Meeting uploaded successfully')
                        router.push('/meetings')
                        processMeeting.mutateAsync({
                            meetingUrl:url, meetingId: meeting.id, projectId: project?.id || ""
                        })
                    },
                    onError:()=>{
                        toast.error('Error uploading meeting')
                    }
                })
            } catch (error: any) {
                console.error('Upload failed:', error);
                toast.error(`Upload failed: ${error.message || error}`);
            } finally {
                setIsUploading(false); 
            }
        }
    })

    return (
        <Card className='col-span-2 flex flex-col items-center justify-center p-10' {...getRootProps()}>
            {!isUploading && (
                <>
                    <Presentation className='h-10 w-10 animate-bounce' />
                    <h3 className='mt-2 text-sm font-semibold text-white'>Create a new meeting</h3>
                    <p className='mt-1 text-center text-sm text-gray-500'>
                        Analyse your meeting with gutter
                        <br />
                        Powered by AI
                    </p>
                    <div className="mt-6">
                        <Button disabled={isUploading}>
                            <Upload className='-ml-0.5 mr-1.5 h-5 w-5' aria-hidden='true' />
                            Upload Meeting
                            <input className='hidden' {...getInputProps()} />
                        </Button>
                    </div>
                </>
            )}
            {isUploading && (
                <div className='flex flex-col items-center justify-center gap-2'>
                    <CircularProgressbar className='size-20' value={progress} strokeWidth={5} text={`${progress}%`} />
                    <p className='text-sm text-gray-500'>Uploading your meeting...</p>
                </div>
            )}
            {uploadedUrl && (
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">File uploaded successfully!</p>
                    <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                        View the uploaded file
                    </a>
                </div>
            )}
        </Card>
    )
}

export default MeetingCard