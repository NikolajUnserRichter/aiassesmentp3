export { cn } from './cn';

// Format date to locale string
export function formatDate(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format date with time
export function formatDateTime(date: string | Date, locale: string = 'en-US'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Generate a unique ID
export function generateId(): string {
  return crypto.randomUUID();
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle function
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Sleep function for async operations
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Safe JSON parse
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Convert snake_case to camelCase
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Convert camelCase to snake_case
export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

// Check if running on client side
export function isClient(): boolean {
  return typeof window !== 'undefined';
}

// Check if running on server side
export function isServer(): boolean {
  return typeof window === 'undefined';
}

// Get risk level color class
export function getRiskLevelClass(level: string): string {
  const classes: Record<string, string> = {
    minimal: 'risk-minimal',
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high',
    critical: 'risk-critical',
  };
  return classes[level] || 'risk-medium';
}

// Get risk level badge color
export function getRiskLevelBadgeColor(level: string): {
  bg: string;
  text: string;
  border: string;
} {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    minimal: {
      bg: 'bg-p3-green-day/10',
      text: 'text-p3-green-day',
      border: 'border-p3-green-day/30',
    },
    low: {
      bg: 'bg-p3-lemon-splash/20',
      text: 'text-p3-green-day-800 dark:text-p3-lemon-splash',
      border: 'border-p3-lemon-splash/50',
    },
    medium: {
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-800 dark:text-yellow-300',
      border: 'border-yellow-300 dark:border-yellow-700',
    },
    high: {
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-800 dark:text-orange-300',
      border: 'border-orange-300 dark:border-orange-700',
    },
    critical: {
      bg: 'bg-p3-flying-salmon/20 dark:bg-p3-flying-salmon/30',
      text: 'text-p3-flying-salmon-700 dark:text-p3-flying-salmon-300',
      border: 'border-p3-flying-salmon/50',
    },
  };
  return colors[level] || colors.medium;
}

// Export assessment to CSV
export function exportToCSV(assessment: Record<string, unknown>, filename: string): void {
  const rows: string[][] = [];

  // Add header
  rows.push(['Field', 'Value']);

  // Add assessment data
  Object.entries(assessment).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      rows.push([key, value.join('; ')]);
    } else if (typeof value === 'object' && value !== null) {
      rows.push([key, JSON.stringify(value)]);
    } else {
      rows.push([key, String(value)]);
    }
  });

  // Create CSV content
  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell}"`).join(','))
    .join('\n');

  // Download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
