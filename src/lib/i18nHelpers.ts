/**
 * Reusable i18n helper utilities for dynamic entity localization across AgriFlow AI.
 */

export function translateStatus(status?: string, t?: (key: string) => string): string {
  if (!status) return '';
  if (!t) return status;

  // Normalize key lookup: e.g. "In Transit" -> "status.inTransit", "ORDER CONFIRMED" -> "status.orderConfirmed"
  const normalized = status
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/[^a-zA-Z0-9]/g, '');

  const key = `status.${normalized}`;
  const translated = t(key);
  if (translated && translated !== key) {
    return translated;
  }

  // Also check direct lowercase
  const simpleKey = `status.${status.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const simpleTranslated = t(simpleKey);
  if (simpleTranslated && simpleTranslated !== simpleKey) {
    return simpleTranslated;
  }

  return status;
}

export function translateRole(role?: string, t?: (key: string) => string): string {
  if (!role) return '';
  if (!t) return role;

  const normalized = role.toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `role.${normalized}`;
  const translated = t(key);
  return translated && translated !== key ? translated : role;
}

export function translateQualityGrade(grade?: string, t?: (key: string) => string): string {
  if (!grade) return '';
  if (!t) return grade;

  // e.g. "Grade A", "A", "Grade B", "Organic Certified"
  const clean = grade.replace(/^grade\s+/i, '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const key = `grade.${clean}`;
  const translated = t(key);
  if (translated && translated !== key) {
    return translated;
  }

  const fullKey = `grade.${grade.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const fullTranslated = t(fullKey);
  if (fullTranslated && fullTranslated !== fullKey) {
    return fullTranslated;
  }

  return grade;
}

export function translateOrderStatus(status?: string, t?: (key: string) => string): string {
  return translateStatus(status, t);
}

export function translateDeliveryStatus(status?: string, t?: (key: string) => string): string {
  return translateStatus(status, t);
}

export function translateCategory(category?: string, t?: (key: string) => string): string {
  if (!category) return '';
  if (!t) return category;

  const key = `category.${category.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const translated = t(key);
  return translated && translated !== key ? translated : category;
}

export function translateFreshness(freshness?: string, t?: (key: string) => string): string {
  if (!freshness) return '';
  if (!t) return freshness;

  const key = `freshness.${freshness.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  const translated = t(key);
  return translated && translated !== key ? translated : freshness;
}
