exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { messages } = JSON.parse(event.body);

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `You are a friendly and professional roofing damage assessment assistant for G.L Renovations LLC, a roofing company based in Belleville, MI (313-218-6265). Your job is to help homeowners assess their roof damage through a warm, conversational chat. Ask ONE question at a time. Be concise, clear, and reassuring. Follow this flow: 1) Ask what concern brought them here 2) Ask roof type 3) Ask about visible damage signs 4) Ask how old the roof is 5) Ask if recent or ongoing 6) Ask about recent storms. After 5-6 exchanges provide assessment starting with exactly "ASSESSMENT: Minor", "ASSESSMENT: Moderate", or "ASSESSMENT: Severe" then explain, advise repair vs replacement, mention insurance if relevant, and ask for name and phone for a FREE inspection. Keep responses 2-4 sentences. Warm and professional. No bullet lists.`,
        messages
      })
    });

    const data = await response.json();
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reply: data.content?.[0]?.text || "Something went wrong. Please call us at 313-218-6265." })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Something went wrong. Please call us at 313-218-6265." })
    };
  }
};
