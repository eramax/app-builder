// place files you want to import through the `$lib` alias in this folder.
import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: import.meta.env.API_KEY,
  dangerouslyAllowBrowser: true, // For client-side use (in production, use a backend proxy)
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173/',
    'X-Title': 'App-Builder'
  },
});

export async function* streamLLMResponse(codeSnippet, prompt) {
  try {
    const stream = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert web developer. Output only valid HTML/CSS/JS code with no explanations unless asked.'
        },
        {
          role: 'user',
          content: `Here's my current code:\n\`\`\`html\n${codeSnippet}\n\`\`\`\n\nPrompt: ${prompt}`
        }
      ],
      stream: true
    });

    let responseText = '';

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      responseText += content;
      yield responseText;
    }
  } catch (error) {
    console.error('Error streaming from LLM:', error);
    yield `Error: ${error.message}`;
  }
}

async function handleSubmit() {
  if (!$userPrompt.trim() || $isStreaming) return;

  $isStreaming = true;
  const generator = streamLLMResponse($files[$activeFile], $userPrompt);

  for await (const response of generator) {
    $files[$activeFile] = response;
  }

  $isStreaming = false;
}