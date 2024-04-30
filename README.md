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

```javascript
import { Mallam } from "mallam";

const mallam = new Mallam("your_api_key_here");

(async() => {
  const res = await mallam.generatePrompt("berapa average harga rumah dekat johor?");
  console.log(res);
})()
```

## Configuration

Customize the parameter:
```javascript
const mallam = new Mallam(
  "your_api_key_here",
  {
    top_p: 100,
    temperature: 0.5
  }
)
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


