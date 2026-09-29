import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Consumer Records Found",
  message = "No consumer consumption records match the selected filters. Please adjust or reset your filters to view analytics.",
  onReset
}) => {
  return (
    <div className="flex items-center justify-center p-8 w-full min-h-[400px]">
      <Card variant="white" hoverable={false} className="max-w-md text-center py-8 px-6">
        <div className="mx-auto w-16 h-16 bg-[#FF6B6B] border-3 border-[#111111] rounded-full flex items-center justify-center shadow-[3px_3px_0px_0px_#111111] mb-5">
          <AlertCircle className="w-9 h-9 text-white stroke-[2.5]" />
        </div>
        <h3 className="text-xl font-bold font-display uppercase tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-sm font-medium text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>
        {onReset && (
          <Button variant="yellow" onClick={onReset} size="sm">
            Reset All Filters
          </Button>
        )}
      </Card>
    </div>
  );
};
