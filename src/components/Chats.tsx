import { CompletionModel, Message } from "../utils/types";
import Conversation from "./Conversation";

export default function Chats(props: {
  messages: Message[];
  avatar: string;
  waitDone: boolean;
  selectedModel: CompletionModel;
  regenerate?: (msgIndex: number) => void;
}) {
  return props.messages
    .filter((f) => f.role !== "system")
    .map((el, i) => {
      const isUser = el.role === "user";
      const isAssistant = el.role === "assistant";
      const avatarAlt = isUser
        ? "User's Profile Picture"
        : `${props.selectedModel.model_name.split("/")[1]}'s Profile Picture`;
      const name = isUser
        ? "You"
        : props.selectedModel.model_name.split("/")[1];

      return (
        <Conversation
          wait={props.waitDone && i === props.messages.length - 1}
          msgIndex={i}
          avatar={isUser ? props.avatar : props.selectedModel.cover_img_url}
          avatarAlt={avatarAlt}
          name={name}
          content={el.content}
          isBot={isAssistant}
          regenerate={props.regenerate}
          key={i}
        />
      );
    });
}
