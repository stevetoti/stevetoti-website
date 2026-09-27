// Run after npm run build. No live services or credentials are used.
const assert = require('node:assert/strict');
const { NextRequest } = require('next/server');
process.env.SUPABASE_TOTIROOM_ANON_KEY = 'test-anon';
process.env.TOTI_WEBSITE_BACKEND_KEY = 'test-website-only';
process.env.MEET_HOST_KEY = 'test-only-host-key-with-at-least-32-chars';
process.env.NODE_ENV = 'production';
const { POST } = require('../.next/server/app/api/meet/verify/route.js').routeModule.userland;
const request = (body, origin = 'https://site.example') => new NextRequest('https://site.example/api/meet/verify', { method: 'POST', headers: { 'content-type': 'application/json', origin }, body: JSON.stringify(body) });
let calls = [];
function mock(replies) {
  calls = [];
  global.fetch = async (url, init) => {
    const body = JSON.parse(init.body); calls.push({ url, body, headers: init.headers });
    const reply = replies.shift();
    assert.ok(reply, 'Unexpected backend request');
    return Response.json(reply.body, { status: reply.status || 200 });
  };
}
(async () => {
  mock([{ body: { success: true } }]);
  let result = await POST(request({ email: 'test@example.invalid' }));
  assert.equal((await result.json()).otpRequired, true);
  assert.equal(calls.length, 1); assert.equal(calls[0].body.action, 'send');
  mock([{ body: { verified: false } }]);
  result = await POST(request({ email: 'test@example.invalid', code: '123456' }));
  assert.equal((await result.json()).reason, 'bad_code'); assert.equal(calls.length, 1);
  const booking = { id: '11111111-1111-4111-8111-111111111111', title: 'Test', start_time: new Date().toISOString(), end_time: new Date(Date.now()+1800000).toISOString() };
  mock([{ body: { verified: true, verificationToken: 'test-proof' } }, { body: { bookings: [booking] } }, { body: { meetingToken: 'test-meeting-capability' } }]);
  result = await POST(request({ email: 'test@example.invalid', code: '123456' }));
  const data = await result.json();
  assert.equal(data.ok, true); assert.equal(data.meetingToken, undefined);
  assert.match(result.headers.get('set-cookie'), /HttpOnly/i); assert.match(result.headers.get('set-cookie'), /SameSite=strict/i);
  assert.equal(calls[1].body.verificationToken, 'test-proof'); assert.equal(calls[2].body.email, 'test@example.invalid');
  mock([{ body: { verified: true, verificationToken: 'test-proof' } }, { body: { bookings: [booking] } }, { status: 403, body: { error: 'limit' } }]);
  result = await POST(request({ email: 'test@example.invalid', code: '123456' }));
  assert.equal((await result.json()).ok, false); assert.equal(result.headers.get('set-cookie'), null);
  mock([]);
  result = await POST(request({ email: 'test@example.invalid' }, 'https://attacker.example'));
  assert.equal(result.status, 403); assert.equal(calls.length, 0);
  mock([]);
  result = await POST(request({ hostKey: 'wrong' })); assert.equal(result.status, 401); assert.equal(calls.length, 0);
  mock([{ body: { meetingToken: 'test-host-capability' } }]);
  result = await POST(request({ hostKey: process.env.MEET_HOST_KEY, room: 'discovery' }));
  assert.equal((await result.json()).host, true); assert.equal(calls[0].headers['x-toti-website'], 'test-website-only');
  console.log('7 meeting-admission contract scenarios passed; no live calls made.');
})().catch(error => { console.error(error); process.exitCode = 1; });
