export const formatCurrencyAmount = (
  amount: number,
  currency: string,
): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });

  // Fallback assumes 2 decimal places
  const { maximumFractionDigits = 2 } = formatter.resolvedOptions();
  const majorUnitAmount = amount / Math.pow(10, maximumFractionDigits);

  return formatter.format(majorUnitAmount);
};

export const toMinorUnits = (amount: number, currency: string): number => {
  const { maximumFractionDigits = 2 } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).resolvedOptions();

  return Math.round(amount * Math.pow(10, maximumFractionDigits));
};

export const SUPPORTED_CURRENCIES = ["INR", "USD"] as const;
