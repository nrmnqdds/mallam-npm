# MaLLaM NPM Package 🌙

A zero dependency wrapper around Malaysia Large Language Model(MaLLaM) for javascript users.

> Credits to [Mesolitica](https://mesolitica.com/) for this amazing API

[![Downloads](https://img.shields.io/npm/dm/mallam.svg)](https://npmjs.com/mallam)

## Why?
- Easier to modify the parameters using javascript syntaxes
- Easy implementation for MaLLaM 🌙 in your NodeJS app
- Helps non-phyton user to use the Mallam 🌙 API in their app

## API Key
Get your API key from [Mesolitica Website](https://app.nous.mesolitica.com/)

## Usage

### Chat Completion

```typescript
import { Mallam } from "mallam";

const mallam = new Mallam("your_api_key_here");

(async() => {
  const res = await mallam.chatCompletion("berapa average harga rumah dekat johor?");
  console.log(res);
})()
```
### Chat Completion with configuration(Not Stream)

```typescript
import { Mallam } from "mallam";

const mallam = new Mallam("your_api_key_here");

(async() => {
  const res = await mallam.chatCompletion("berapa average harga rumah dekat johor?", {
        temperature: 0.5,
        top_p: 0.95,
        top_k: 50,
        max_tokens: 256,
        stream: false
    });
  console.log(res);
})()
```

### Chat Completion with configuration(Streaming Response)

```typescript
import { Mallam } from "mallam";

const mallam = new Mallam("your_api_key_here");

(async() => {
  const res = await mallam.chatCompletion("berapa average harga rumah dekat johor?", {
        stream: false
  }) as ReadableStream;

  const reader = res.getReader();
  while (true) {
	const { done, value } = await reader.read();
	if (done) break;
	  console.log(value); // This will log each chunk as it arrives
	}
})()

```

Available configuration:

| Parameter    | Default Value |
| -------- | ------- |
| model  |"mallam-small"    |
| temperature | 0.9     |
| top_p    | 0.95    |
| top_k    | 50    |
| max_tokens    | 256    |
| stream    | false    |


### create embeddings

```typescript
import { mallam } from "mallam";

const mallam = new mallam("your_api_key_here");

(async() => {
  const res = await mallam.createEmbedding("saya sayang ibu saya");
  console.log(res);
})()
```

### Translation

```typescript
import { mallam } from "mallam";

const mallam = new mallam("your_api_key_here");

(async() => {
  const res = await mallam.translate("ddoes god reward the misunderstood or do I just have to deal with people invalidating how I truly feel all the time");
  console.log(res);
})()
```
