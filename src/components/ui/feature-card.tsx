import { BarChart, Code, FileText, Shield, Users, Zap } from 'lucide-react'
import React from 'react'

const FeatureSection = () => {
  return (
    <div>
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
    </div>
  )
}

export default FeatureSection
