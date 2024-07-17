# omni-ticket-viewer

一个查看 Omni Bot 生成的工单 json 文件的查看器。

## 如何使用

在 `https://misaka-l-omni-ticket.deno.dev/` 后直接添加 `?src={工单 json 的链接}`，如 `https://misaka-l-omni-ticket.deno.dev/?src=https://xxxxx/ticket.json`.

## 开发

- 项目使用了 corepack，请先启用 corepack: `corepack enable`。
- `yarn install` && `yarn run dev`

## 路线图

- 支持拖入和上传 json 文件。
