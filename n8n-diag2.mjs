import { workflow, node, trigger, newCredential } from '@n8n/workflow-sdk';

const startTrigger = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [0, 0] },
  output: [{}]
});

const restUrl = 'https://kvepqgikokjlacxngkiw.supabase.co/rest/v1/organizations?select=id,name,createdAt&order=createdAt.asc&limit=20';

const cred1 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'REST via Supabase account',
    parameters: {
      method: 'GET',
      url: restUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'supabaseApi',
      options: {}
    },
    credentials: { supabaseApi: newCredential('Supabase account') },
    position: [280, 0],
    onError: 'continueRegularOutput'
  },
  output: [{ id: 'org-demo-001', name: 'Clínica Dental Demo' }]
});

const cred2 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'REST via Supabase account 2',
    parameters: {
      method: 'GET',
      url: restUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'supabaseApi',
      options: {}
    },
    credentials: { supabaseApi: newCredential('Supabase account 2') },
    position: [280, 200],
    onError: 'continueRegularOutput'
  },
  output: [{ id: 'org-demo-001', name: 'Clínica Dental Demo' }]
});

const cred3 = node({
  type: 'n8n-nodes-base.httpRequest',
  version: 4.2,
  config: {
    name: 'REST via Supabase account 3',
    parameters: {
      method: 'GET',
      url: restUrl,
      authentication: 'predefinedCredentialType',
      nodeCredentialType: 'supabaseApi',
      options: {}
    },
    credentials: { supabaseApi: newCredential('Supabase account 3') },
    position: [280, 400],
    onError: 'continueRegularOutput'
  },
  output: [{ id: 'org-demo-001', name: 'Clínica Dental Demo' }]
});

export default workflow('diag-payalert-db2', 'TEMP - Diagnostico cual Supabase cred = kvepqgikokjlacxngkiw')
  .add(startTrigger)
  .to(cred1)
  .add(startTrigger)
  .to(cred2)
  .add(startTrigger)
  .to(cred3);
