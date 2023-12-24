/* eslint-disable @typescript-eslint/no-explicit-any */
import Markdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/themes/prism-dark.min.css";
import { ClipboardIcon, RefreshIcon } from "./Icons";
import { useEffect, useRef } from "react";

type ChatProps = {
  msgIndex: number;
  avatar: string | null;
  name: string;
  content: string;
  avatarAlt?: string;
  isBot?: boolean;
  wait?: boolean;
  regenerate?: (msgIndex: number) => void;
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

function CodeBlock(props: { value: string }) {
  const { value } = props;
  const blockRef = useRef<any>(null);

  useEffect(() => {
    Prism.highlightElement(blockRef.current as Element);
  }, []);

  return <code ref={blockRef}>{value}</code>;
}

export function LoadingConversation(props: { avatar: string; name: string }) {
  const { avatar, name } = props;

  return (
    <div className="chat loading">
      <div className="profile">
        {avatar && (
          <div className="img-profile">
            <img src={avatar} alt={`${name}'s Profile Picture`} sizes="100%" />
          </div>
        )}
        <p className="name">{name}</p>
      </div>
      <div className="content">
        {[...Array(3)].map((_, index) => (
          <span key={index} className="dot"></span>
        ))}
      </div>
    </div>
  );
}

export default function Conversation(props: ChatProps) {
  return (
    <div className={`chat${props.wait ? " wait" : ""}`}>
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
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              code({ children }) {
                return <CodeBlock value={children as string} />;
              },
              pre(props) {
                const childClass: string =
                  (props.children as any)?.props.className || "bash";
                const childText: string =
                  (props.children as any)?.props.children || "";

                const handleClick = () => {
                  copyToClipboard(childText);
                };

                return (
                  <div className="code-embed">
                    <div className="used-language">
                      <span>{childClass.replace(/language-/gi, "")}</span>
                      <div className="tooltip">
                        <div className="copy-btn" onClick={handleClick}>
                          <ClipboardIcon />
                        </div>
                      </div>
                    </div>
                    <pre
                      className={
                        childClass.startsWith("language-")
                          ? childClass
                          : `language-${childClass}`
                      }
                    >
                      {props.children}
                    </pre>
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
