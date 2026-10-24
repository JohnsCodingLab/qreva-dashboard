import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DisputedTransactionCard = ({ transaction }) => {
  const navigate = useNavigate();

  return (
    <Card className="p-4 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-black truncate pr-2" title={transaction.title}>
            {transaction.title}
          </h3>
          <Button 
            variant="ghost" 
            className="text-qreva-orange hover:text-qreva-orange hover:bg-orange-50 p-0 h-auto font-medium text-sm flex items-center gap-1"
            onClick={() => navigate(`/disputed-transactions/${transaction.id}`)}
          >
            View Details <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-sm text-qreva-navy line-clamp-2">
          {transaction.description}
        </p>

        <div className="space-y-1 pt-2">
          <div className="flex items-center gap-2 text-sm text-qreva-navy">
            <User className="w-4 h-4 text-gray-400" />
            <span className="truncate">Recipient: {transaction.recipient}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-qreva-navy">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Transaction Date: {transaction.date}</span>
          </div>
        </div>
      </div>

      <div className="pt-4 mt-auto">
        <div className="flex justify-end items-end">
          <span className="text-lg font-bold text-black">
            {transaction.amount}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default DisputedTransactionCard;
