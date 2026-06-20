import { useState } from 'react';
import { Alert, Badge, Button, Card, Input, TransactionItem } from '../components';

/**
 * Dashboard Page - Payment Brain Design System Demo
 * Showcases all components with proper design system implementation
 */
const Dashboard = () => {
  const [amount, setAmount] = useState('');
  const [showAlert, setShowAlert] = useState(true);

  const transactions = [
    {
      id: 1,
      merchantName: 'Amazon India',
      category: 'E-commerce',
      rail: 'UPI',
      time: '2 hours ago',
      amount: 2500,
      type: 'debit',
      status: 'success',
      icon: '🛒',
    },
    {
      id: 2,
      merchantName: 'Salary Credit',
      category: 'Income',
      rail: 'NEFT',
      time: '1 day ago',
      amount: 85000,
      type: 'credit',
      status: 'success',
      icon: '💼',
    },
    {
      id: 3,
      merchantName: 'Netflix Subscription',
      category: 'Entertainment',
      rail: 'Card',
      time: '3 days ago',
      amount: 649,
      type: 'debit',
      status: 'success',
      icon: '🎬',
    },
    {
      id: 4,
      merchantName: 'Swiggy Food Order',
      category: 'Food & Dining',
      rail: 'UPI',
      time: '5 days ago',
      amount: 450,
      type: 'debit',
      status: 'pending',
      icon: '🍔',
    },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-level-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-display-lg text-primary-600 font-medium">
              Payment Brain
            </h1>
            <div className="flex items-center gap-4">
              <Badge variant="success">Verified</Badge>
              <Button variant="ghost" size="sm">
                Profile
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Hero Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary-600 to-primary-800 text-white" elevated>
          <div className="space-y-2">
            <p className="text-body-lg opacity-90">Available Balance</p>
            <p className="text-display-xl font-medium tabular-nums">₹4,85,200.00</p>
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" size="sm">
                Send Money
              </Button>
              <Button variant="ghost" size="sm" className="text-white border-white/20 hover:bg-white/10">
                Request
              </Button>
            </div>
          </div>
        </Card>

        {/* Alerts Section */}
        {showAlert && (
          <div className="mb-8 space-y-4">
            <Alert
              severity="warning"
              title="Unusual Activity Detected"
              message="We noticed a payment of ₹45,000 to a new merchant. This is higher than your usual spending pattern."
              dismissible
              onDismiss={() => setShowAlert(false)}
              action={
                <div className="flex gap-3 mt-2">
                  <Button variant="primary" size="sm">
                    Review Transaction
                  </Button>
                  <Button variant="ghost" size="sm">
                    Dismiss
                  </Button>
                </div>
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Payment */}
            <Card>
              <h2 className="text-h2 text-neutral-900 mb-6">Quick Payment</h2>
              <div className="space-y-4">
                <Input
                  label="Enter UPI ID"
                  name="upi"
                  placeholder="name@upi"
                  required
                />
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  isAmount
                  required
                />
                <div className="flex gap-3">
                  <Button variant="primary" className="flex-1">
                    Pay Now
                  </Button>
                  <Button variant="secondary">
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h2 text-neutral-900">Recent Transactions</h2>
                <Button variant="ghost" size="sm">
                  View All →
                </Button>
              </div>
              <div className="divide-y divide-neutral-200 -mx-6">
                {transactions.map((txn) => (
                  <TransactionItem
                    key={txn.id}
                    {...txn}
                    onClick={() => console.log('Transaction clicked:', txn.id)}
                  />
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Intelligence Score */}
            <Card>
              <div className="text-center">
                <p className="text-label uppercase text-neutral-500 mb-2">
                  Intelligence Score
                </p>
                <div className="w-24 h-24 mx-auto rounded-full bg-success-bg flex items-center justify-center mb-3">
                  <p className="text-display-lg text-success font-medium">95</p>
                </div>
                <p className="text-caption text-neutral-600">
                  Excellent security profile
                </p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <h3 className="text-h3 text-neutral-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  📊 View Analytics
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  🔐 Security Settings
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  💳 Manage Cards
                </Button>
                <Button variant="secondary" size="sm" className="w-full justify-start">
                  📄 Statements
                </Button>
              </div>
            </Card>

            {/* Info Alert */}
            <Alert
              severity="info"
              message="Your behavioral fingerprint has been updated based on recent activity patterns."
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
