// https://github.com/Kokoro-js/ticket-bot-viewer/blob/9ba1914016457ef0724ddbb7b77476accbdf1161/src/types/ITicketJSON.ts

interface Ticket {
  ticketId: string
  ticketTitle: string
  asker: string
  parameters: Record<string, string>
  participants: Record<string, Participant>
  timeline: TimelineEvent[]
  conversation: Message[]
  guildId: string
  guildName: string
  instanceId: string
  instanceName: string
}

interface Participant {
  name: string
  avatarUrl: string
}

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
type TimelineEventLabel = "工单开启" | "工单关闭" | "首次回复" | string

interface TimelineEvent {
  label: TimelineEventLabel
  timestamp: string
  userId?: string
}

interface Message {
  id: string
  senderId: string
  timestamp: string
  content: TextContent | ImageContent | FileContent | CardContent
}

interface TextContent {
  type: "text"
  text: string
}

interface ImageContent {
  type: "image"
  url: string
}

interface FileContent {
  type: "file"
  url: string
  name: string
  file_type: string
  size: number
}

interface CardContent {
  type: "card"
  cards: unknown[]
}

export type {
  Ticket,
  Participant,
  TimelineEvent,
  TimelineEventLabel,
  Message,
  TextContent,
  ImageContent,
  FileContent,
}
