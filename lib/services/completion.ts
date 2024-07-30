import type {
	ChatCompletionMessageParam,
	ChatCompletionProps,
	ChatCompletionResponse,
} from "../../types/index.ts";

export const completion = async <T extends boolean = false>(
	apiKey: string,
	prompt: string | ChatCompletionMessageParam[],
	props?: ChatCompletionProps & { stream?: T },
): Promise<
	T extends true ? ReadableStream<string> : ChatCompletionResponse
> => {
	const myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${apiKey}`);
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
				transform: async (chunk, controller) => {
					if (chunk.startsWith("data: ")) {
						const jsonString = chunk.slice(6);
						try {
							const data = JSON.parse(jsonString);
							const result = {
								id: data.id,
								message: data.choices[0].delta.content,
								usage: data.usage,
							} as ChatCompletionResponse;

							controller.enqueue(`${JSON.stringify(result).split(/\s{2,}/)}\n`);
						} catch (e) {
							console.error("Error parsing JSON:", e);
						}
					}
				},
			}),
		) as T extends true ? ReadableStream<string> : never;
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
		? ReadableStream<string>
		: ChatCompletionResponse;
};
