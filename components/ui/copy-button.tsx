import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from './button';

interface CopyButtonProps {
  value: string;
  displayValue?: string;
  variant?: 'default' | 'address';
  color?: string;
}

function truncateAddress(address: string, startLength = 12, endLength = 8) {
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export function CopyButton({ value, displayValue, variant = 'default', color = 'primary' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  if (variant === 'address') {
    return (
      <div 
        className="w-full cursor-pointer hover:opacity-80 transition-opacity"
        onClick={onCopy}
      >
        <span className="font-mono text-sm block w-full">
          {truncateAddress(displayValue || value)}
        </span>
      </div>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      className={`text-${color}-500 hover:text-${color}-600 hover:bg-${color}-50 gap-1`}
      onClick={onCopy}
    >
      {copied ? (
        <Check className="h-4 w-4" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="font-medium">
        {displayValue || 'Copy Address'}
      </span>
    </Button>
  );
} 