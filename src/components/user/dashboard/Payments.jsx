const Payments = () => {
  const paymentMethods = [
    {
      type: "Credit Card",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
      icon: "💳"
    },
    {
      type: "PayPal",
      email: "john.doe@paypal.com",
      isDefault: false,
      icon: "🔵"
    },
    {
      type: "Apple Pay",
      isDefault: false,
      icon: "🍎"
    }
  ];

  const transactionHistory = [
    {
      id: "#TXN-001",
      date: "2024-01-15",
      description: "iPhone 16 Pro Max",
      amount: -1490,
      status: "Completed"
    },
    {
      id: "#TXN-002",
      date: "2024-01-12",
      description: "Wireless Earbuds",
      amount: -299,
      status: "Completed"
    },
    {
      id: "#TXN-003",
      date: "2024-01-10",
      description: "Refund - Smart Watch",
      amount: 450,
      status: "Completed"
    },
    {
      id: "#TXN-004",
      date: "2024-01-08",
      description: "Phone Case",
      amount: -49,
      status: "Completed"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Transaction History</h3>
        <div className="space-y-3">
          {transactionHistory.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <div className="font-semibold text-gray-800">{transaction.id}</div>
                <div className="text-sm text-gray-500">{transaction.description}</div>
                <div className="text-xs text-gray-400">{transaction.date}</div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                  {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount)}
                </div>
                <div className="text-sm text-gray-500">{transaction.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Payments