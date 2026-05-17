/**
 * Test script: sends a brief to the agent run endpoint and streams SSE events
 *
 * Usage: bun run scripts/test-agent.ts
 */
const API_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

const testBrief = `
We need a full-stack developer to build a mobile-first e-commerce platform for a Ugandan fashion brand.
The platform should support product listings, a shopping cart, M-Pesa and MTN MoMo payments,
and a basic admin dashboard for inventory management.

Required skills: React Native, Node.js, PostgreSQL, mobile payment APIs
Timeline: 8 weeks
Budget: flexible, but should reflect East African market rates
`;

async function test() {
  console.log('Sending test brief to agent...\n');

  const response = await fetch(`${API_URL}/api/agent/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ briefText: testBrief.trim(), region: 'uganda' }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error(`Request failed (${response.status}):`, body);
    process.exit(1);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    console.error('No response stream');
    process.exit(1);
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let stepCount = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (!raw) continue;

      try {
        const event = JSON.parse(raw);
        if (event.type === 'step_start') {
          stepCount++;
          console.log(`[${stepCount}] ▶ ${event.tool}`);
        } else if (event.type === 'step_complete') {
          console.log(`    ✓ ${event.summary} (${event.duration}ms)`);
        } else if (event.type === 'step_error') {
          console.log(`    ✗ ${event.error}`);
        } else if (event.type === 'agent_complete') {
          console.log('\n✅ Agent run complete!');
          console.log('Data:', JSON.stringify(event.data, null, 2));
        } else if (event.type === 'agent_error') {
          console.log('\n❌ Agent error:', event.error);
        }
      } catch {
        // skip
      }
    }
  }

  console.log(`\nTotal steps: ${stepCount}`);
}

test().catch(console.error);
