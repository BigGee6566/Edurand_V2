import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY not set' }), {
        status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const { messages, context } = await req.json();
    const { remaining = 0, perDay = 0, daysLeft = 0, name = 'Student', university = 'your university', fundingType = 'NSFAS' } = context ?? {};

    const system = `You are EduRand Coach, an AI money coach for South African students. Keep replies under 3 sentences, conversational. Student: ${name} at ${university}, funded by ${fundingType}. They have R${Math.round(remaining)} left for ${daysLeft} days (R${Math.round(perDay)}/day). Give practical, South-Africa-specific advice on budgeting, cheap meals, side hustles, and student finance.`;

    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 300, system, messages }),
    });

    if (!upstream.ok) {
      return new Response(JSON.stringify({ error: 'Upstream error' }), {
        status: upstream.status, headers: { ...CORS, 'Content-Type': 'application/json' },
      });
    }

    const data = await upstream.json();
    const text = data.content?.[0]?.text ?? '';
    return new Response(JSON.stringify({ text }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    });
  }
});
