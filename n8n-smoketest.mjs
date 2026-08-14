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
      query: "SELECT current_database() AS db, inet_server_port() AS port, (SELECT count(*)::int FROM subscription_payments) AS payment_count, (SELECT count(*)::int FROM organizations) AS org_count;",
      options: {}
    },
    credentials: { postgres: newCredential('Postgres account') },
    position: [240, 0]
  },
  output: [{ db: 'postgres', port: 55329, payment_count: 0, org_count: 1 }]
});

export default workflow('smoketest-payalert', 'TEMP - Smoketest Payment Alert DB')
  .add(startTrigger)
  .to(probeDb);
