type PlanId = 'basic' | 'crece' | 'professional' | 'clinic';
interface PlanLimits {
  patients: number;
  users: number;
  emailsPerMonth: number;
}

export const PLAN_LIMITS: Record<PlanId, PlanLimits> = {
  basic: { patients: 300, users: 2, emailsPerMonth: 200 },
  crece: { patients: 800, users: 4, emailsPerMonth: 400 },
  professional: { patients: 1500, users: 5, emailsPerMonth: 800 },
  clinic: { patients: -1, users: -1, emailsPerMonth: -1 },
};
