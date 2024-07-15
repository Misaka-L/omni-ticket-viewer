import { useContext } from "react"

import type { Message, Participant } from "../types/ticket"

import ThemeContext, { Theme } from "../contexts/ThemeContext"

// @ts-expect-error Because the package is not typed
import { MessagePreview } from "@kookapp/kook-message-preview"
import {
  Avatar,
  Typography,
  Image,
  Dropdown,
  Button,
  Tooltip,
} from "@douyinfe/semi-ui"
import { IconCopy, IconMore } from "@douyinfe/semi-icons"

interface MessageProps {
  message: Message
  participants: { [userId: string]: Participant }
}

export default function Message({ message, participants }: MessageProps) {
  const sender = participants[message.senderId]
  const theme = useContext(ThemeContext)

  return (
    <div className="hover:bg-semi-color-bg-1 px-4 py-2">
      <div className="flex gap-3">
        <Dropdown
          trigger="contextMenu"
          position="bottomLeft"
          render={
            <Dropdown.Menu>
              <Dropdown.Item>复制 ID</Dropdown.Item>
            </Dropdown.Menu>
          }
        >
          <Avatar src={sender.avatarUrl} alt={sender.name} />
        </Dropdown>
        <div className="flex-1">
          <div className="flex mb-1">
            <div className="flex gap-1 items-baseline flex-1">
              <span className="font-bold text-lg">{sender.name}</span>
              <span className="text-xs opacity-80">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
            <div className="flex">
              <Tooltip content="复制原始内容" position="bottom">
                {message.content.type === "text" ? (
                  <Button
                    theme="borderless"
                    type="tertiary"
                    icon={<IconCopy />}
                    onClick={() => {
                      if (message.content.type !== "text") return

                      navigator.clipboard.writeText(message.content.text)
                    }}
                  />
                ) : (
                  <></>
                )}
              </Tooltip>
              <Dropdown
                trigger="hover"
                position="bottomRight"
                menu={[
                  {
                    node: "item",
                    name: "复制 ID",
                    onClick: () => {
                      navigator.clipboard.writeText(message.id)
                    },
                  },
                ]}
              >
                <Button
                  theme="borderless"
                  type="tertiary"
                  icon={<IconMore />}
                />
              </Dropdown>
            </div>
          </div>
          <MessageContent
            message={message}
            theme={theme}
            participants={participants}
          />
        </div>
      </div>
    </div>
  )
}

function MessageContent({
  message,
  theme,
  participants,
}: {
  message: Message
  theme: Theme
  participants: { [userId: string]: Participant }
}) {
  if (message.content.type === "image") {
    return (
      <Image
        src={message.content.url}
        className="rounded-md"
        imgCls="max-h-80"
      />
    )
  }

  const messageType = message.content.type == "text" ? "kmd" : "card"
  const messageContent = createMessageContent(message)

  return (
    <MessagePreview
      type={messageType}
      content={messageContent}
      theme={theme}
      customMetUserRender={(id: string) =>
        MentionUserRenderer(id, participants)
      }
      customRoleRender={(id: string) => customMentionRenderer("role", id)}
      customChannelRender={(id: string) => customMentionRenderer("channel", id)}
    />
  )
}

function MentionUserRenderer(
  id: string,
  participants: { [userId: string]: Participant }
) {
  const user = participants[id]

  if (!user) return customMentionRenderer("user", id)

  return <Typography.Text link={true}>@{user.name}</Typography.Text>
}

function customMentionRenderer(type: string, id: string) {
  return (
    <Typography.Text
      link={true}
      copyable={{
        content: id,
        copyTip: "复制 ID",
      }}
    >
      @{type}:{id}
    </Typography.Text>
  )
}

function createCard(card: unknown[]) {
  return [
    {
      type: "card",
      theme: "invisable",
      size: "lg",
      modules: card,
    },
  ]
}

function createFileCardMessage(
  url: string,
  name: string,
  size: number,
  type: string
) {
  return createCard([
    {
      type: type,
      title: name,
      src: url,
      size: String(size),
    },
  ])
}

function createMessageContent(message: Message) {
  switch (message.content.type) {
    case "text":
      return message.content.text
    case "file":
      return createFileCardMessage(
        message.content.url,
        message.content.name,
        message.content.size,
        message.content.type
      )
    case "card":
      return JSON.stringify(message.content.cards)
    default:
      return ""
  }
}
