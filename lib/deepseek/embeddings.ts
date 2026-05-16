import { getDeepSeekClient } from './client';

export async function generateEmbedding(text: string): Promise<number[]> {
  const client = getDeepSeekClient();

  const response = await client.embeddings.create({
    model: 'deepseek-chat',
    input: text,
  });

  return response.data[0].embedding;
}

export async function generateEmbeddings(
  texts: string[],
): Promise<number[][]> {
  const client = getDeepSeekClient();

  const response = await client.embeddings.create({
    model: 'deepseek-chat',
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}
