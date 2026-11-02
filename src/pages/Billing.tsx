import React from 'react';
import { BillingHeader } from '../components/billing/BillingHeader';
import { CurrentPlan } from '../components/billing/CurrentPlan';
import { PaymentMethods } from '../components/billing/PaymentMethods';
import { BillingHistory } from '../components/billing/BillingHistory';

export const Billing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-black pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <BillingHeader />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CurrentPlan />
            <BillingHistory />
          </div>
          <div>
            <PaymentMethods />
          </div>
        </div>
      </div>
    </div>
  );
};