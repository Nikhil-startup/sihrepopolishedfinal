'use client';

import React, { ReactNode } from 'react';
import { PackageOpen } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface EmptyStateProps_i {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps_i) {
  const { t } = useI18n();

  return (
    <div className="py-14 text-center px-4 max-w-md mx-auto space-y-4 flex flex-col items-center justify-center">
      <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
      <div>
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          {title || t('common.emptyItemsFound')}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          {description || t('common.emptyItemsAdjust')}
        </p>
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

