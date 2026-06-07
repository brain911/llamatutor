"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Sources from "@/components/Sources";
import { useState } from "react";
import { getSystemPrompt } from "@/utils/utils";
import Chat from "@/components/Chat";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [topic, setTopic] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [sources, setSources] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [ageGroup, setAgeGroup] = useState("Middle School");

  const handleInitialChat = async () => {
    setShowResult(true);
    setLoading(true);
    setTopic(inputValue);
    setInputValue("");

    await handleSourcesAndChat(inputValue);

    setLoading(false);
  };

  const handleChat = async (messagesToSend?: { role: string; content: string }[]) => {
    setLoading(true);
    const chatRes = await fetch("/api/getChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: messagesToSend || messages }),
    });

    if (!chatRes.ok) {
      throw new Error(chatRes.statusText);
    }

    // This data is a ReadableStream
    const data = chatRes.body;
    if (!data) {
      setLoading(false);
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let fullAnswer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "text-delta") {
                fullAnswer += data.text;
                // Update messages with each chunk
                setMessages((prev) => {
                  const lastMessage = prev[prev.length - 1];
                  if (lastMessage?.role === "assistant") {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMessage, content: fullAnswer },
                    ];
                  } else {
                    return [...prev, { role: "assistant", content: fullAnswer }];
                  }
                });
              }
            } catch (e) {
              // Skip parse errors
            }
          }
        }
      }
    } catch (e) {
      console.error("Stream error:", e);
    }

    setLoading(false);
  };

  async function handleSourcesAndChat(question: string) {
    setIsLoadingSources(true);
    let sourcesResponse = await fetch("/api/getSources", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
    let sources;
    if (sourcesResponse.ok) {
      sources = await sourcesResponse.json();
      setSources(sources);
    } else {
      setSources([]);
    }
    setIsLoadingSources(false);

    const initialMessage = [
      { role: "system", content: getSystemPrompt(sources, ageGroup) },
      { role: "user", content: `${question}` },
    ];
    setMessages(initialMessage);
    await handleChat(initialMessage);
  }

  return (
    <>
      <Header />

      <main
        className={`flex grow flex-col px-4 pb-4 ${showResult ? "overflow-hidden" : ""}`}
      >
        {showResult ? (
          <div className="mt-2 flex w-full grow flex-col justify-between overflow-hidden">
            <div className="flex w-full grow flex-col space-y-2 overflow-hidden">
              <div className="mx-auto flex w-full max-w-7xl grow flex-col gap-4 overflow-hidden lg:flex-row lg:gap-10">
                <Chat
                  messages={messages}
                  disabled={loading}
                  loading={loading}
                  promptValue={inputValue}
                  setPromptValue={setInputValue}
                  setMessages={setMessages}
                  handleChat={handleChat}
                  topic={topic}
                />
                <Sources sources={sources} isLoading={isLoadingSources} />
              </div>
            </div>
          </div>
        ) : (
          <Hero
            promptValue={inputValue}
            setPromptValue={setInputValue}
            handleChat={handleChat}
            ageGroup={ageGroup}
            setAgeGroup={setAgeGroup}
            handleInitialChat={handleInitialChat}
          />
        )}
      </main>
      {/* <Footer /> */}
    </>
  );
}
