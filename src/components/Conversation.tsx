/* eslint-disable @typescript-eslint/no-explicit-any */
import Markdown from "react-markdown";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { ClipboardIcon, RefreshIcon } from "./Icons";

type ChatProps = {
  msgIndex: number;
  avatar: string | null;
  name: string;
  content: string;
  avatarAlt?: string;
  isBot?: boolean;
  regenerate?: (msgIndex: number) => Promise<void>;
};

function copyToClipboard(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

export function LoadingConversation(props: { avatar: string; name: string }) {
  return (
    <div className="chat loading">
      <div className="profile">
        <div className="img-profile">
          {!props.avatar ? null : (
            <img
              src={props.avatar}
              alt={`${props.name}'s Profile Picture`}
              sizes="100%"
            />
          )}
        </div>
        <p className="name">{props.name}</p>
      </div>
      <div className="content">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  );
}

export default function Conversation(props: ChatProps) {
  return (
    <div className="chat">
      <div className="profile">
        <div className="img-profile">
          {!props.avatar ? null : (
            <img
              src={props.avatar}
              alt={props.avatarAlt ?? ""}
              loading="lazy"
              sizes="100%"
            />
          )}
        </div>
        <p className="name">{props.name}</p>
      </div>
      <div className="content">
        {props.isBot ? (
          <Markdown
            children={props.content}
            components={{
              code(props) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { children, className, node, ...rest } = props;
                const highlight = hljs.highlightAuto(children as string);

                return (
                  <code
                    data-language={highlight.language}
                    {...rest}
                    className={className}
                    dangerouslySetInnerHTML={{ __html: highlight.value }}
                  ></code>
                );
              },
              pre(props) {
                const childClass: string =
                  (props.children as any)?.props.className || "bash";

                return (
                  <div className="code-embed">
                    <div className="used-language">
                      <span>{childClass.replace(/language-/gi, "")}</span>
                      <div className="tooltip">
                        <div
                          className="copy-btn"
                          onClick={() =>
                            copyToClipboard(
                              (props.children as any)?.props.children
                            )
                          }
                        >
                          <ClipboardIcon />
                        </div>
                      </div>
                    </div>
                    <pre>{props.children}</pre>
                  </div>
                );
              },
            }}
          />
        ) : (
          <p
            dangerouslySetInnerHTML={{
              __html: props.content
                .replace(/\n/g, "<br/>")
                .replace(/ /g, "&nbsp;")
                .replace(/\t/g, "&nbsp;".repeat(4)),
            }}
          ></p>
        )}
      </div>
      {props.isBot ? (
        <div className="chat-tooltip">
          <div
            className="copy-response"
            onClick={() => copyToClipboard(props.content)}
          >
            <ClipboardIcon />
          </div>
          <div
            className="regenerate-response"
            onClick={() => props.regenerate!(props.msgIndex)}
          >
            <RefreshIcon />
          </div>
        </div>
      ) : null}
    </div>
  );
}
