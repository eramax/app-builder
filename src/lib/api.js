// place files you want to import through the `$lib` alias in this folder.
import OpenAI from 'openai';
import { siteStore } from "$lib/store.svelte";
const openai = new OpenAI({
  baseURL: import.meta.env.VITE_LLM_PROVIDER,
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // For client-side use (in production, use a backend proxy)
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5173/',
    'X-Title': 'App-Builder'
  },
});

async function* streamLLMResponse(prompt) {
  try {
    const stream = await openai.chat.completions.create({
      model: import.meta.env.VITE_LLM_MODEL,
      // temperature: 0.3,
      // max_tokens: 16000,
      messages: [
        {
          role: 'system',
          content: siteStore.systemPrompt
        },
        {
          role: 'user',
          content: `${prompt}`
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

function parseFileContents(responseText) {
  const fileContents = {};
  const fileRegex = /<([^>]+)>([\s\S]*?)<\/\1>/g;
  let match;
  
  while ((match = fileRegex.exec(responseText)) !== null) {
    const fileName = match[1];
    const content = match[2].trim();
    fileContents[fileName] = content;
  }
  
  return fileContents;
}

// Parse partial response to extract potential file content
function parsePartialResponse(responseText) {
  const fileContents = {};
  
  // Look for complete file tags
  const completeFileRegex = /<([^>]+)>([\s\S]*?)<\/\1>/g;
  let match;
  while ((match = completeFileRegex.exec(responseText)) !== null) {
    const fileName = match[1];
    const content = match[2].trim();
    fileContents[fileName] = content;
  }
  
  // Look for opened but not closed file tags (for in-progress files)
  const openTags = [...responseText.matchAll(/<([^>]+)>/g)];
  for (const openTag of openTags) {
    const tagName = openTag[1];
    const closeTagRegex = new RegExp(`</${tagName}>`, 'g');
    
    // If there's no matching close tag
    if (!closeTagRegex.test(responseText.substring(openTag.index))) {
      const startIndex = openTag.index + openTag[0].length;
      const partialContent = responseText.substring(startIndex).trim();
      
      // Only update if we have content and the file isn't already completely parsed
      if (partialContent && !fileContents[tagName]) {
        fileContents[tagName] = partialContent;
      }
    }
  }
  
  return fileContents;
}

export async function askAI() {
  const prompt = siteStore.userPrompt.trim()
  if (!prompt || siteStore.isStreaming) return;

  siteStore.isStreaming = true;
  const generator = streamLLMResponse(prompt);
  
  let finalResponse = '';
  let activeFileSet = false;
  
  for await (const response of generator) {
    finalResponse = response;
    siteStore.files.response = response;
    
    // Parse the partial response to extract file contents
    const fileContents = parsePartialResponse(response);
    
    // Update each file in the store
    for (const [fileName, content] of Object.entries(fileContents)) {
      siteStore.files[fileName] = content;
      
      // Set active file to the first file in the response if not already set
      if (!activeFileSet) {
        siteStore.activeFile = fileName;
        activeFileSet = true;
      }
    }
  }
  
  // Final parse to ensure all files are properly extracted
  const completeFileContents = parseFileContents(finalResponse);
  
  // Update with the final complete content
  for (const [fileName, content] of Object.entries(completeFileContents)) {
    siteStore.files[fileName] = content;
  }
  
  // Ensure active file is set to one of the complete files
  if (Object.keys(completeFileContents).length > 0 && !activeFileSet) {
    siteStore.activeFile = Object.keys(completeFileContents)[0];
  }
  
  siteStore.isStreaming = false;
}