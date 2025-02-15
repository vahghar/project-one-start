"use client"

import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card } from "@/components/ui/card"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import AskQuestionCard from "../dashboard/ask-question-card"
import { MessageCircle, Clock, ChevronRight } from "lucide-react"

const QAPage = () => {
  const { projectId } = useProject()
  const { data: questions } = api.project.getQuestions.useQuery({ projectId: projectId || "" })
  const [questionIndex, setQuestionIndex] = React.useState(0)

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white p-8">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="relative max-w-7xl mx-auto space-y-8">
        <Card className="overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-colors bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/5">
          <div className="p-6 border-b border-purple-500/10 flex items-center gap-4">
            <div className="p-2 bg-purple-600/20 rounded-xl">
              <MessageCircle className="size-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                Ask a Question
              </h2>
              <p className="text-sm text-gray-400">Get instant help from Gutter AI</p>
            </div>
          </div>
          <div className="p-6">
            <AskQuestionCard />
          </div>
        </Card>

        <Card className="overflow-hidden border-purple-500/10 hover:border-purple-500/20 transition-colors bg-gray-900/50 backdrop-blur-sm shadow-xl hover:shadow-purple-500/5">
          <div className="p-6 border-b border-purple-500/10">
            <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              Saved Questions
            </h2>
          </div>
          <div className="p-6">
            <Sheet>
              <div className="grid gap-4">
                {questions?.map((question, index) => (
                  <SheetTrigger key={question.id} onClick={() => setQuestionIndex(index)}>
                    <Card className="hover:bg-gray-800/50 transition-colors p-4 flex items-center gap-4">
                      <img
                        className="rounded-full size-10 object-cover"
                        src={question.user.imageUrl ?? "/placeholder.svg?height=40&width=40"}
                        alt={"User"}
                      />
                      <div className="flex-grow text-left">
                        <p className="text-white font-medium line-clamp-1">{question.question}</p>
                        <p className="text-gray-400 text-sm line-clamp-1">{question.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <Clock className="size-4" />
                        <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                      </div>
                      <ChevronRight className="text-gray-400" />
                    </Card>
                  </SheetTrigger>
                ))}
              </div>

              {questions && questions[questionIndex] && (
                <SheetContent className="sm:max-w-[80vw] bg-gray-900 text-white">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold text-purple-400">
                      {questions[questionIndex].question}
                    </SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Answer:</h3>
                    <p className="text-gray-300">{questions[questionIndex].answer}</p>
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-gray-400">
                    <Clock className="size-4" />
                    <span>Asked on {new Date(questions[questionIndex].createdAt).toLocaleString()}</span>
                  </div>
                </SheetContent>
              )}
            </Sheet>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default QAPage

