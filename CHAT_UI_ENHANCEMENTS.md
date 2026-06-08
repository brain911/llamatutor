# Chat UI Enhancements - Implementation Guide

## Overview

The LlamaTutor chat interface has been significantly enhanced with rich message rendering capabilities, code highlighting, reasoning panels, source citations, follow-up suggestions, and message editing features. All enhancements preserve the existing layout and functionality while adding powerful new interactive capabilities.

## Features Implemented

### 1. **Markdown Message Rendering**
- **Location**: `components/RichMessage.tsx`
- **Implementation**: Uses `react-markdown` with custom component overrides
- **Features**:
  - Full Markdown support (bold, italic, lists, links, blockquotes)
  - Proper formatting for both user and assistant messages
  - Responsive text wrapping and styling

### 2. **Code Block Rendering with Syntax Highlighting**
- **Library**: `react-syntax-highlighter` (Prism-based)
- **Styling**: OneDark theme (dark background, readable colors)
- **Features**:
  - Language detection from fenced code blocks (```language)
  - Inline code styling (monospace, light background)
  - Copy button for code blocks
  - Full-width code display within message bubbles
  - Proper syntax highlighting for 100+ languages

**Example in Markdown**:
```python
# This will be syntax-highlighted
for i in range(10):
    print(i)
```

### 3. **Reasoning Panels**
- **Type**: Expandable/collapsible sections
- **Styling**: Amber border with light background
- **Features**:
  - Toggle button with visual indicator (▶/▼)
  - Shows "Reasoning" label
  - Content hidden by default, expandable on demand
  - Used for displaying model reasoning when available

**API Integration**: Pass `reasoning` prop to `RichMessage`:
```tsx
<RichMessage
  role="assistant"
  content={message.content}
  reasoning="The model's thinking process..."
/>
```

### 4. **Web Search Source Citations**
- **Type**: Expandable citations panel
- **Styling**: Blue border with light background
- **Features**:
  - Displays source count (e.g., "Sources (3)")
  - Expandable list of sources with names and URLs
  - Numbered citations [1], [2], etc.
  - Click to open source in new tab
  - Hidden by default, expandable on demand

**API Integration**: Pass `sources` array to `RichMessage`:
```tsx
<RichMessage
  role="assistant"
  content={message.content}
  sources={[
    { name: "Example Article", url: "https://example.com" },
    { name: "Another Source", url: "https://source.com" }
  ]}
/>
```

### 5. **Follow-up Suggestions**
- **Type**: Interactive button list
- **Styling**: Bordered buttons with hover states
- **Features**:
  - Displays suggested follow-up questions
  - Click to populate input field with suggestion
  - Event-driven system for seamless integration
  - Flexible number of suggestions

**API Integration**: Pass `followUpSuggestions` array to `RichMessage`:
```tsx
<RichMessage
  role="assistant"
  content={message.content}
  followUpSuggestions={[
    "Can you explain this further?",
    "What are some examples?",
    "How does this apply in practice?"
  ]}
/>
```

### 6. **Message Editing**
- **Type**: Inline editing with save/cancel
- **Features**:
  - Edit button on user messages
  - Textarea for editing with proper styling
  - Save and Cancel buttons
  - Updates message in conversation state
  - Maintains message history integrity

**How it works**:
1. User clicks "Edit" on their message
2. Message converts to editable textarea
3. User modifies text
4. Click "Save" to update or "Cancel" to discard

## File Structure

```
components/
├── Chat.tsx                 # Main chat component (UPDATED)
├── RichMessage.tsx         # NEW - Rich message renderer
├── FinalInputArea.tsx      # Input area (unchanged)
└── TypeAnimation.tsx       # Loading animation (unchanged)

app/
└── api/
    └── getChat/
        └── route.ts        # Streaming API (unchanged)

package.json               # UPDATED - new dependencies added
```

## Dependencies Added

```json
{
  "dependencies": {
    "react-syntax-highlighter": "^16.1.1",
    "rehype-raw": "^7.0.0"
  },
  "devDependencies": {
    "@types/react-syntax-highlighter": "^15.5.13"
  }
}
```

## Component API

### RichMessage Props

```typescript
interface RichMessageProps {
  role: "user" | "assistant";           // Message author
  content: string;                       // Message text (Markdown)
  reasoning?: string;                    // Reasoning text (optional)
  sources?: MessageSource[];             // Citation sources (optional)
  followUpSuggestions?: string[];        // Suggested follow-ups (optional)
  isEditing?: boolean;                   // Edit mode flag
  onEdit?: (newContent: string) => void; // Edit handler
  onCancelEdit?: () => void;             // Cancel edit handler
  onMessageUpdate?: (index: number, content: string) => void; // Save handler
  messageIndex?: number;                 // Position in message array
}

interface MessageSource {
  name: string;                          // Source title/name
  url: string;                           // Source URL
}
```

## Chat Component Updates

### State Management
- Added `editingIndex` state to track which message is being edited
- Handles message update callbacks

### Message Update Handler
```typescript
const handleMessageUpdate = (messageIndex: number, newContent: string) => {
  const updatedMessages = [...messages];
  updatedMessages[messageIndex] = {
    ...updatedMessages[messageIndex],
    content: newContent,
  };
  setMessages(updatedMessages);
  setEditingIndex(null);
};
```

### Follow-up Suggestion Handler
```typescript
const handleFollowUpSuggestion = (suggestion: string) => {
  setPromptValue(suggestion);
};
```

### Event Listener
Listens for `suggestion-selected` custom events from RichMessage components to populate the input with suggested text.

## Usage Examples

### Basic Assistant Message with Code
```tsx
<RichMessage
  role="assistant"
  content={`Here's how to create a loop in Python:

\`\`\`python
for i in range(5):
    print(f"Number: {i}")
\`\`\`

This will print numbers 0 through 4.`}
/>
```

### Full-Featured Message
```tsx
<RichMessage
  role="assistant"
  content="Python loops allow you to repeat code blocks..."
  reasoning="The user asked about Python loops at a Middle School level. I should provide clear, simple examples."
  sources={[
    { name: "Python Official Docs", url: "https://docs.python.org" },
    { name: "W3Schools Python", url: "https://w3schools.com/python" }
  ]}
  followUpSuggestions={[
    "What's the difference between for and while loops?",
    "Can you show me a more complex example?",
    "How do I break out of a loop?"
  ]}
/>
```

## API Integration

### Backend Response Format (Future Enhancement)

To fully utilize all features, the API response could include:

```json
{
  "content": "Main response text (Markdown formatted)",
  "reasoning": "Optional reasoning process",
  "sources": [
    { "name": "Source Name", "url": "https://source.url" }
  ],
  "followUpSuggestions": [
    "Suggested question 1",
    "Suggested question 2"
  ]
}
```

Currently, the API returns streaming text. The component structure is ready to accept these additional fields when the backend supports them.

## Styling

All components use Tailwind CSS with these color schemes:

- **Code blocks**: Dark background (`bg-gray-900`), gray header (`bg-gray-800`)
- **Reasoning panel**: Amber (`text-amber-900`, `bg-amber-50`)
- **Sources panel**: Blue (`text-blue-900`, `bg-blue-50`)
- **Follow-up buttons**: White with hover (`bg-blue-50`)
- **User messages**: Blue gradient (`bg-blue-500`)
- **Assistant messages**: White with logo

## Browser Support

- Modern browsers with ES6 support
- Tested on Chrome, Firefox, Safari, Edge
- Responsive design for mobile and desktop

## Performance Considerations

1. **Syntax Highlighting**: Uses Prism for fast, client-side highlighting
2. **Markdown Rendering**: Efficient with memoization potential
3. **Message Editing**: Minimal state changes
4. **Expandable Sections**: Hidden content doesn't render until expanded

## Future Enhancements

1. **Streaming Message Types**: Support reasoning, sources, suggestions in streamed responses
2. **Copy Message Button**: Copy entire message to clipboard
3. **Message Reactions**: Thumbs up/down for feedback
4. **Message Timestamps**: Show when each message was sent
5. **Search Within Chat**: Find text across all messages
6. **Message Drafts**: Save unsent messages
7. **Syntax Highlighter Themes**: Allow user theme selection

## Testing

The implementation has been tested for:
- Markdown rendering accuracy
- Code syntax highlighting
- Expandable panel functionality
- Message editing workflow
- Responsive layout on various screen sizes
- Integration with existing chat flow

## Troubleshooting

### Code blocks not highlighting
- Verify `react-syntax-highlighter` is installed
- Check that the code block has a language identifier (```python)

### Edit button not showing
- Ensure message `role` is "user"
- Check that `isEditing` state is being passed correctly

### Follow-up suggestions not working
- Verify the event listener is attached in Chat component
- Check that `followUpSuggestions` array is passed to RichMessage

## Maintenance

- Keep `react-syntax-highlighter` and `react-markdown` dependencies updated
- Monitor Prism theme compatibility
- Test new language support additions
