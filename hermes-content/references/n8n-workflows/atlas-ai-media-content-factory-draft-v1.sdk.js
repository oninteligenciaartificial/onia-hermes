import { workflow, node, trigger, sticky, expr } from '@n8n/workflow-sdk';

const manualDryRun = trigger({
  type: 'n8n-nodes-base.manualTrigger',
  version: 1,
  config: {
    name: 'Manual Dry Run',
    position: [240, 300]
  },
  output: [{}]
});

const draftInput = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Draft Input',
    parameters: {
      mode: 'manual',
      includeOtherFields: false,
      assignments: {
        assignments: [
          { id: 'content-id', name: 'content_id', value: 'wroi-long-001', type: 'string' },
          { id: 'channel-id', name: 'channel_id', value: 'workflow_roi', type: 'string' },
          { id: 'channel-name', name: 'channel_name', value: 'Workflow ROI', type: 'string' },
          { id: 'language', name: 'language', value: 'en', type: 'string' },
          { id: 'market', name: 'market', value: 'USA', type: 'string' },
          { id: 'format', name: 'format', value: 'long', type: 'string' },
          { id: 'topic', name: 'topic', value: 'Build a 3-agent follow-up system for missed leads', type: 'string' },
          { id: 'priority', name: 'priority', value: 1, type: 'number' },
          { id: 'budget-mode', name: 'production_budget_mode', value: 'draft_only', type: 'string' },
          { id: 'approval-required', name: 'approval_required', value: true, type: 'boolean' }
        ]
      }
    },
    position: [520, 300]
  },
  output: [
    {
      content_id: 'wroi-long-001',
      channel_id: 'workflow_roi',
      channel_name: 'Workflow ROI',
      language: 'en',
      market: 'USA',
      format: 'long',
      topic: 'Build a 3-agent follow-up system for missed leads',
      priority: 1,
      production_budget_mode: 'draft_only',
      approval_required: true
    }
  ]
});

const buildReviewPackage = node({
  type: 'n8n-nodes-base.code',
  version: 2,
  config: {
    name: 'Build Review Package',
    parameters: {
      mode: 'runOnceForAllItems',
      jsCode: "const first = $input.first().json;\nconst channelName = first.channel_name;\nconst isSpanish = first.language === 'es';\nconst title = isSpanish ? 'La Automatizacion Basica Para No Perder Clientes Por WhatsApp' : 'Build an AI Follow-Up System So Leads Stop Disappearing';\nconst packageMarkdown = [\n  '# ' + title,\n  '',\n  'Content ID: ' + first.content_id,\n  'Channel: ' + channelName,\n  'Market: ' + first.market,\n  'Format: ' + first.format,\n  'Budget mode: ' + first.production_budget_mode,\n  '',\n  'Safety gates:',\n  '- Draft only.',\n  '- Human review required before generation, upload or publication.',\n  '- No revenue, savings or legal claims without sources.',\n  '- Use fictional data and generic UI only.',\n  '',\n  'Package required sections:',\n  '1. Hook.',\n  '2. Timestamped script.',\n  '3. Original workflow/demo.',\n  '4. Sources.',\n  '5. Fact-check JSON.',\n  '6. Visual prompts.',\n  '7. Thumbnail brief.',\n  '8. YouTube metadata.',\n  '9. Shorts derivatives.',\n  '10. Approval checklist.'\n].join('\\n');\nreturn [{ json: { ...first, title_final: title, package_markdown: packageMarkdown, next_state: 'ready_for_human_review', upload_allowed: false, publish_allowed: false } }];"
    },
    position: [820, 300]
  },
  output: [
    {
      content_id: 'wroi-long-001',
      title_final: 'Build an AI Follow-Up System So Leads Stop Disappearing',
      next_state: 'ready_for_human_review',
      upload_allowed: false,
      publish_allowed: false
    }
  ]
});

const safetyLock = node({
  type: 'n8n-nodes-base.set',
  version: 3.4,
  config: {
    name: 'Safety Lock - No Upload No Publish',
    parameters: {
      mode: 'manual',
      includeOtherFields: true,
      assignments: {
        assignments: [
          { id: 'upload-allowed', name: 'upload_allowed', value: false, type: 'boolean' },
          { id: 'publish-allowed', name: 'publish_allowed', value: false, type: 'boolean' },
          { id: 'human-review-required', name: 'human_review_required', value: true, type: 'boolean' },
          { id: 'approval-command', name: 'approval_command_needed', value: expr('Apruebo paquete YouTube: {{ $json.content_id }}'), type: 'string' },
          { id: 'review-summary', name: 'review_summary', value: expr('Package {{ $json.content_id }} is ready for human review. Upload and publish remain blocked.'), type: 'string' }
        ]
      }
    },
    position: [1120, 300]
  },
  output: [
    {
      content_id: 'wroi-long-001',
      next_state: 'ready_for_human_review',
      upload_allowed: false,
      publish_allowed: false,
      human_review_required: true
    }
  ]
});

const workflowNote = sticky(
  '## Atlas AI Media Content Factory Draft v1\nManual dry-run only. This workflow prepares a review package and explicitly blocks upload and publish. Add Supabase, AI agents, Telegram and schedule only after credentials and approvals are confirmed.',
  [manualDryRun, draftInput, buildReviewPackage, safetyLock],
  { color: 5 }
);

export default workflow('atlas-ai-media-youtube-content-factory-draft-v1', 'Atlas AI Media - YouTube Content Factory Draft v1')
  .add(manualDryRun)
  .to(draftInput)
  .to(buildReviewPackage)
  .to(safetyLock)
  .add(workflowNote);
