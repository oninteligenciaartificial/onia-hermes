-- ONIA Dental Module base schema draft (Clinica Odontologica).
-- Status: draft, reference only. Do not apply directly to product databases.
-- Product repos must translate this schema through their own migrations.
--
-- Namespace onia_dental_*. Depende de tablas del core (organization/member/
-- document) por referencia logica; no las redefine. NO redefine tampoco lo
-- que DentaGest ya tiene implementado (Patient, ClinicalRecord, ToothRecord,
-- PatientTreatment, Prescription siguen siendo del producto) -- patientId
-- referencia el Patient del producto por convencion, no una tabla de este
-- schema.

create table if not exists onia_dental_perio_charts (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  tooth_number integer not null,
  exam_date date not null,
  sites_json jsonb not null,
  mobility_grade integer,
  furcation_grade integer,
  recorded_by_member_id text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_perio_charts_patient_idx
  on onia_dental_perio_charts (organization_id, patient_id, tooth_number);

create table if not exists onia_dental_treatment_plans (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  status text not null default 'draft',
  title text,
  total_cost numeric,
  patient_approved_at timestamptz,
  approved_by_staff_member_id text,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_treatment_plans_patient_idx
  on onia_dental_treatment_plans (organization_id, patient_id, status);

create table if not exists onia_dental_informed_consents (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  treatment_plan_id text,
  procedure_type text not null,
  status text not null default 'pending',
  patient_signed_at timestamptz,
  professional_signed_at timestamptz,
  witness_name text,
  document_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_informed_consents_patient_idx
  on onia_dental_informed_consents (organization_id, patient_id);

create table if not exists onia_dental_medical_alerts (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  alert_type text not null,
  severity text not null,
  description text not null,
  active boolean not null default true,
  recorded_by_member_id text,
  resolved_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_medical_alerts_patient_active_idx
  on onia_dental_medical_alerts (organization_id, patient_id, active);

create table if not exists onia_dental_lab_cases (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  treatment_plan_id text,
  lab_name text not null,
  case_type text not null,
  status text not null default 'ordered',
  ordered_at timestamptz not null,
  expected_return_date date,
  received_at timestamptz,
  installed_at timestamptz,
  cost numeric,
  ordered_by_member_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_lab_cases_patient_idx
  on onia_dental_lab_cases (organization_id, patient_id, status);

create table if not exists onia_dental_tooth_images (
  id text primary key,
  organization_id text not null,
  patient_id text not null,
  tooth_number integer not null,
  image_type text not null,
  captured_at timestamptz not null,
  document_id text not null,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onia_dental_tooth_images_patient_tooth_idx
  on onia_dental_tooth_images (organization_id, patient_id, tooth_number);
