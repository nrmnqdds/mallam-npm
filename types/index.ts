export interface ChatCompletionProps {
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface CreateEmbeddingProps {
  model?: string;
}

export interface ChatCompletionMessageParam {
  role: string;
  content: string;
}

export interface Usage {
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens: number;
}

export interface ChatCompletionResponse {
  id: string;
  message: string;
  usage: Usage;
}

export type MallamAgent = {
  chatCompletion(
    messages: ChatCompletionMessageParam[],
  ): Promise<
    ChatCompletionResponse | ReadableStream<ChatCompletionResponse> | undefined
  >;
};

export type CreateEmbeddingResponse = {
  embedding: number[];
  usage: Usage;
};
