import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Image from "next/image";
import simpleLogo from "../public/simple-logo.png";
import { Copy, Download, CheckCircle2 } from "lucide-react";
import GenerativeUI, { type GenerativeUIElement } from "./GenerativeUI";

// Map language codes to file extensions
const languageToExtension: Record<string, string> = {
  javascript: "js",
  typescript: "ts",
  python: "py",
  java: "java",
  cpp: "cpp",
  csharp: "cs",
  php: "php",
  ruby: "rb",
  go: "go",
  rust: "rs",
  swift: "swift",
  kotlin: "kt",
  html: "html",
  css: "css",
  scss: "scss",
  less: "less",
  sql: "sql",
  json: "json",
  xml: "xml",
  yaml: "yaml",
  bash: "sh",
  shell: "sh",
  zsh: "zsh",
  fish: "fish",
  powershell: "ps1",
  markdown: "md",
  text: "txt",
  plain: "txt",
};

interface MessageSource {
  name: string;
  url: string;
}

interface RichMessageProps {
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  sources?: MessageSource[];
  followUpSuggestions?: string[];
  generativeUIElements?: GenerativeUIElement[];
  isEditing?: boolean;
  onEdit?: (newContent: string) => void;
  onCancelEdit?: () => void;
  onMessageUpdate?: (messageIndex: number, newContent: string) => void;
  messageIndex?: number;
}

const RichMessage: React.FC<RichMessageProps> = ({
  role,
  content,
  reasoning,
  sources,
  followUpSuggestions,
  generativeUIElements,
  isEditing = false,
  onEdit,
  onCancelEdit,
  onMessageUpdate,
  messageIndex,
}) => {
  const [showReasoning, setShowReasoning] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const [isCitationExpanded, setIsCitationExpanded] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleSaveEdit = () => {
    if (onMessageUpdate && messageIndex !== undefined) {
      onMessageUpdate(messageIndex, editContent);
    }
    onEdit?.(editContent);
  };

  const handleEdit = () => {
    onEdit?.(content);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadCode = (code: string, language: string) => {
    const extension =
      languageToExtension[language.toLowerCase()] || "txt";
    const filename = `code_${Date.now()}.${extension}`;
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(code)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (role === "user") {
    return (
      <div className="ml-auto w-fit max-w-md rounded-xl bg-blue-500 p-4 text-white">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              className="block w-full rounded border border-blue-300 bg-blue-400 px-3 py-2 text-white placeholder-blue-100"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="rounded bg-white px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Save
              </button>
              <button
                onClick={onCancelEdit}
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-2 font-medium">{content}</p>
            <button
              onClick={handleEdit}
              className="text-xs text-blue-100 hover:text-white"
            >
              Edit
            </button>
          </>
        )}
      </div>
    );
  }

  // Assistant message with rich formatting
  return (
    <div className="relative w-full space-y-3">
      <div className="flex gap-3">
        <Image
          src={simpleLogo}
          alt="Assistant"
          className="mt-1 shrink-0"
          width={28}
          height={28}
        />
        <div className="flex-1 space-y-2">
          {/* Generative UI Elements */}
          {generativeUIElements && generativeUIElements.length > 0 && (
            <div className="my-4 space-y-3 rounded-lg border border-blue-100 bg-blue-50 p-4">
              <GenerativeUI
                elements={generativeUIElements}
                onAction={(action, payload) => {
                  console.log("[v0] GenerativeUI action:", action, payload);
                }}
              />
            </div>
          )}

          {/* Main message content */}
          <div className="prose-sm max-w-5xl lg:prose lg:max-w-full">
            <ReactMarkdown
              components={{
                code(props) {
                  const { children, className, ...rest } = props;
                  const match = /language-(\w+)/.exec(className || "");
                  const isInline = !match;
                  const codeString = String(children).replace(/\n$/, "");
                  const codeBlockIndex = Math.random(); // Simple unique index

                  if (isInline) {
                    return (
                      <code
                        className="rounded bg-gray-100 px-2 py-1 font-mono text-sm text-gray-800"
                        {...rest}
                      >
                        {children}
                      </code>
                    );
                  }

                  return (
                    <div className="not-prose my-4 overflow-hidden rounded-lg border border-gray-700 bg-gray-900">
                      <div className="flex items-center justify-between bg-gray-800 px-4 py-3">
                        <span className="text-xs font-medium text-gray-300">
                          {match?.[1] || "code"}
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleCopyCode(
                                codeString,
                                Number(codeBlockIndex)
                              )
                            }
                            className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            title="Copy code to clipboard"
                          >
                            {copiedIndex === Number(codeBlockIndex) ? (
                              <>
                                <CheckCircle2 size={14} />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy size={14} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadCode(
                                codeString,
                                match?.[1] || "text"
                              )
                            }
                            className="inline-flex items-center gap-1 rounded bg-gray-700 px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-600 hover:text-white"
                            title="Download code file"
                          >
                            <Download size={14} />
                            <span>Download</span>
                          </button>
                        </div>
                      </div>
                      <SyntaxHighlighter
                        language={match?.[1] || "text"}
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          padding: "1rem",
                          fontSize: "0.875rem",
                          lineHeight: "1.5",
                        }}
                        wrapLines={true}
                        wrapLongLines={true}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
                a: (props) => (
                  <a
                    {...props}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                ),
              }}
            >
              {content}
            </ReactMarkdown>
          </div>

          {/* Reasoning panel */}
          {reasoning && (
            <div className="border-l-4 border-amber-200 bg-amber-50 p-3 text-sm">
              <button
                onClick={() => setShowReasoning(!showReasoning)}
                className="flex items-center gap-2 font-medium text-amber-900 hover:text-amber-700"
              >
                <span className="text-lg">
                  {showReasoning ? "▼" : "▶"}
                </span>
                Reasoning
              </button>
              {showReasoning && (
                <p className="mt-2 text-amber-800">{reasoning}</p>
              )}
            </div>
          )}

          {/* Source citations */}
          {sources && sources.length > 0 && (
            <div className="border-l-4 border-blue-200 bg-blue-50 p-3 text-sm">
              <button
                onClick={() => setIsCitationExpanded(!isCitationExpanded)}
                className="flex items-center gap-2 font-medium text-blue-900 hover:text-blue-700"
              >
                <span className="text-lg">
                  {isCitationExpanded ? "▼" : "▶"}
                </span>
                Sources ({sources.length})
              </button>
              {isCitationExpanded && (
                <ul className="mt-2 space-y-2">
                  {sources.map((source, idx) => (
                    <li key={idx} className="text-blue-800">
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="break-words hover:underline"
                      >
                        [{idx + 1}] {source.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Follow-up suggestions */}
          {followUpSuggestions && followUpSuggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Follow-up suggestions:
              </p>
              <div className="flex flex-col gap-2">
                {followUpSuggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      // This will be handled by parent component
                      const event = new CustomEvent("suggestion-selected", {
                        detail: suggestion,
                      });
                      window.dispatchEvent(event);
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RichMessage;
