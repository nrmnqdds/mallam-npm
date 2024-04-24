type Props = {
  model?: string;
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
  stream?: boolean;
}

interface Usage {
  prompt_tokens: number;
  total_tokens: number;
  completion_tokens: number;
}

type MallamResponse = {
  id: string;
  message: string;
  usage: Usage;
}

export class Mallam {
  private apiKey: string;
  private props: Props;

  constructor(apiKey: string, props?: Props) {
    this.apiKey = apiKey;

    const defaultProps: Props = {
      model: "mallam-small",
      temperature: 0.9,
      top_p: 0.95,
      top_k: 50,
      max_tokens: 256,
      stream: false
    };

    this.props = { ...defaultProps, ...props };
  }

  public generatePrompt = async (prompt: string): Promise<MallamResponse> => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${this.apiKey}`);
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
      "model": this.props.model,
      "temperature": this.props.temperature,
      "top_p": this.props.top_p,
      "top_k": this.props.top_k,
      "max_tokens": this.props.max_tokens,
      "stop": [
        "[/INST]",
        "[INST]",
        "<s>"
      ],
      "messages": [
        {
          "role": "user",
          "content": prompt
        }
      ],
      "tools": null,
      "stream": this.props.stream
    });

    const res = await fetch("https://llm-router.nous.mesolitica.com/chat/completions", {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const text = JSON.parse(await res.text())

    const result = {
      id: text.id,
      prompt,
      message: text.choices[0].message.content,
      usage: text.usage
    } as MallamResponse

    return result
  }

}
