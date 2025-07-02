"use client"

import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useProject from "@/hooks/use-project"
import { api } from "@/trpc/react"
import AskQuestionCard from "../dashboard/ask-question-card"
import { MessageCircle, Clock, ChevronRight, User, FileText, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const QAPage = () => {
  const { projectId } = useProject()
  const { data: questions, isLoading } = api.project.getQuestions.useQuery({ projectId: projectId || "" })
  const [questionIndex, setQuestionIndex] = React.useState(0)

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      <div className="relative px-6 py-8 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
            Q&A Assistant
          </h1>
          <p className="text-gray-400">
            Ask questions about your codebase and get AI-powered answers
          </p>
        </div>

        {/* Ask Question Section */}
        <Card className="bg-gray-900/50 border-purple-500/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-white">Ask a Question</CardTitle>
                <CardDescription className="text-gray-400">
                  Get instant help from Commit Sense AI
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AskQuestionCard />
          </CardContent>
        </Card>

        {/* Saved Questions Section */}
        <Card className="bg-gray-900/50 border-purple-500/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-white">Saved Questions</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your previous questions and answers
                  </CardDescription>
                </div>
              </div>
              {questions && questions.length > 0 && (
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                  {questions.length} Questions
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-gray-400">Loading your questions...</p>
                </div>
              </div>
            ) : questions?.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-gray-800/50 rounded-full w-fit mx-auto mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No questions yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Ask your first question above to get started with AI-powered code assistance
                </p>
              </div>
            ) : (
              <Sheet>
                <div className="grid gap-4">
                  {questions?.map((question, index) => (
                    <SheetTrigger key={question.id} onClick={() => setQuestionIndex(index)}>
                      <Card className="group hover:bg-gray-800/50 transition-all duration-300 bg-gray-800/30 border-gray-700/50 hover:border-purple-500/30 cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
                              <User className="h-4 w-4 text-purple-400" />
                            </div>
                            <div className="flex-grow min-w-0">
                              <h3 className="font-medium text-white group-hover:text-purple-300 transition-colors line-clamp-2 mb-2">
                                {question.question}
                              </h3>
                              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                                {question.answer}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(question.createdAt).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(question.createdAt).toLocaleTimeString()}
                                  </div>
                                </div>
                                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-400 transition-colors" />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </SheetTrigger>
                  ))}
                </div>

                {questions && questions[questionIndex] && (
                  <SheetContent className="sm:max-w-[80vw] bg-gray-900 border-purple-500/20">
                    <SheetHeader className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          <MessageCircle className="h-5 w-5 text-purple-400" />
                        </div>
                        <SheetTitle className="text-xl font-semibold text-white">
                          Question Details
                        </SheetTitle>
                      </div>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-6">
                      {/* Question */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <div className="p-1 bg-blue-500/20 rounded">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          Question
                        </h3>
                        <div className="bg-gray-800/50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <p className="text-gray-300 leading-relaxed">
                            {questions[questionIndex].question}
                          </p>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                          <div className="p-1 bg-green-500/20 rounded">
                            <FileText className="h-4 w-4 text-green-400" />
                          </div>
                          Answer
                        </h3>
                        <div className="bg-gray-800/50 border-l-4 border-green-500 p-4 rounded-r-lg">
                          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {questions[questionIndex].answer}
                          </p>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 text-sm text-gray-400 pt-4 border-t border-gray-700">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(questions[questionIndex].createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(questions[questionIndex].createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                )}
              </Sheet>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default QAPage

