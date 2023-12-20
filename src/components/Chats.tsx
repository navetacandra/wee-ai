import { CompletionModel, Message } from "../utils/types";
import Conversation from "./Conversation";

export default function Chats(props: {
  messages: Message[];
  avatar: string;
  selectedModel: CompletionModel;
  regenerate?: (msgIndex: number) => Promise<void>;
}) {
  return props.messages
    .filter((f) => f.role !== "system")
    .map((el, i) => {
      if (el.role == "user") {
        return (
          <Conversation
            msgIndex={i}
            avatar={props.avatar}
            avatarAlt="User's Profile Picture"
            name="You"
            content={el.content}
            key={i}
          />
        );
      } else if (el.role == "assistant") {
        return (
          <Conversation
            msgIndex={i}
            avatar={props.selectedModel.cover_img_url}
            avatarAlt={`${
              props.selectedModel.model_name.split("/")[1]
            }'s Profile Picture`}
            name={props.selectedModel.model_name.split("/")[1]}
            content={el.content}
            isBot={true}
            regenerate={props.regenerate}
            key={i}
          />
        );
      }
    });
}
