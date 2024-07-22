import type {
  ChatCompletionMessageParam,
  ChatCompletionProps,
  ChatCompletionResponse,
  CreateEmbeddingProps,
  CreateEmbeddingResponse,
  TranslationProps,
  TranslationResponse,
} from "../types";
import { completion } from "./services/completion";
import { create } from "./services/embedding";
import { translate } from "./services/translate";

export class Mallam {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // ----------------- Chat Completion -----------------
  chatCompletion = async <T extends boolean = false>(
    prompt: string | ChatCompletionMessageParam[],
    props?: ChatCompletionProps & { stream?: T },
  ): Promise<
    T extends true
    ? ReadableStream<ChatCompletionResponse>
    : ChatCompletionResponse
  > => {
    const defaultProps: ChatCompletionProps = {
      model: "mallam-small",
      temperature: 0.9,
      top_p: 0.95,
      top_k: 50,
      max_tokens: 256,
      stream: false,
    };

    props = Object.assign(defaultProps, props);

    return completion(this.apiKey, prompt, props);
  };

  // ----------------- Create Embedding -----------------
  createEmbedding = async (
    text: string,
    props?: CreateEmbeddingProps,
  ): Promise<CreateEmbeddingResponse> => {
    return create(this.apiKey, text, props);
  };

  // ----------------- Translation -----------------

  translate = async (
    prompt: string,
    props?: TranslationProps,
  ): Promise<TranslationResponse> => {
    return translate(this.apiKey, prompt, props);
  };
}
