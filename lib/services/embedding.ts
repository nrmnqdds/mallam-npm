import type {
	CreateEmbeddingProps,
	CreateEmbeddingResponse,
} from "../../types/index.ts";

export const create = async (
	apiKey: string,
	text: string,
	props?: CreateEmbeddingProps,
): Promise<CreateEmbeddingResponse> => {
	const myHeaders = new Headers();
	myHeaders.append("Authorization", `Bearer ${apiKey}`);
	myHeaders.append("Content-Type", "application/json");

	const raw = JSON.stringify({
		input: text,
		model: props?.model,
	});

	const res = await fetch("https://llm-router.nous.mesolitica.com/embeddings", {
		method: "POST",
		headers: myHeaders,
		body: raw,
		redirect: "follow",
	});

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
