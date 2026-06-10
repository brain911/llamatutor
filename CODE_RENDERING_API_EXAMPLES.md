# Code Rendering & Generative UI API Integration Examples

## Environment Variables Setup

### Vercel AI Gateway

The app uses the Vercel AI Gateway by default. No additional packages needed beyond `ai` and `@ai-sdk/react`.

```bash
# Environment variables automatically provided
AI_GATEWAY_API_KEY=<your-gateway-key>
```

### LLM Providers

#### Together AI (Current Provider)
```bash
# Set in Vercel project settings or .env.development.local
TOGETHER_API_KEY=<your-key>  # If not using gateway
```

#### OpenAI (Alternative)
```bash
OPENAI_API_KEY=<your-key>
```

#### Anthropic (Alternative)
```bash
ANTHROPIC_API_KEY=<your-key>
```

## API Route Updates

### Current Implementation: `/api/getChat`

The existing route handles streaming responses. To support Generative UI, update the message format:

```typescript
// app/api/getChat/route.ts
import { streamText } from "ai";

export async function POST(request: NextRequest) {
  const { messages } = await request.json();

  const result = await streamText({
    model: "together/model-name",
    messages,
    system: `You can include structured UI components in your responses.
When appropriate, include Generative UI elements to make responses more interactive.`
  });

  return result.toTextStreamResponse();
}
```

## Response Formats

### Format 1: Markdown with Code Blocks (Current)

```json
{
  "role": "assistant",
  "content": "Here's a Python example:\n\n```python\ndef hello():\n    print('Hello')\n```"
}
```

**Rendering**: Shows as markdown text with syntax-highlighted code block and Copy/Download buttons.

### Format 2: Markdown with Embedded UI JSON

For responses with both markdown and UI components:

```json
{
  "role": "assistant",
  "content": "Here's how to use this function:\n\n```python\nresult = calculate(5)\nprint(result)\n```",
  "generativeUIElements": [
    {
      "type": "alert",
      "props": {
        "severity": "info",
        "title": "Tip"
      },
      "children": "This function returns the sum of all numbers up to n"
    }
  ]
}
```

**Rendering**: Shows markdown content, then renders UI elements below.

### Format 3: Pure Generative UI

For interactive-focused responses:

```json
{
  "role": "assistant",
  "content": "",
  "generativeUIElements": [
    {
      "type": "card",
      "props": {
        "title": "Interactive Example",
        "variant": "info"
      },
      "children": "Select an option below"
    },
    {
      "type": "button",
      "props": {
        "label": "Option 1",
        "variant": "primary",
        "action": "select_option_1"
      }
    },
    {
      "type": "button",
      "props": {
        "label": "Option 2",
        "variant": "secondary",
        "action": "select_option_2"
      }
    }
  ]
}
```

**Rendering**: Shows only UI components without markdown text.

## Streaming Response Examples

### Streaming Code Block

The response streams in real-time and code highlighting updates as content arrives:

```
User: Show me a Python loop
Assistant: (streaming...)
Here's a simple loop:

```python
for i in range(10):
    print(i)
```
(streaming continues...)
```

### Streaming with UI Elements

UI elements render as soon as they're complete:

```
{
  "role": "assistant",
  "content": "Processing...",
  "generativeUIElements": [
    {
      "type": "alert",
      "props": { "severity": "info" },
      "children": "Loading data..."
    }
  ]
}
```

## Component Streaming Performance

### Smooth Updates

The `RichMessage` component updates smoothly as the message content streams:

1. Content arrives in chunks
2. Markdown re-parses with each chunk
3. Code blocks re-highlight incrementally
4. UI elements appear when complete

```typescript
// Example streaming handler in Chat.tsx
while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  const chunk = decoder.decode(value);
  
  // Update message content progressively
  setMessages((prev) => {
    const lastMessage = prev[prev.length - 1];
    if (lastMessage?.role === "assistant") {
      return [
        ...prev.slice(0, -1),
        { ...lastMessage, content: fullText }  // Re-renders RichMessage
      ];
    }
  });
}
```

## Custom UI Integration

### Creating Custom Generative UI Elements

#### Define Element Type
```typescript
interface CustomElement extends GenerativeUIElement {
  type: "custom";
  props: {
    customProp: string;
  };
}
```

#### Add to GenerativeUI Component
```typescript
// In GenerativeUI.tsx
case "custom":
  return <CustomComponentRenderer key={index} props={element.props} />;
```

#### Use in Response
```json
{
  "type": "custom",
  "props": { "customProp": "value" }
}
```

