import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Crown, Check, Star, Zap, Shield, Users } from 'lucide-react';

const Subscription = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  const fetchSubscriptionData = async () => {
    try {
      const [planResponse, plansResponse] = await Promise.all([
        axios.get('/api/subscription/current', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }),
        axios.get('/api/subscription/plans')
      ]);

      setCurrentPlan(planResponse.data);
      setPlans(plansResponse.data);
    } catch (error) {
      console.error('Error fetching subscription data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId) => {
    try {
      await axios.post('/api/subscription/upgrade', { plan_id: planId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchSubscriptionData();
      alert('Subscription upgraded successfully!');
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    }
  };

  const formatCurrency = (amount) => `₹${amount}`;

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Subscription Plans</h1>
        <p className="text-gray-600 dark:text-gray-400">Choose the perfect plan for your expense tracking needs</p>
      </div>

      {currentPlan && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">Current Plan</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Plan</p>
              <p className="font-semibold text-blue-900 dark:text-blue-100">{currentPlan.name}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Status</p>
              <p className={`font-semibold ${currentPlan.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                {currentPlan.status.charAt(0).toUpperCase() + currentPlan.status.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">Next Billing</p>
              <p className="font-semibold text-blue-900 dark:text-blue-100">
                {new Date(currentPlan.next_billing_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentPlan && currentPlan.id === plan.id;
          const isPopular = plan.name.toLowerCase().includes('pro');

          return (
            <div
              key={plan.id}
              className={`relative bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 ${
                isCurrentPlan
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10'
                  : isPopular
                  ? 'border-purple-500'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {isCurrentPlan && (
                <div className="absolute -top-3 right-4">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${
                  plan.name.toLowerCase().includes('free')
                    ? 'bg-gray-100 dark:bg-gray-700'
                    : plan.name.toLowerCase().includes('pro')
                    ? 'bg-purple-100 dark:bg-purple-900/30'
                    : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                  {plan.name.toLowerCase().includes('free') && <Check className="w-6 h-6 text-gray-600 dark:text-gray-400" />}
                  {plan.name.toLowerCase().includes('pro') && <Star className="w-6 h-6 text-purple-600" />}
                  {plan.name.toLowerCase().includes('enterprise') && <Shield className="w-6 h-6 text-blue-600" />}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>

                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600 dark:text-gray-400">/month</span>
                  )}
                </div>

                <p className="text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                {isCurrentPlan ? (
                  <button
                    disabled
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-4 py-2 rounded-lg cursor-not-allowed"
                  >
                    Current Plan
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                      isPopular
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {plan.price === 0 ? 'Get Started' : 'Upgrade'}
                  </button>
                )}
              </div>

              {plan.limits && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    {plan.limits.transactions && (
                      <div className="flex justify-between">
                        <span>Transactions:</span>
                        <span>{plan.limits.transactions === -1 ? 'Unlimited' : plan.limits.transactions}</span>
                      </div>
                    )}
                    {plan.limits.categories && (
                      <div className="flex justify-between">
                        <span>Categories:</span>
                        <span>{plan.limits.categories === -1 ? 'Unlimited' : plan.limits.categories}</span>
                      </div>
                    )}
                    {plan.limits.budgets && (
                      <div className="flex justify-between">
                        <span>Budgets:</span>
                        <span>{plan.limits.budgets === -1 ? 'Unlimited' : plan.limits.budgets}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-600 dark:text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Is there a free trial?</h3>
            <p className="text-gray-600 dark:text-gray-400">Yes, all paid plans come with a 14-day free trial. No credit card required to start.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">What payment methods do you accept?</h3>
            <p className="text-gray-600 dark:text-gray-400">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Can I cancel my subscription?</h3>
            <p className="text-gray-600 dark:text-gray-400">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;