import { Star } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const TestimonialSection = () => {
    return (
        <div>
            <section id="testimonials" className="py-20 relative">
                <div className="absolute inset-0 bg-purple-500/5"></div>
                <div className="container mx-auto px-6 relative">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
                            Loved by Developers
                        </h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            See what our users have to say about CommitSense
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Sarah Chen",
                                role: "Senior Developer at TechCorp",
                                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
                                quote: "CommitSense has transformed our code review process. The AI insights are incredibly accurate and save us hours every week."
                            },
                            {
                                name: "Michael Rodriguez",
                                role: "Tech Lead at StartupX",
                                image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
                                quote: "The automated documentation and dependency tracking features are game-changers. Our team's productivity has increased significantly."
                            },
                            {
                                name: "Emily Watson",
                                role: "CTO at DevFlow",
                                image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
                                quote: "Best investment we've made for our development team. The security insights alone have prevented several potential issues."
                            }
                        ].map((testimonial, index) => (
                            <div key={index} className="bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/10 shadow-xl hover:shadow-purple-500/5 transition-all duration-300 hover:scale-[1.02]">
                                <div className="flex items-center mb-6">
                                    <Image src={testimonial.image} alt={testimonial.name} height={48} width={48} className='rounded-full' />
                                    <div>
                                        <h4 className="font-semibold text-purple-300">{testimonial.name}</h4>
                                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 inline-block" />
                                    ))}
                                </div>
                                <p className="text-gray-400 italic">&quot;{testimonial.quote}&quot;</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default TestimonialSection
