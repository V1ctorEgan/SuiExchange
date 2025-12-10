import React from 'react'
import { Search, Bell, User } from 'lucide-react'

export default function Home() {
  const renderTopbar = () => (
    <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8 flex-1">
        <h2 className="text-blue-500 font-semibold">Home</h2>
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search skills, NFTs, projects..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-slate-600">0x742d...FEd9</span>
        <Bell size={20} className="text-slate-600 cursor-pointer hover:text-slate-900" />
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer">
          U
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-full">
      {renderTopbar()}
      <div className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold mb-6 text-slate-900">Welcome back! 👋</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Skills Listed', value: '12' },
            { label: 'NFTs Owned', value: '8' },
            { label: 'Active Projects', value: '3' },
            { label: 'Earned (SUI)', value: '125.5' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <p className="text-slate-600 text-sm mb-2">{stat.label}</p>
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
            </div>
          ))}
        </div>

     
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Recent Activity</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y">
            {[
              { action: 'Sold NFT #234', desc: 'Received 5.2 SUI', time: '2 hours ago' },
              { action: 'New skill offer', desc: 'Web design - $500', time: '5 hours ago' },
              { action: 'Project completed', desc: 'Mobile app development', time: '1 day ago' },
            ].map((activity, idx) => (
              <div key={idx} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-900">{activity.action}</p>
                  <p className="text-sm text-slate-600">{activity.desc}</p>
                </div>
                <span className="text-xs text-slate-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
