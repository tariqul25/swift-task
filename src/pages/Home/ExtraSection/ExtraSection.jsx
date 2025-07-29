import React from 'react';
import { Shield, Zap, Users, TrendingUp, Award, Clock } from 'lucide-react';

const ExtraSection = () => {
  return (
    <>
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose MicroTask?
            </h2>
            <p className="text-xl text-gray-600">
              The most trusted platform for micro-tasking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payments
              </h3>
              <p className="text-gray-600">
                All transactions are protected with bank-level security. Your money is always safe.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Instant Earnings
              </h3>
              <p className="text-gray-600">
                Get paid immediately after task completion. No waiting periods or delays.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Global Community
              </h3>
              <p className="text-gray-600">
                Join thousands of workers and buyers from around the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold mb-2">50K+</div>
              <div className="text-xl opacity-90">Active Users</div>
            </div>
            <div className="animate-fade-in animation-delay-200">
              <div className="text-4xl font-bold mb-2">100K+</div>
              <div className="text-xl opacity-90">Tasks Completed</div>
            </div>
            <div className="animate-fade-in animation-delay-400">
              <div className="text-4xl font-bold mb-2">$1M+</div>
              <div className="text-xl opacity-90">Total Earnings</div>
            </div>
            <div className="animate-fade-in animation-delay-600">
              <div className="text-4xl font-bold mb-2">4.9/5</div>
              <div className="text-xl opacity-90">User Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple steps to start earning or hiring
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* For Workers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                For Workers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sign Up</h4>
                    <p className="text-gray-600">Create your account and get 10 free coins</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Browse Tasks</h4>
                    <p className="text-gray-600">Find tasks that match your skills</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Complete & Earn</h4>
                    <p className="text-gray-600">Submit your work and earn coins instantly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Buyers */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                For Buyers
              </h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Sign Up</h4>
                    <p className="text-gray-600">Create your account and get 50 free coins</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Post Tasks</h4>
                    <p className="text-gray-600">Create tasks with clear instructions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Review & Pay</h4>
                    <p className="text-gray-600">Review submissions and pay workers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ExtraSection;
