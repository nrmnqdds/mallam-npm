import type {
	ChatCompletionMessageParam,
	ChatCompletionProps,
	ChatCompletionResponse,
	CreateEmbeddingProps,
	CreateEmbeddingResponse,
	TranslationProps,
	TranslationResponse,
} from "../types/index.ts";

export class Mallam {
	private apiKey: string;

	constructor(apiKey: string) {
		this.apiKey = apiKey;
	}

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

		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${this.apiKey}`);
		myHeaders.append("Content-Type", "application/json");

		let messages: ChatCompletionMessageParam[] = [];
		if (typeof prompt === "string") {
			messages = [
				{
					role: "user",
					content: prompt,
				},
			];
		} else {
			messages = prompt;
		}

		const raw = JSON.stringify({
			model: props?.model,
			temperature: props?.temperature,
			top_p: props?.top_p,
			top_k: props?.top_k,
			max_tokens: props?.max_tokens,
			stop: ["[/INST]", "[INST]", "<s>"],
			messages: messages,
			tools: null,
			stream: props?.stream,
		});

		const res = await fetch(
			"https://llm-router.nous.mesolitica.com/chat/completions",
			{
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
			},
		);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		if (props?.stream) {
			return res.body?.pipeThrough(new TextDecoderStream()).pipeThrough(
				new TransformStream({
					transform: (chunk, controller) => {
						if (chunk.startsWith("data: ")) {
							const jsonString = chunk.slice(6);
							try {
								const data = JSON.parse(jsonString);
								const result = {
									id: data.id,
									prompt,
									message: data.choices[0].delta.content,
									usage: data.usage,
								} as ChatCompletionResponse;

								controller.enqueue(result);
							} catch (e) {
								console.error("Error parsing JSON:", e);
							}
						}
					},
				}),
			) as T extends true ? ReadableStream<ChatCompletionResponse> : never;
		}
		const text = await res.text();
		const parsedText = JSON.parse(text);

		const result = {
			id: parsedText.id,
			prompt,
			message: parsedText.choices[0].message.content,
			usage: parsedText.usage,
		} as ChatCompletionResponse;

		return result as T extends true
			? ReadableStream<ChatCompletionResponse>
			: ChatCompletionResponse;
	};

	// ----------------- Create Embedding -----------------
	createEmbedding = async (
		text: string,
		props?: CreateEmbeddingProps,
	): Promise<CreateEmbeddingResponse> => {
		const myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${this.apiKey}`);
		myHeaders.append("Content-Type", "application/json");

		const raw = JSON.stringify({
			input: text,
			model: props?.model || "base",
		});

		const res = await fetch(
			"https://llm-router.nous.mesolitica.com/embeddings",
			{
				method: "POST",
				headers: myHeaders,
				body: raw,
				redirect: "follow",
			},
		);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.json();

		const result = {
			embedding: data.data[0].embedding,
			usage: data.usage,
		};

		return result;
	};

	// ----------------- Translation -----------------

	translate = async (
		prompt: string,
		props?: TranslationProps,
	): Promise<TranslationResponse> => {
		const res = await fetch(
			"https://llm-router.nous.mesolitica.com/translation",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${this.apiKey}`,
				},
				body: JSON.stringify({
					input: prompt,
					to_lang: props?.toLang || "ms",
					model: props?.model || "small",
				}),
			},
		);

		if (!res.ok) {
			throw new Error(`HTTP error! status: ${res.status}`);
		}

		const data = await res.json();

		return data;
	};
}
