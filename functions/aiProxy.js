// Express route handler for HuggingFace proxy (to be used inside Firebase Functions or standalone)
const axios = require('axios');

// askAI will prefer HuggingFace if HUGGINGFACE_API_KEY is set, otherwise it will
// attempt to call SambaNova if SAMBANOVA_API_KEY and SAMBANOVA_ENDPOINT are provided.
// NOTE: SambaNova's exact payload and auth header may differ; adjust the request
// below to match SambaNova documentation if needed.
module.exports = async function askAI(question, context, hfModel = process.env.HUGGINGFACE_MODEL) {
  const hfKey = process.env.HUGGINGFACE_API_KEY;
  const sambaKey = process.env.SAMBANOVA_API_KEY;
  const sambaEndpoint = process.env.SAMBANOVA_ENDPOINT; // e.g. https://cloud.sambanova.ai/apis/v1/your-endpoint

  // Input used for HuggingFace-like models
  const hfInput = { inputs: { question, context: context || '' } };

  if (hfKey) {
    const model = hfModel || 'deepset/roberta-base-squad2';
    const resp = await axios.post(`https://api-inference.huggingface.co/models/${model}`, hfInput, {
      headers: { Authorization: `Bearer ${hfKey}` }
    });
    return resp.data;
  }

  if (sambaKey && sambaEndpoint) {
    // SambaNova cloud API may require a different payload. The example below sends
    // a JSON body with question/context. Replace with the exact schema from SambaNova.
    try {
      const resp = await axios.post(sambaEndpoint, { question, context }, {
        headers: {
          // Many APIs use Bearer tokens; if SambaNova requires a different header,
          // replace this line with the appropriate header name/value.
          Authorization: `Bearer ${sambaKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      });
      return resp.data;
    } catch (err) {
      // Bubble up SambaNova errors with context for easier debugging
      const detail = err?.response?.data || err.message || String(err);
      throw new Error(`SambaNova API error: ${detail}`);
    }
  }

  throw new Error('No AI API key configured. Set HUGGINGFACE_API_KEY or set SAMBANOVA_API_KEY and SAMBANOVA_ENDPOINT.');
};
