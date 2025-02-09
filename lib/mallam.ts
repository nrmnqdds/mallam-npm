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
		T extends true ? ReadableStream<string> : ChatCompletionResponse
	> => {
		const defaultProps: ChatCompletionProps = {
			model: "mallam-small",
			temperature: 0.9,
			top_p: 0.95,
			top_k: 50,
			repetition_penalty: 1.05,
			presence_penalty: 0,
			frequency_penalty: 0,
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
		const defaultProps: CreateEmbeddingProps = {
			model: "base",
		};

		Object.assign(defaultProps, props);
		return create(this.apiKey, text, props);
	};

	// ----------------- Translation -----------------
	translate = async (
		prompt: string,
		props?: TranslationProps,
	): Promise<TranslationResponse> => {
		const defaultProps: TranslationProps = {
			toLang: "ms",
			model: "small",
			top_k: 1,
			top_p: 1,
			repetition_penalty: 1.1,
			temperature: 0,
		};

		props = Object.assign(defaultProps, props);

		return translate(this.apiKey, prompt, props);
	};
}
