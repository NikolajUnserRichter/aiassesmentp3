'use client';

import * as React from 'react';
import { ChevronDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  groupBy?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  error,
  className,
  groupBy = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Group options if needed
  const groupedOptions = React.useMemo(() => {
    if (!groupBy) return { '': options };
    return options.reduce((acc, opt) => {
      const group = opt.group || '';
      if (!acc[group]) acc[group] = [];
      acc[group].push(opt);
      return acc;
    }, {} as Record<string, SelectOption[]>);
  }, [options, groupBy]);

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const nextIndex = currentIndex < options.length - 1 ? currentIndex + 1 : 0;
          if (!options[nextIndex].disabled) {
            onChange(options[nextIndex].value);
          }
        }
        break;
      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex((opt) => opt.value === value);
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : options.length - 1;
          if (!options[prevIndex].disabled) {
            onChange(options[prevIndex].value);
          }
        }
        break;
    }
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-xl border bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          error ? 'border-p3-flying-salmon' : 'border-input',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className={cn(!selectedOption && 'text-muted-foreground')}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDownIcon
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-scale-in">
          <div className="max-h-60 overflow-auto p-1">
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group}>
                {group && (
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {group}
                  </div>
                )}
                {groupOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      if (!option.disabled) {
                        onChange(option.value);
                        setIsOpen(false);
                      }
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors',
                      'hover:bg-muted focus:bg-muted focus:outline-none',
                      option.disabled && 'cursor-not-allowed opacity-50',
                      option.value === value && 'bg-p3-purple-rain/10 text-p3-purple-rain'
                    )}
                    role="option"
                    aria-selected={option.value === value}
                    disabled={option.disabled}
                  >
                    <span>{option.label}</span>
                    {option.value === value && (
                      <CheckIcon className="h-4 w-4 text-p3-purple-rain" />
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Multi-select component
interface MultiSelectProps {
  options: SelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  maxDisplay?: number;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = 'Select options',
  disabled = false,
  error,
  className,
  maxDisplay = 3,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  // Close on outside click
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const displayText = () => {
    if (selectedOptions.length === 0) return null;
    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map((opt) => opt.label).join(', ');
    }
    return `${selectedOptions.slice(0, maxDisplay).map((opt) => opt.label).join(', ')} +${selectedOptions.length - maxDisplay} more`;
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'flex min-h-[44px] w-full items-center justify-between rounded-xl border bg-background px-4 py-2 text-sm ring-offset-background transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          disabled && 'cursor-not-allowed opacity-50',
          error ? 'border-p3-flying-salmon' : 'border-input',
          isOpen && 'ring-2 ring-ring ring-offset-2'
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <div className="flex flex-1 flex-wrap gap-1">
          {selectedOptions.length > 0 ? (
            selectedOptions.slice(0, maxDisplay).map((opt) => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 rounded-md bg-p3-purple-rain/10 px-2 py-0.5 text-xs text-p3-purple-rain"
              >
                {opt.label}
                <button
                  type="button"
                  onClick={(e) => handleRemove(opt.value, e)}
                  className="hover:text-p3-flying-salmon transition-colors"
                >
                  <XMarkIcon className="h-3 w-3" />
                </button>
              </span>
            ))
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selectedOptions.length > maxDisplay && (
            <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              +{selectedOptions.length - maxDisplay} more
            </span>
          )}
        </div>
        <ChevronDownIcon
          className={cn(
            'ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg animate-scale-in">
          <div className="max-h-60 overflow-auto p-1">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => !option.disabled && handleToggle(option.value)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                  'hover:bg-muted focus:bg-muted focus:outline-none',
                  option.disabled && 'cursor-not-allowed opacity-50'
                )}
                role="option"
                aria-selected={value.includes(option.value)}
                disabled={option.disabled}
              >
                <div
                  className={cn(
                    'flex h-4 w-4 items-center justify-center rounded border transition-colors',
                    value.includes(option.value)
                      ? 'border-p3-purple-rain bg-p3-purple-rain text-white'
                      : 'border-muted-foreground'
                  )}
                >
                  {value.includes(option.value) && (
                    <CheckIcon className="h-3 w-3" />
                  )}
                </div>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