## Real-World Examples

### Example 1: Tutorial Response with Code

```json
{
  "role": "assistant",
  "content": "# Learning Python Lists\n\nHere's how to create and use lists:\n\n```python\n# Create a list\nnumbers = [1, 2, 3, 4, 5]\n\n# Add an element\nnumbers.append(6)\n\n# Print the list\nprint(numbers)\n```\n\nLists are one of the most useful data structures in Python.",
  "generativeUIElements": [
    {
      "type": "card",
      "props": {
        "title": "Quick Summary",
        "variant": "success"
      },
      "children": "Lists use square brackets []. You can add items with .append()."
    }
  ]
}
```

### Example 2: Step-by-Step Guide

```json
{
  "role": "assistant",
  "content": "Here are the steps to implement a function:",
  "generativeUIElements": [
    {
      "type": "list",
      "props": {
        "items": [
          "Define the function with def keyword",
          "Add parameters in parentheses",
          "Write the function body with proper indentation",
          "Return the result with return keyword",
          "Call the function to use it"
        ],
        "ordered": true
      }
    },
    {
      "type": "code",
      "props": { "language": "python" },
      "children": "def add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)"
    }
  ]
}
```

### Example 3: Comparison Table

```json
{
  "role": "assistant",
  "content": "Here's a comparison of different approaches:",
  "generativeUIElements": [
    {
      "type": "table",
      "props": {
        "headers": ["Approach", "Pros", "Cons", "Best For"],
        "rows": [
          ["Loop", "Simple", "Slow", "Small lists"],
          ["Comprehension", "Fast", "Less readable", "Performance"],
          ["Map", "Functional", "Memory", "Large data"],
          ["NumPy", "Very fast", "External dep", "Big data"]
        ]
      }
    }
  ]
}
```

### Example 4: Interactive Selection

```json
{
  "role": "assistant",
  "content": "Which concept would you like to explore?",
  "generativeUIElements": [
    {
      "type": "button",
      "props": {
        "label": "Variables",
        "variant": "primary",
        "action": "learn_variables"
      }
    },
    {
      "type": "button",
      "props": {
        "label": "Functions",
        "variant": "secondary",
        "action": "learn_functions"
      }
    },
    {
      "type": "button",
      "props": {
        "label": "Classes",
        "variant": "secondary",
        "action": "learn_classes"
      }
    }
  ]
}
```

### Example 5: Error Handling Guide

```json
{
  "role": "assistant",
  "content": "Here's how to handle exceptions properly:\n\n```python\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero')\nfinally:\n    print('Always runs')\n```",
  "generativeUIElements": [
    {
      "type": "alert",
      "props": {
        "severity": "warning",
        "title": "Common Mistakes"
      },
      "children": "Always use specific exception types. Never catch generic Exception."
    }
  ]
}
```

## Testing Locally

### Test 1: Code Block Copy/Download

```bash
# Start dev server
pnpm dev

# Navigate to http://localhost:3000
# Enter: "Show me a Python function"
# Verify:
#  - Code is syntax highlighted
#  - Copy button works
#  - Download creates .py file
```

### Test 2: Multiple Languages

```bash
# Test with prompts:
# "Show me JavaScript"
# "Show me HTML/CSS"
# "Show me SQL"
# Verify: Extensions match language
```

### Test 3: Streaming Update

```bash
# Verify as response streams:
#  - Code highlights update
#  - No jarring re-renders
#  - Buttons appear when complete
```

## Debugging

### Check Streaming Format
```typescript
// In browser console
console.log("Message content:", message.content);
console.log("UI elements:", message.generativeUIElements);
```

### Monitor Clipboard Operations
```javascript
navigator.clipboard.writeText("test")
  .then(() => console.log("Copy success"))
  .catch(err => console.error("Copy failed:", err));
```

### Test Download
```javascript
// Manually trigger download in console
const code = "print('test')";
const element = document.createElement("a");
element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(code));
element.setAttribute("download", "test.py");
element.click();
```

## Performance Tips

1. **Limit Code Block Size**: Very large blocks (>500 lines) may slow rendering
2. **Use Markdown for Text**: Pure markdown renders faster than UI components
3. **Minimal UI Elements**: Each UI element has render cost
4. **Batch Updates**: Stream in reasonable chunks (not single character)

## Future Enhancements

- [ ] Shiki.js integration for better highlighting
- [ ] Custom language definitions
- [ ] Code annotation/comments
- [ ] Diff highlighting
- [ ] Line numbers
- [ ] Theme selection
- [ ] Code folding
