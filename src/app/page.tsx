'use client'
import React, { useEffect } from 'react';
import { Github, FileText, Users, GitCommit, ArrowRight, CheckCircle, Shield, Zap, Star, Code, Sparkles, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

function App() {
  const { isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn) {
      redirect('/dashboard')
    }
  }, [isSignedIn]);

  if (isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white overflow-hidden">
      {/* Navbar */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center backdrop-blur-sm bg-gray-950/50 fixed top-0 left-0 right-0 z-50 border-b border-purple-500/10">
        <div className="flex items-center space-x-2">
          <GitCommit className="w-7 h-7 text-purple-500 animate-pulse" />
          <span className="font-bold text-2xl bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">CommitSense</span>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Features</a>
          <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Pricing</a>
          <a href="#testimonials" className="text-gray-300 hover:text-purple-400 transition-all hover:scale-105">Testimonials</a>
          <Button variant="outline" className='border-purple-500/20 hover:bg-purple-500/10 hover:text-white'>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section with Animated Elements */}
      <header className="container mx-auto px-6 pt-32 pb-20 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center px-4 py-2 bg-purple-500/10 rounded-full mb-8 border border-purple-500/20 animate-bounce">
            <Sparkles className="w-4 h-4 text-purple-400 mr-2" />
            <span className="text-sm text-purple-300">Revolutionizing Code Reviews</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 text-transparent bg-clip-text leading-tight">
            Transform Your GitHub <br />Workflow with AI
          </h1>
          <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            CommitSense uses advanced AI to analyze your commits, providing intelligent summaries, 
            dependency tracking, and collaboration tools that make code reviews a breeze.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 group text-lg h-14 px-8">
              <Link href="/sign-up" className="flex items-center">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant={'outline'} className='border-purple-500/20 hover:bg-purple-500/5 h-14 px-8 text-lg hover:text-white'>
              <Github className="w-5 h-5 mr-2" />
              <Link href="https://github.com/vahghar/project-one-start" className="flex items-center">
                View on GitHub
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-12 border-t border-purple-500/10">
            <div className="text-center">
              <h3 className="text-4xl font-bold text-purple-400 mb-2">10k+</h3>
              <p className="text-gray-400">Active Users</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-purple-400 mb-2">1M+</h3>
              <p className="text-gray-400">Commits Analyzed</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-purple-400 mb-2">98%</h3>
              <p className="text-gray-400">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <h3 className="text-4xl font-bold text-purple-400 mb-2">24/7</h3>
              <p className="text-gray-400">Support</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section with Cards */}
      <section id="features" className="py-20 relative">
        <div className="absolute right-0 top-1/2 w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[120px] -z-10"></div>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-purple-600 text-transparent bg-clip-text">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to streamline your development workflow and boost team productivity.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Code className="w-6 h-6 text-purple-400" />,
                title: "Smart Code Analysis",
                description: "AI-powered analysis of your commits with detailed insights and impact assessment."
              },
              {
                icon: <Users className="w-6 h-6 text-purple-400" />,
                title: "Team Collaboration",
                description: "Seamless collaboration with team members through intelligent review assignments and discussions."
              },
              {
                icon: <Shield className="w-6 h-6 text-purple-400" />,
                title: "Security Insights",
                description: "Automatic detection of security vulnerabilities and best practice violations."
              },
              {
                icon: <BarChart className="w-6 h-6 text-purple-400" />,
                title: "Performance Metrics",
                description: "Detailed analytics and insights about your team's development patterns."
              },
              {
                icon: <FileText className="w-6 h-6 text-purple-400" />,
                title: "Documentation",
                description: "Automated documentation generation and maintenance based on your codebase."
              },
              {
                icon: <Zap className="w-6 h-6 text-purple-400" />,
                title: "Quick Integration",
                description: "Set up in minutes with our streamlined GitHub integration process."
              }
            ].map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/10 shadow-xl hover:shadow-purple-500/5 transition-all duration-300 group-hover:scale-[1.02] group-hover:border-purple-500/30">
                  <div className="bg-purple-600/20 w-12 h-12 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-purple-300">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
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

      {/* Testimonials Section */}
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
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
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

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 blur-3xl -z-10"></div>
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your workflow?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already using CommitSense to improve their development process.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700 group text-lg">
              <Link href="/sign-up" className="flex items-center">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-purple-500/20 hover:bg-purple-500/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-16 border-t border-purple-500/10">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <GitCommit className="w-6 h-6 text-purple-500" />
                <span className="font-bold text-white text-xl">CommitSense</span>
              </div>
              <p className="text-gray-400">Making code reviews smarter with AI-powered insights.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-purple-400 transition">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition">Pricing</a></li>
                <li><a href="#testimonials" className="hover:text-purple-400 transition">Testimonials</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400 transition">About</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Careers</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-purple-400 transition">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Terms</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-purple-500/10 mt-12 pt-8 text-center">
            <p>© 2025 CommitSense. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;