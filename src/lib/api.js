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

// Function to simulate streaming in debug mode
async function streamMockData() {
  // Fetch mock data from aiResponse.md
  const response = await fetch('/aiResponse.md');
  const mockData = await response.text();
  
  // Split into small chunks (simulating streaming)
  const chunks = mockData.split('').reduce((acc, char, i) => {
    const chunkIndex = Math.floor(i / 10); // 10 characters per chunk
    acc[chunkIndex] = (acc[chunkIndex] || '') + char;
    return acc;
  }, []);
  
  return {
    async *[Symbol.asyncIterator]() {
      for (const chunk of chunks) {
        // Add a small random delay between chunks
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 150));
        yield { choices: [{ delta: { content: chunk } }] };
      }
    }
  };
}

export async function askAI() {
  const prompt = siteStore.userPrompt.trim();
  if (!prompt || siteStore.isStreaming) return;

  siteStore.isStreaming = true;
  let aiResponse = '';
  let filename = "";
  let processedFiles = new Set();

  // Regex to match filenames with extensions (e.g., index.html, style.css)
  const fileNamePattern = /[\w-]+\.\w+/;

  try {
    // Use mock data in debug mode, otherwise use OpenAI API
    const stream = import.meta.env.VITE_MODE === 'debug' 
      ? await streamMockData()
      : await openai.chat.completions.create({
          model: import.meta.env.VITE_LLM_MODEL,
          messages: [
            { role: 'system', content: siteStore.systemPrompt },
            { role: 'user', content: prompt }
          ],
          stream: true
        });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (!content) continue;

      // Add new content to the accumulated response
      aiResponse += content;
      
      // Process completed files first
      // Match pairs like <index.html>content</index.html> where the tag name contains a dot
      const completedFileTags = [...aiResponse.matchAll(/<([\w-]+\.\w+)>(.*?)<\/\1>/gs)];
      for (const match of completedFileTags) {
        const fileTag = match[1];
        if (fileNamePattern.test(fileTag) && !processedFiles.has(fileTag)) {
          siteStore.files[fileTag] = match[2].trim();
          processedFiles.add(fileTag);
          console.log('File completed:', fileTag);
          
          // If this was our active file, clear it
          if (fileTag === filename) {
            filename = '';
          }
        }
      }

      // Now look for new open tags for files not yet processed
      // Match tags like <index.html> that don't have a closing tag yet and contain a dot
      const openTags = [...aiResponse.matchAll(/<([\w-]+\.\w+)>(?!.*<\/\1>)/g)];
      for (const tag of openTags) {
        const potentialFilename = tag[1];
        // Check if it's a valid filename with extension and not already processed
        if (fileNamePattern.test(potentialFilename) && !processedFiles.has(potentialFilename) && potentialFilename !== filename) {
          filename = potentialFilename;
          siteStore.activeFile = filename;
          siteStore.files[filename] = '';
          
          // Update the current file content
          const startIndex = aiResponse.indexOf(`<${filename}>`) + filename.length + 2;
          siteStore.files[filename] = aiResponse.slice(startIndex).trim();
          break; // Focus on one new file at a time
        }
      }
      
      // Update content for current active file if it exists and isn't processed
      if (filename && !processedFiles.has(filename)) {
        const startIndex = aiResponse.indexOf(`<${filename}>`) + filename.length + 2;
        siteStore.files[filename] = aiResponse.slice(startIndex).trim();
      }
    }

    // Log complete response after streaming ends
    console.log('Complete AI Response:', aiResponse);

  } catch (error) {
    console.error('Error streaming from LLM:', error);
    siteStore.aiResponse = `Error: ${error.message}`;
  } finally {
    siteStore.isStreaming = false;
  }
}