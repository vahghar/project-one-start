import { CheckCircle, Zap, Star } from 'lucide-react'
import React from 'react'
import { Button } from './button'

const PricingSection = () => {
    return (
        <div>
            <section id="pricing" className="py-16 relative">
                <div className="absolute left-0 top-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                            Start Free, Pay for What You Use
                        </h2>
                        <p className="text-lg text-gray-300 max-w-xl mx-auto">
                            No monthly subscriptions. Only pay for the credits you need.
                        </p>
                    </div>

                    <div className="max-w-lg mx-auto">
                        <div className="relative">
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                    <Star className="w-3 h-3" />
                                    Free Forever
                                </span>
                            </div>
                            <div className="bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-[1.02]">
                                <div className="text-center mb-4">
                                    <h3 className="text-2xl font-bold mb-2 text-purple-300">Freemium</h3>
                                    <div className="mb-3">
                                        <span className="text-4xl font-bold text-white">$0</span>
                                        <span className="text-gray-400 text-lg">/forever</span>
                                    </div>
                                    <p className="text-gray-300 text-sm mb-4">
                                        Start analyzing your commits immediately. Purchase credits as needed.
                                    </p>
                                </div>
                                
                                <ul className="mb-6 space-y-3">
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Unlimited team members</span>
                                    </li>
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Advanced AI commit analysis</span>
                                    </li>
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Unlimited repositories</span>
                                    </li>
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Real-time collaboration tools</span>
                                    </li>
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Priority support</span>
                                    </li>
                                    <li className="flex items-center text-gray-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 mr-2 flex-shrink-0" />
                                        <span>Pay only for credits you use</span>
                                    </li>
                                </ul>
                                
                                <div className="text-center">
                                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 h-10 rounded-lg shadow-lg shadow-purple-500/25">
                                        Get Started Free
                                    </Button>
                                    <p className="text-xs text-gray-400 mt-2">
                                        No credit card required • Cancel anytime
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-6 text-center">
                            <div className="inline-flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg border border-purple-500/20">
                                <Zap className="w-3 h-3 text-purple-400" />
                                <span className="text-gray-300 text-xs">
                                    Credits can be purchased in-app when needed
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PricingSection