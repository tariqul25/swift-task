import React, { useState, useEffect } from 'react';
import { Trophy, Coins, Star } from 'lucide-react';

const TopWorker = () => {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    // Mock data - replace with actual API call
    const mockWorkers = [
      {
        id: 1,
        name: "Sarah Johnson",
        photo: "https://images.unsplash.com/photo-1494790108755-2616b612b372?w=150&h=150&fit=crop&crop=face",
        coins: 2500,
        rating: 4.9,
        tasksCompleted: 120
      },
      {
        id: 2,
        name: "Michael Chen",
        photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        coins: 2350,
        rating: 4.8,
        tasksCompleted: 95
      },
      {
        id: 3,
        name: "Emma Davis",
        photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        coins: 2200,
        rating: 4.9,
        tasksCompleted: 110
      },
      {
        id: 4,
        name: "James Wilson",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        coins: 2150,
        rating: 4.7,
        tasksCompleted: 88
      },
      {
        id: 5,
        name: "Lisa Anderson",
        photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        coins: 2100,
        rating: 4.8,
        tasksCompleted: 92
      },
      {
        id: 6,
        name: "David Martinez",
        photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        coins: 2050,
        rating: 4.6,
        tasksCompleted: 85
      }
    ];
    setWorkers(mockWorkers);
  }, []);

  return (
    <section className="pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Top Performing Workers
          </h2>
          <p className="text-xl text-gray-600">
            Meet our highest earning and most reliable workers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workers.map((worker, index) => (
            <div 
              key={worker.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Trophy className={`w-5 h-5 ${
                      index === 0 ? 'text-yellow-500' : 
                      index === 1 ? 'text-gray-400' : 
                      index === 2 ? 'text-yellow-600' : 'text-gray-300'
                    }`} />
                    <span className="text-sm font-medium text-gray-600">
                      Rank #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-600">
                      {worker.rating}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <img 
                    src={worker.photo} 
                    alt={worker.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-100"
                  />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {worker.name}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <div className="flex items-center space-x-1 bg-yellow-100 px-3 py-1 rounded-full">
                      <Coins className="w-4 h-4 text-yellow-600" />
                      <span className="text-yellow-800 font-semibold">
                        {worker.coins.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm">
                    {worker.tasksCompleted} tasks completed
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopWorker;