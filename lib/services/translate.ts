import type {
	TranslationProps,
	TranslationResponse,
} from "../../types/index.ts";

export const translate = async (
	apiKey: string,
	prompt: string,
	props?: TranslationProps,
): Promise<TranslationResponse> => {
	const res = await fetch(
		"https://llm-router.nous.mesolitica.com/translation",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				input: prompt,
				to_lang: props?.toLang,
				model: props?.model,
			}),
		},
	);

	if (!res.ok) {
		throw new Error(`HTTP error! status: ${res.status}`);
	}

	const data = await res.json();

	return data;
};
