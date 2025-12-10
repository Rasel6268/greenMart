import { useAuth } from "@/Hooks/useAuth";
import apiClient from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

const Payments = () => {
  const {user} = useAuth()
  // Sample data based on your structure
  
  const {data: transactionHistory} = useQuery({
    queryKey: ['payments',user.email],
    queryFn: async() => {
      const res = await apiClient.get(`/transactions/${user.email}`)
      return res.data.data

    }
  })
  console.log(transactionHistory)

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get payment method icon
  const getPaymentIcon = (cardBrand) => {
    switch (cardBrand) {
      case 'MOBILEBANKING':
        return '📱';
      case 'CARD':
        return '💳';
      case 'BANK':
        return '🏦';
      default:
        return '💸';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Transaction History</h3>
        <div className="space-y-4">
          {transactionHistory?.map((transaction) => (
            <div 
              key={transaction._id} 
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getPaymentIcon(transaction.card_brand)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="font-semibold text-gray-800">{transaction.tran_id}</div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    Order: {transaction.orderId}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transaction.card_issuer} • {formatDate(transaction.createdAt)}
                  </div>
                  {transaction.payment_method && (
                    <div className="text-xs text-gray-400 mt-1">
                      Method: {transaction.payment_method}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  transaction.status === 'success' ? 'text-green-600' : 
                  transaction.status === 'failed' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {formatCurrency(transaction.amount, transaction.currency)}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Session: {transaction.sslcommerz_session.substring(0, 8)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      
      
    </div>
  );
};

export default Payments;