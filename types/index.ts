export interface ChatCompletionProps {
	/**
	 * Model to use for completion.
	 * @default "mallam-small"
	 */
	model?: "mallam-small" | "mallam-tiny" | "mallam-roleplay";

	/**
	 * Temperature for sampling.
	 * **Higher** temperature means **more randomness**.
	 * @default 0.9
	 */
	temperature?: number;

	/**
	 * Top p for nucleus sampling.
	 * **Higher** top_p means **more diverse**.
	 * @default 0.95
	 */
	top_p?: number;

	/**
	 * Top k for top k sampling.
	 * **Higher** top_k means **less accurate**.
	 * @default 50
	 */
	top_k?: number;

	/**
	 * Maximum tokens to generate.
	 * @default 256
	 */
	max_tokens?: number;

	/**
	 * Stream the response.
	 * @default false
	 */
	stream?: boolean;

	/**
	 * Repetition penalty.
	 * @default 1.05
	 */
	repetition_penalty?: number;

	/**
	 * Presence penalty.
	 * @default 0
	 */
	presence_penalty?: number;

	/**
	 * Frequency penalty.
	 * @default 0
	 */
	frequency_penalty?: number;
}

export interface CreateEmbeddingProps {
	/**
	 * Model to use for completion.
	 * @default "base"
	 */
	model?: string;
}

export interface ChatCompletionMessageParam {
	/**
	 * Role of the prompt.
	 */
	role: "user" | "system" | "assistant";

	/**
	 * Content of the prompt.
	 */
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

export type CreateEmbeddingResponse = {
	embedding: number[];
	usage: Usage;
};

export interface TranslationProps {
	/**
	 * Output language of the prompt.
	 */
	toLang?: string;
	model?: string;
	top_k?: number;
	top_p?: number;
	repetition_penalty?: number;
	temperature?: number;
}

type PickOnly<T, K extends keyof T> = Pick<T, K> & {
	[P in Exclude<keyof T, K>]?: never;
};

export interface TranslationResponse {
	result: string;
	usage: PickOnly<Usage, "prompt_tokens" | "total_tokens">;
}
