import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  GiftIcon,
  BuildingLibraryIcon,
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftIcon,
  UserCircleIcon,
  EyeIcon,
  EyeSlashIcon,
  QrCodeIcon,
  PhoneIcon,
  DocumentTextIcon,
  EllipsisHorizontalIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  // Sample data
  const balance = 658230.45;
  const balanceChange = 12.6;
  const spendingAmount = 145890;
  const transactions = [
    { id: 1, name: 'Amazon', amount: -2499, date: '2 hours ago', category: 'Shopping', icon: '🛒' },
    { id: 2, name: 'Starbucks', amount: -450, date: '5 hours ago', category: 'Food', icon: '☕' },
    { id: 3, name: 'Zomato', amount: -890, date: 'Yesterday', category: 'Food', icon: '🍔' },
    { id: 4, name: 'Salary', amount: 85000, date: '2 days ago', category: 'Income', icon: '💰' },
  ];

  const quickActions = [
    { name: 'Scan & Pay', icon: QrCodeIcon, color: 'bg-blue-500' },
    { name: 'Pay Phone Number', icon: PhoneIcon, color: 'bg-purple-500' },
    { name: 'Pay Bills', icon: DocumentTextIcon, color: 'bg-green-500' },
    { name: 'More', icon: EllipsisHorizontalIcon, color: 'bg-orange-500' },
  ];

  const navItems = [
    { name: 'Home', icon: HomeIcon, active: true },
    { name: 'Accounts', icon: BuildingLibraryIcon },
    { name: 'Payments', icon: BanknotesIcon },
    { name: 'Investments', icon: ChartBarIcon },
    { name: 'Analytics', icon: ChartBarIcon },
    { name: 'Cards', icon: CreditCardIcon },
    { name: 'Rewards', icon: GiftIcon },
    { name: 'Settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className="min-h-screen bg-[#0a1628] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#0d1b2e] border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-white text-xl font-bold">NOVA</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                item.active
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Premium Upgrade */}
        <div className="p-4 m-4 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl">
          <div className="flex items-start gap-3 mb-3">
            <SparklesIcon className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="text-white font-semibold text-sm">Upgrade to Premium</h3>
              <p className="text-white/70 text-xs mt-1">Get exclusive benefits</p>
            </div>
          </div>
          <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            Upgrade Now
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.username?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{user?.username || 'User'}</p>
              <p className="text-gray-400 text-xs">{user?.email || 'user@example.com'}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-[#0d1b2e] border-b border-gray-800 px-8 py-4 sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Good Morning, {user?.username || 'User'}! 👋</h1>
              <p className="text-gray-400 text-sm mt-1">Welcome back to your financial dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 w-64"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <BellIcon className="w-6 h-6 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Messages */}
              <button className="relative p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ChatBubbleLeftIcon className="w-6 h-6 text-gray-400" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
              </button>

              {/* Profile */}
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <UserCircleIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Total Balance Card */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium opacity-90">Total Balance</span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {showBalance ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <div className="mb-4">
                  <h2 className="text-4xl font-bold mb-2">
                    {showBalance ? `₹${balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '₹••••••'}
                  </h2>
                  <div className="flex items-center gap-2">
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-300" />
                    <span className="text-sm text-green-300">+{balanceChange}% from last month</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white text-blue-600 px-4 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                    Send Money
                  </button>
                  <button className="flex-1 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-xl font-semibold hover:bg-white/20 transition-colors border border-white/20">
                    Add Money
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#0d1b2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <button
                      key={action.name}
                      className="flex flex-col items-center gap-3 p-4 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all border border-gray-700 hover:border-gray-600"
                    >
                      <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className="text-xs text-gray-300 text-center">{action.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-[#0d1b2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Transactions</h3>
                  <button className="text-blue-400 text-sm hover:text-blue-300">View All</button>
                </div>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/50 rounded-xl transition-colors border border-gray-700/50"
                    >
                      <div className="w-12 h-12 bg-gray-700 rounded-xl flex items-center justify-center text-2xl">
                        {transaction.icon}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{transaction.name}</p>
                        <p className="text-gray-400 text-sm">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-400' : 'text-white'}`}>
                          {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString('en-IN')}
                        </p>
                        <p className="text-gray-400 text-sm">{transaction.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Insights */}
            <div className="space-y-6">
              {/* Spending Overview */}
              <div className="bg-[#0d1b2e] rounded-2xl p-6 border border-gray-800">
                <h3 className="text-white font-semibold mb-4">Spending Overview</h3>
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-2">This Month</p>
                  <p className="text-3xl font-bold text-white">₹{spendingAmount.toLocaleString('en-IN')}</p>
                </div>

                {/* Simple Bar Chart */}
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Food & Dining</span>
                      <span className="text-white">₹45,890</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: '62%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Shopping</span>
                      <span className="text-white">₹38,200</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '51%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Transport</span>
                      <span className="text-white">₹28,400</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '38%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400">Entertainment</span>
                      <span className="text-white">₹33,400</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Insights */}
              <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                    <SparklesIcon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">AI Insight</h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                  You spent <span className="text-white font-semibold">15% more</span> on food this month compared to last month.
                  Consider setting a budget to optimize your spending.
                </p>
                <button className="mt-4 w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors border border-white/20">
                  View More Insights
                </button>
              </div>

              {/* Goals */}
              <div className="bg-[#0d1b2e] rounded-2xl p-6 border border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Savings Goal</h3>
                  <span className="text-blue-400 text-sm">75%</span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Vacation Fund</span>
                    <span className="text-white">₹75,000 / ₹1,00,000</span>
                  </div>
                  <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm font-medium transition-colors">
                  Add Funds
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
