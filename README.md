# ✨ unplugin-font-spider

Webfont compression plugin

## Features

- Only support SPA
- Support `vite` plugin
- Support router history mode

## 📦 install 

```bash
  npm install @yuanjianming/unplugin-font-spider -D
```

## 💪 Basic Use

- vite.config.ts


```ts
import { defineConfig } from 'vite'
import fontSpiderPlugin from '@yuanjianming/unplugin-font-spider/vite'
export default defineConfig({
    //....
    plugins: [fontSpiderPlugin({
        // history mode router path eg: ['/page1','/page2']
        routers:['']
    })],
})
```

##  👨‍💻 Config

|  option   | type  | default | describe |
|  ----  | ----  | ---- | ---- |
| `routers`  | `string[]` | `[]` | history mode router path 

