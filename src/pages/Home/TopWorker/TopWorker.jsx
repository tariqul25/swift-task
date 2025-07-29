import React from 'react';
import { Trophy, Coins, Star } from 'lucide-react';

const mockWorkers = [
  {
    name: 'Ayesha Akter',
    photo: 'https://i.pravatar.cc/150?img=47',
    coins: 8650,
    tasksCompleted: 130,
    rating: 4.9
  },
  {
    name: 'Tanvir Hasan',
    photo: 'https://i.pravatar.cc/150?img=32',
    coins: 7230,
    tasksCompleted: 115,
    rating: 4.8
  },
  {
    name: 'Farzana Jahan',
    photo: 'https://i.pravatar.cc/150?img=27',
    coins: 6540,
    tasksCompleted: 102,
    rating: 4.7
  },
  {
    name: 'Mizanur Rahman',
    photo: 'https://i.pravatar.cc/150?img=15',
    coins: 5980,
    tasksCompleted: 97,
    rating: 4.6
  },
  {
    name: 'Sadia Khatun',
    photo: 'https://i.pravatar.cc/150?img=12',
    coins: 5530,
    tasksCompleted: 90,
    rating: 4.8
  },
  {
    name: 'Rakibul Islam',
    photo: 'https://i.pravatar.cc/150?img=8',
    coins: 4900,
    tasksCompleted: 85,
    rating: 4.5
  }
];

const TopWorker = () => {
  return (
    <section className="pb-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            🌟 Top Performing Workers
          </h2>
          <p className="text-xl text-gray-600">
            Meet our highest earning and most reliable workers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockWorkers.map((worker, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-1">
                    <Trophy className={`w-5 h-5 ${
                      index === 0 ? 'text-yellow-500' :
                      index === 1 ? 'text-gray-400' :
                      index === 2 ? 'text-yellow-600' : 'text-gray-300'
                    }`} />
                    <span className="text-sm font-semibold text-gray-600">
                      Rank #{index + 1}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium text-gray-700">
                      {worker.rating}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <img
                    src={worker.photo}
                    alt={worker.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-blue-200"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
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
