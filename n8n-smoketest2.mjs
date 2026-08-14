import { workflow, node, trigger, newCredential } from '@n8n/workflow-sdk';

const startTrigger = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [0, 0] },
  output: [{}]
});

const probeDb = node({
  type: 'n8n-nodes-base.postgres',
  version: 2.7,
  config: {
    name: 'Probe DB',
    parameters: {
      resource: 'database',
      operation: 'executeQuery',
      query: "SELECT sp.id, sp.status, sp.plan, sp.cycle, sp.amount, sp.\"payerName\", sp.\"registeredClinicName\", sp.\"createdAt\", sp.\"organizationId\", sp.\"userId\", o.name AS org_name, o.slug FROM subscription_payments sp LEFT JOIN organizations o ON o.id = sp.\"organizationId\" ORDER BY sp.\"createdAt\" DESC;",
      options: {}
    },
    credentials: { postgres: newCredential('Postgres account') },
    position: [240, 0]
  },
  output: [{ id: 'abc', status: 'PENDING' }]
});

export default workflow('smoketest-payalert2', 'TEMP - Smoketest Payment Row Inspect')
  .add(startTrigger)
  .to(probeDb);
