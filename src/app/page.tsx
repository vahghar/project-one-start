'use client'
import React, { useEffect } from 'react';
import { Github, FileText, Users, GitCommit, ArrowRight, CheckCircle, Shield, Zap, Star, Code, Sparkles, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import FeatureSection from '@/components/ui/feature-card';
import PricingSection from '@/components/ui/pricing-card';
import TestimonialSection from '@/components/ui/testimonial-card';

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
              <Link href="https://github.com/vahghar/project-one-start" rel='noopener noreferrer' target='_blank' className="flex items-center">
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
      <FeatureSection/>

      {/* Pricing Section */}
      <PricingSection/>

      {/* Testimonials Section */}
      <TestimonialSection/>

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