export function fieldClassName(hasError: boolean, className = '') {
  return `mt-1 block w-full rounded-md border p-2 shadow-sm focus:ring-indigo-500 ${
    hasError
      ? 'border-red-500 focus:border-red-500'
      : 'border-slate-300 focus:border-indigo-500'
  } ${className}`.trim();
}
