import FinalInputArea from "./FinalInputArea";
import RichMessage from "./RichMessage";
import { useEffect, useRef, useState } from "react";

export default function Chat({
  messages,
  disabled,
  loading,
  promptValue,
  setPromptValue,
  setMessages,
  handleChat,
  topic,
}: {
  messages: { role: string; content: string }[];
  disabled: boolean;
  loading: boolean;
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  setMessages: React.Dispatch<
    React.SetStateAction<{ role: string; content: string }[]>
  >;
  handleChat: (messages?: { role: string; content: string }[]) => void;
  topic: string;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableContainerRef = useRef<HTMLDivElement>(null);
  const [didScrollToBottom, setDidScrollToBottom] = useState(true);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const handleMessageUpdate = (messageIndex: number, newContent: string) => {
    const updatedMessages = [...messages];
    updatedMessages[messageIndex] = {
      ...updatedMessages[messageIndex],
      content: newContent,
    };
    setMessages(updatedMessages);
    setEditingIndex(null);
  };

  const handleFollowUpSuggestion = (suggestion: string) => {
    setPromptValue(suggestion);
  };

  useEffect(() => {
    if (loading || didScrollToBottom) {
      scrollToBottom();
    }
  }, [didScrollToBottom, messages, loading]);

  useEffect(() => {
    const handleSuggestion = (event: Event) => {
      const customEvent = event as CustomEvent;
      handleFollowUpSuggestion(customEvent.detail);
    };

    window.addEventListener("suggestion-selected", handleSuggestion);
    return () => {
      window.removeEventListener("suggestion-selected", handleSuggestion);
    };
  }, []);

  useEffect(() => {
    let el = scrollableContainerRef.current;
    if (!el) {
      return;
    }

    function handleScroll() {
      if (scrollableContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          scrollableContainerRef.current;
        setDidScrollToBottom(scrollTop + clientHeight >= scrollHeight);
      }
    }

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex grow flex-col gap-4 overflow-hidden">
      <div className="flex grow flex-col overflow-hidden lg:p-4">
        <p className="uppercase text-gray-900">
          <b>Topic: </b>
          {topic}
        </p>
        <div
          ref={scrollableContainerRef}
          className="mt-2 overflow-y-scroll rounded-lg border border-solid border-[#C2C2C2] bg-white px-5 lg:p-7"
        >
          {messages.length > 2 ? (
            <div className="space-y-4">
              {messages.slice(2).map((message, displayIndex) => {
                const actualIndex = displayIndex + 2;
                return (
                  <RichMessage
                    key={actualIndex}
                    role={message.role as "user" | "assistant"}
                    content={message.content}
                    isEditing={editingIndex === actualIndex}
                    onEdit={() => setEditingIndex(actualIndex)}
                    onCancelEdit={() => setEditingIndex(null)}
                    onMessageUpdate={handleMessageUpdate}
                    messageIndex={actualIndex}
                  />
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="flex w-full flex-col gap-4 py-5">
              {Array.from(Array(10).keys()).map((i) => (
                <div
                  key={i}
                  className={`${i < 5 && "hidden sm:block"} h-10 animate-pulse rounded-md bg-gray-300`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white lg:p-4">
        <FinalInputArea
          disabled={disabled}
          promptValue={promptValue}
          setPromptValue={setPromptValue}
          handleChat={handleChat}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
    </div>
  );
}
