import { CheckCircle } from 'lucide-react'
import React from 'react'
import { Button } from './button'

const PricingSection = () => {
    return (
        <div>
            <section id="pricing" className="py-20 relative">
                <div className="absolute left-0 top-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Choose the plan that best fits your team's needs
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            {
                                name: "Starter",
                                price: "$0",
                                period: "Forever",
                                features: ["Up to 3 team members", "Basic commit analysis", "Community support", "1 repository"],
                                buttonText: "Get Started",
                                popular: false
                            },
                            {
                                name: "Pro",
                                price: "$29",
                                period: "per month",
                                features: ["Up to 10 team members", "Advanced AI analysis", "Priority support", "Unlimited repositories", "Custom integrations"],
                                buttonText: "Start Free Trial",
                                popular: true
                            },
                            {
                                name: "Enterprise",
                                price: "Custom",
                                period: "per month",
                                features: ["Unlimited team members", "Advanced security features", "24/7 dedicated support", "Custom deployment", "SLA guarantee"],
                                buttonText: "Contact Sales",
                                popular: false
                            }
                        ].map((plan, index) => (
                            <div key={index} className={`relative ${plan.popular ? 'scale-105' : ''}`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">Most Popular</span>
                                    </div>
                                )}
                                <div className={`bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border ${plan.popular ? 'border-purple-500' : 'border-purple-500/10'} shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:scale-[1.02]`}>
                                    <h3 className="text-2xl font-bold mb-2 text-purple-300">{plan.name}</h3>
                                    <div className="mb-6">
                                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                                        <span className="text-gray-400">/{plan.period}</span>
                                    </div>
                                    <ul className="mb-8 space-y-4">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="flex items-center text-gray-400">
                                                <CheckCircle className="w-5 h-5 text-purple-400 mr-2" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    <Button className={`w-full ${plan.popular ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-800 hover:bg-gray-700'}`}>
                                        {plan.buttonText}
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PricingSection
