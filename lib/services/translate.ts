import type {
	TranslationProps,
	TranslationResponse,
} from "../../types/index.ts";

export const translate = async (
	apiKey: string,
	prompt: string,
	props?: TranslationProps,
): Promise<TranslationResponse> => {
	const raw = JSON.stringify({
		input: prompt,
		to_lang: props?.toLang,
		model: props?.model,
		top_k: props?.top_k,
		top_p: props?.top_p,
		repetition_penalty: props?.repetition_penalty,
		temperature: props?.temperature,
	});

	const res = await fetch("https://api.mesolitica.com/translation", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`,
		},
		body: raw,
	});

	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	}

	const data = await res.json();

	return data;
};
