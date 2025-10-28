// src/lib/embedding.ts
import { pipeline, PipelineType } from '@xenova/transformers';

const task: PipelineType = 'feature-extraction';
const model = 'Xenova/all-mpnet-base-v2';

const extractor = await pipeline(task, model);

export async function generateEmbedding(textContent: string): Promise<number[] | null> {
  try {
    const output = await extractor(textContent, {
      pooling: 'mean',
      normalize: true,
    });

    // 5. Convert the data to a normal array and return it.
    return Array.from(output.data);

  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}