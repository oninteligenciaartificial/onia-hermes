import { workflow, node, trigger, newCredential } from '@n8n/workflow-sdk';

const startTrigger = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: { name: 'Start', position: [0, 0] },
  output: [{}]
});

const identifyDb = node({
  type: 'n8n-nodes-base.postgres',
  version: 2.7,
  config: {
    name: 'Identify DB',
    parameters: {
      resource: 'database',
      operation: 'executeQuery',
      query:
        "SELECT current_database() AS db, inet_server_addr()::text AS server_addr, inet_server_port() AS server_port, version() AS pg_version, (SELECT count(*)::int FROM organizations) AS org_count, (SELECT string_agg(name, ' | ') FROM (SELECT name FROM organizations ORDER BY \"createdAt\" ASC LIMIT 20) x) AS org_names, (SELECT count(*)::int FROM information_schema.schemata WHERE schema_name = 'n8n_ops') AS n8n_ops_schema_exists;",
      options: {}
    },
    credentials: { postgres: newCredential('Postgres account') },
    position: [240, 0]
  },
  output: [{ db: 'postgres', server_port: 5432, org_count: 9, org_names: 'x', n8n_ops_schema_exists: 1 }]
});

export default workflow('diag-payalert-db', 'TEMP - Diagnostico DB Postgres account')
  .add(startTrigger)
  .to(identifyDb);
