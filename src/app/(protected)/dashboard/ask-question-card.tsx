// AskQuestionCard.tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useProject from '@/hooks/use-project'
import Image from 'next/image'
import React from 'react'
import { askQuestion } from './action'
import { readStreamableValue } from 'ai/rsc'
import MDEditor from '@uiw/react-md-editor';
import CodeReferences from './code-references'
import { api } from '@/trpc/react'
import { toast } from 'react-toastify'
import useRefetch from '@/hooks/use-refetch'

const AskQuestionCard = () => {
    const { project } = useProject()
    const [question, setQuestion] = React.useState("")
    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = React.useState(false)
    const [fileReferences, setFileReferences] = React.useState<{ fileName: string; sourceCode: string; summary: string }[]>([])
    const [answer, setAnswer] = React.useState("")
    const saveAnswer = api.project.saveAnswer.useMutation()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!project?.id) return
        
        // Reset states
        setAnswer("")
        setFileReferences([])
        setLoading(true)
        setOpen(true)

        try {
            const { output, fileReferences } = await askQuestion(question, project.id)
            setFileReferences(fileReferences)

            // Handle streaming response
            for await (const delta of readStreamableValue(output)) {
                if (delta) {
                    setAnswer(prev => prev + delta)
                }
            }
        } catch (error) {
            console.error('Error processing question:', error)
            setAnswer("An error occurred while processing your question. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const refetch = useRefetch();

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className='flex items-center gap-2'>
                            <DialogTitle>
                                <Image src="/github.png" alt="gutter" width={40} height={40} />
                            </DialogTitle>
                            <Button disabled={saveAnswer.isPending} onClick={()=>{
                                saveAnswer.mutate({
                                    projectId: project?.id || "",
                                    question: question,
                                    answer: answer,
                                    fileReferences: fileReferences
                                },{
                                    onSuccess:()=>{
                                        toast.success('Answer saved successfully')
                                        refetch()
                                    },
                                    onError:()=>{
                                        toast.error('Error saving answer')
                                    }
                                })
                            }} variant={'outline'}> 
                                Save Answer
                            </Button>
                        </div>
                    </DialogHeader>
                    
                    {/*<div className="prose dark:prose-invert">
                        {loading ? (
                            <div className="animate-pulse">Processing your question...</div>
                        ) : (
                            <div className="whitespace-pre-wrap">{answer}</div>
                        )}
                    </div>*/}

                    {/*{fileReferences.length > 0 && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-2">Referenced Files</h3>
                            <div className="flex flex-col gap-2">
                                {fileReferences.map((file, index) => (
                                    <div key={file.fileName || index} className="p-2 bg-secondary rounded-md">
                                        {file.fileName}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}*/}

                    <MDEditor.Markdown source={answer} />
                    <div className="h-4"></div>
                    <CodeReferences fileReferences={fileReferences} />

                    <Button className='mt-4' onClick={()=>setOpen(false)}>
                        Close
                    </Button>
                </DialogContent>
            </Dialog>

            <Card className="relative col-span-3">
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmit}>
                        <Textarea 
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Which file should I edit to change the home page?"
                            className="min-h-[100px]"
                        />
                        <div className="h-4" />
                        <Button 
                            type="submit"
                            disabled={loading || !question.trim()}
                            className="submit"
                        >
                            {loading ? 'Processing...' : 'Ask Gutter'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </>
    )
}

export default AskQuestionCard