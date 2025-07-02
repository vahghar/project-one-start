'use client'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createCheckoutSession } from '@/lib/stripe'
import { api } from '@/trpc/react'
import { Info, CreditCard, Coins, Zap } from 'lucide-react'
import React from 'react'

const BillingPage = () => {
    const { data: credits } = api.project.getMyCredits.useQuery()
    const [creditsToBuy, setCreditsToBuy] = React.useState<number[]>([100])
    const creditsToBuyAmount = creditsToBuy[0]!;
    const price = (creditsToBuyAmount / 50) * 10;
    
    return (
        <div className="min-h-screen rounded-2xl bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            <div className="relative px-6 py-8 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                        Billing & Credits
                    </h1>
                    <p className="text-gray-400">
                        Manage your credits and purchase more to index your repositories
                    </p>
                </div>

                {/* Current Credits Card */}
                <Card className="bg-gray-900/50 border-purple-500/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                <Coins className="h-5 w-5 text-purple-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Current Credits</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Available credits for repository indexing
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-white mb-2">
                            {credits?.credits || 0}
                        </div>
                        <p className="text-sm text-gray-400">
                            credits remaining
                        </p>
                    </CardContent>
                </Card>

                {/* Info Card */}
                <Card className="bg-blue-500/10 border-blue-500/20">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Info className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-2">
                                <p className="text-sm text-blue-300 font-medium">
                                    How credits work
                                </p>
                                <div className="text-sm text-blue-200 space-y-1">
                                    <p>• Each credit allows you to index 1 file in your repository</p>
                                    <p>• If your project has 100 files, you'll need 100 credits</p>
                                    <p>• Credits are used when you create a new project</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Purchase Section */}
                <Card className="bg-gray-900/50 border-purple-500/10">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <CreditCard className="h-5 w-5 text-green-400" />
                            </div>
                            <div>
                                <CardTitle className="text-white">Purchase Credits</CardTitle>
                                <CardDescription className="text-gray-400">
                                    Select the number of credits you need
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Slider */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-400">Credits to purchase</span>
                                <span className="text-lg font-semibold text-white">{creditsToBuyAmount}</span>
                            </div>
                            <Slider 
                                defaultValue={[100]} 
                                max={1000} 
                                min={10} 
                                step={10} 
                                onValueChange={(value) => setCreditsToBuy(value)} 
                                value={creditsToBuy}
                                className="[&_[role=slider]]:bg-purple-500 [&_[role=slider]]:border-purple-600 [&>.relative>.absolute]:bg-purple-500"
                            />
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>10</span>
                                <span>1000</span>
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="bg-gray-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-4 w-4 text-yellow-400" />
                                    <span className="text-gray-300">Total Price</span>
                                </div>
                                <span className="text-2xl font-bold text-white">${price.toFixed(2)}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                ${(10/50).toFixed(2)} per credit
                            </p>
                        </div>

                        {/* Purchase Button */}
                        <Button 
                            onClick={() => createCheckoutSession(creditsToBuyAmount)}
                            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            size="lg"
                        >
                            <CreditCard className="h-4 w-4 mr-2" />
                            Purchase {creditsToBuyAmount} Credits
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default BillingPage
