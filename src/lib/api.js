// place files you want to import through the `$lib` alias in this folder.
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For client-side use (in production, use a backend proxy)
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