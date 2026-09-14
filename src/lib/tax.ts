// Nigerian statutory payroll computation (PAYE, pension, NHF, NSITF, ITF).
//
// Model follows the Personal Income Tax Act as commonly applied:
//   1. Gross annual emolument
//   2. Less tax-exempt deductions (employee pension 8%, NHF 2.5%) -> statutory deductions
//   3. Consolidated Relief Allowance (CRA) = higher of ₦200,000 or 1% of gross, plus 20% of gross
//   4. Taxable income = gross - CRA - exempt deductions
//   5. Progressive PAYE bands applied to taxable income
//
// Employer-side contributions (pension 10%, NSITF 1%, ITF 1%) sit outside the
// employee's net pay but are part of payroll cost, so we surface them separately.

export const PENSION_EMPLOYEE_RATE = 0.08;
export const PENSION_EMPLOYER_RATE = 0.10;
export const NHF_RATE = 0.025;
export const NSITF_RATE = 0.01;
export const ITF_RATE = 0.01;

export const CRA_FIXED_MINIMUM = 200_000;
export const CRA_GROSS_FRACTION = 0.01;
export const CRA_PERCENTAGE_OF_GROSS = 0.20;

/** Minimum tax applied to the gross when computed PAYE would otherwise be negligible. */
export const MINIMUM_TAX_RATE = 0.01;

export interface TaxBand {
  label: string;
  /** Width of this band in naira per year; null means "everything above". */
  width: number | null;
  rate: number;
}

export const PAYE_BANDS: TaxBand[] = [
  { label: 'First ₦300,000', width: 300_000, rate: 0.07 },
  { label: 'Next ₦300,000', width: 300_000, rate: 0.11 },
  { label: 'Next ₦500,000', width: 500_000, rate: 0.15 },
  { label: 'Next ₦500,000', width: 500_000, rate: 0.19 },
  { label: 'Next ₦1,600,000', width: 1_600_000, rate: 0.21 },
  { label: 'Above ₦3,200,000', width: null, rate: 0.24 },
];

export interface BandBreakdown {
  label: string;
  rate: number;
  amountInBand: number;
  tax: number;
}

export interface PayrollComputation {
  annualGross: number;
  monthlyGross: number;
  /** Employee-side, tax-exempt */
  annualPension: number;
  annualNhf: number;
  cra: number;
  taxableIncome: number;
  annualPaye: number;
  bands: BandBreakdown[];
  minimumTaxApplied: boolean;
  monthlyPension: number;
  monthlyNhf: number;
  monthlyPaye: number;
  /** Total deducted from the employee */
  monthlyDeductions: number;
  monthlyNet: number;
  /** Employer-side cost, not deducted from the employee */
  monthlyEmployerPension: number;
  monthlyNsitf: number;
  monthlyItf: number;
  monthlyEmployerCost: number;
  /** Gross + employer contributions */
  monthlyTotalCost: number;
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

/** Apply the progressive PAYE bands to a taxable income. */
export function applyPayeBands(taxableIncome: number): { total: number; bands: BandBreakdown[] } {
  let remaining = Math.max(0, taxableIncome);
  let total = 0;
  const bands: BandBreakdown[] = [];

  for (const band of PAYE_BANDS) {
    if (remaining <= 0) {
      bands.push({ label: band.label, rate: band.rate, amountInBand: 0, tax: 0 });
      continue;
    }
    const amountInBand = band.width === null ? remaining : Math.min(remaining, band.width);
    const tax = amountInBand * band.rate;
    total += tax;
    remaining -= amountInBand;
    bands.push({ label: band.label, rate: band.rate, amountInBand: round(amountInBand), tax: round(tax) });
  }

  return { total: round(total), bands };
}

/**
 * Compute a full statutory breakdown from an annual gross salary.
 * `opts.pensionApplies` / `opts.nhfApplies` let contractors opt out of schemes
 * that only apply to full employees.
 */
export function computePayroll(
  annualGross: number,
  opts: { pensionApplies?: boolean; nhfApplies?: boolean } = {}
): PayrollComputation {
  const { pensionApplies = true, nhfApplies = true } = opts;
  const gross = Math.max(0, annualGross);

  const annualPension = pensionApplies ? gross * PENSION_EMPLOYEE_RATE : 0;
  const annualNhf = nhfApplies ? gross * NHF_RATE : 0;
  const exempt = annualPension + annualNhf;

  const cra = gross > 0
    ? Math.max(CRA_FIXED_MINIMUM, gross * CRA_GROSS_FRACTION) + gross * CRA_PERCENTAGE_OF_GROSS
    : 0;

  const taxableIncome = Math.max(0, gross - cra - exempt);
  const { total: bandTax, bands } = applyPayeBands(taxableIncome);

  // Where reliefs wipe out the liability, the minimum tax rule still applies.
  const minimumTax = gross * MINIMUM_TAX_RATE;
  const minimumTaxApplied = gross > 0 && bandTax < minimumTax;
  const annualPaye = gross > 0 ? Math.max(bandTax, minimumTax) : 0;

  const monthlyGross = gross / 12;
  const monthlyPension = annualPension / 12;
  const monthlyNhf = annualNhf / 12;
  const monthlyPaye = annualPaye / 12;
  const monthlyDeductions = monthlyPension + monthlyNhf + monthlyPaye;

  const monthlyEmployerPension = pensionApplies ? (gross * PENSION_EMPLOYER_RATE) / 12 : 0;
  const monthlyNsitf = (gross * NSITF_RATE) / 12;
  const monthlyItf = (gross * ITF_RATE) / 12;
  const monthlyEmployerCost = monthlyEmployerPension + monthlyNsitf + monthlyItf;

  return {
    annualGross: round(gross),
    monthlyGross: round(monthlyGross),
    annualPension: round(annualPension),
    annualNhf: round(annualNhf),
    cra: round(cra),
    taxableIncome: round(taxableIncome),
    annualPaye: round(annualPaye),
    bands,
    minimumTaxApplied,
    monthlyPension: round(monthlyPension),
    monthlyNhf: round(monthlyNhf),
    monthlyPaye: round(monthlyPaye),
    monthlyDeductions: round(monthlyDeductions),
    monthlyNet: round(monthlyGross - monthlyDeductions),
    monthlyEmployerPension: round(monthlyEmployerPension),
    monthlyNsitf: round(monthlyNsitf),
    monthlyItf: round(monthlyItf),
    monthlyEmployerCost: round(monthlyEmployerCost),
    monthlyTotalCost: round(monthlyGross + monthlyEmployerCost),
  };
}

/** Contractors are outside PAYE/pension/NHF; they attract 5% withholding tax instead. */
export const CONTRACTOR_WHT_RATE = 0.05;

export const VAT_RATE = 0.075;
export const WHT_RATE = 0.05;
