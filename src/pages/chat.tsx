/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import Chats from "../components/Chats";
import { LoadingConversation } from "../components/Conversation";
import { ChevronDownIcon, SendIcon } from "../components/Icons";
import Deepinfra from "../utils/deepinfra";
import isMobile from "../utils/isMobile";
import { CompletionModel, Message } from "../utils/types";
import '../styles/chat.css';

const avatars = ["/ava-1.jpg", "/ava-2.jpg", "/ava-3.jpg"];

export default function Chat() {
  const deepinfraRef = useRef<Deepinfra | null>(null);
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const chatAreaScrollerRef = useRef<HTMLDivElement | null>(null);
  const promptsRef = useRef<HTMLTextAreaElement | null>(null);

  const [modelLoaded, setModelLoaded] = useState(false);
  const [models, setModels] = useState([] as CompletionModel[]);
  const [selectedModel, setSelectedModel] = useState(0);
  const [avatar, setAvatar] = useState("");
  const [messages, setMessages] = useState([] as Message[]);
  const [loadMessages, setLoadMessages] = useState(false);
  const [waitDone, setWaitDone] = useState(false);

  async function deepinfraInitialize() {
    if (!deepinfraRef.current) {
      deepinfraRef.current = new Deepinfra();
      await deepinfraRef.current.init();
    }
  }

  async function loadModel() {
    if (modelLoaded) return;

    try {
      await deepinfraInitialize();
      setModels(deepinfraRef.current!.models);
      setModelLoaded(true);
    } catch (error) {
      console.error(`Error loading models: ${error}`);
      alert("Error loading models");
      setTimeout(loadModel, 5000);
    }
  }

  function keydownHandler(el: any) {
    const isTabKey = el.which === 9;
    const isEnterKey = el.which === 13;
    const isModifierKey = el.ctrlKey || el.shiftKey;

    if (isTabKey) {
      el.preventDefault();
    }

    if (!isMobile(window.navigator.userAgent) && !isModifierKey && isEnterKey) {
      el.preventDefault();
      (document.querySelector(".send-btn") as HTMLButtonElement).click();
    }
  }

  async function generateCompletion(messages: Message[]) {
    try {
      await deepinfraInitialize();
      const res = await deepinfraRef.current?.completionStream(
        {
          messages,
          model: models[selectedModel].model_name,
        },
        messages,
        setMessages,
        setLoadMessages,
        setWaitDone
      );

      if (res!.code !== 200) {
        throw new Error("Failed to get response.");
      }
    } catch (err) {
      setMessages([
        ...messages,
        {
          role: "assistant",
          content: err?.toString() ?? "Failed to get response",
        },
      ]);
    } finally {
      document
        .querySelector(".chat-area")
        ?.scrollTo(0, document.querySelector(".chat-area")!.scrollHeight);
    }
  }

  function generate() {
    if (waitDone || loadMessages) return;
    const prompt = promptsRef.current;
    const input = prompt?.value || "";

    if (input.length < 1 || loadMessages || !modelLoaded) return;

    const newMessage = { role: "user", content: input } as Message;
    const updatedMessages = [...messages, newMessage];

    setMessages(updatedMessages);
    setLoadMessages(true);
    prompt!.value = "";

    generateCompletion(updatedMessages);
  }

  function regenerate(msgIndex: number) {
    if (waitDone || loadMessages) {
      return;
    }

    const updatedMessages = messages.slice(0, msgIndex);
    setMessages(updatedMessages);
    setLoadMessages(true);

    generateCompletion(updatedMessages);
  }

  useEffect(() => {
    loadModel();
    if (avatar.length < 1) {
      setAvatar(avatars[Math.floor(Math.random() * avatars.length)]);
    }

    chatAreaRef.current = document.querySelector(".chat-area");
    chatAreaScrollerRef.current = document.querySelector(".chat-scroll");
    promptsRef.current = document.querySelector("#prompt");

    const chatArea = chatAreaRef.current;
    const chatAreaScroller = chatAreaScrollerRef.current;
    const prompts = promptsRef.current;

    const chatAreaScrollHandler = () => {
      const maxScroll =
        (chatArea?.scrollHeight ?? 0) - (chatArea?.clientHeight ?? 0);

      if ((chatArea?.scrollTop ?? 0) < maxScroll - 3 * 16.33) {
        chatAreaScroller?.classList.add("active");
      } else {
        chatAreaScroller?.classList.remove("active");
      }
    };

    const scrollChatArea = () => {
      chatArea!.scrollTop =
        (chatArea?.scrollHeight ?? 0) - (chatArea?.clientHeight ?? 0);
    };

    prompts?.addEventListener("keydown", keydownHandler);
    chatArea?.addEventListener("scroll", chatAreaScrollHandler);
    chatAreaScroller?.addEventListener("click", scrollChatArea);

    return () => {
      prompts?.removeEventListener("keydown", keydownHandler);
      chatArea?.removeEventListener("scroll", chatAreaScrollHandler);
      chatAreaScroller?.removeEventListener("click", scrollChatArea);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <main>
        <div className="chat-area">
          {messages.length < 1 ? (
            <div className="chat-model-selection">
              {!modelLoaded ? (
                <p className="loading">Load Models</p>
              ) : (
                <>
                  <label htmlFor="models">Select AI Model</label>
                  <select
                    name="models"
                    id="models"
                    onChange={(el) => setSelectedModel(Number(el.target.value))}
                  >
                    {models.map((el, i) => (
                      <option key={i} value={i}>
                        {el.model_name ?? ""}
                      </option>
                    ))}
                  </select>
                </>
              )}
            </div>
          ) : null}

          <Chats
            waitDone={waitDone}
            messages={messages}
            avatar={avatar}
            selectedModel={models[selectedModel]}
            regenerate={regenerate}
          />
          {loadMessages ? (
            <LoadingConversation
              avatar={models[selectedModel].cover_img_url}
              name={models[selectedModel].model_name.split("/")[1]}
            />
          ) : null}

          <div className="chat-scroll">
            <ChevronDownIcon />
          </div>
        </div>
        <div className="chat-form">
          <label htmlFor="prompt"></label>
          <textarea
            name="prompt"
            id="prompt"
            placeholder="Your prompt..."
          ></textarea>
          {loadMessages ? (
            <button className="send-btn" aria-label="send" disabled>
              <SendIcon />
            </button>
          ) : (
            <button className="send-btn" aria-label="send" onClick={generate}>
              <SendIcon />
            </button>
          )}
        </div>
      </main>
    </>
  );
}
