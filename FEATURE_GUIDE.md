# LlamaTutor Chat UI - Feature Guide

## Quick Start

The enhanced chat interface provides several new capabilities to improve your learning experience. Here's how to use each feature:

## 1. Code Block Viewing

When the tutor shares code examples, they'll be displayed in highlighted code blocks:

- **Syntax Highlighting**: Code is automatically highlighted based on the programming language
- **Copy Button**: Click "Copy" in the top-right of any code block to copy it to your clipboard
- **Language Detection**: The code language is displayed (e.g., "python", "javascript")

```python
# Example: This code block will be highlighted
def greet(name):
    return f"Hello, {name}!"
```

## 2. Reasoning Panels

Some AI responses may include reasoning sections that show the thought process:

- **Hidden by Default**: Reasoning sections start collapsed (▶)
- **Expandable**: Click the "Reasoning" button to expand and see the full thought process
- **Easy Reading**: Collapse it again by clicking the expanded button (▼)

This is useful for understanding *how* the AI arrived at its answer.

## 3. Source Citations

When the tutor references external sources:

- **Sources List**: A blue "Sources (n)" section shows up
- **Expandable**: Click to expand and see all referenced sources
- **Clickable Links**: Click any source to open it in a new tab
- **Numbered Format**: Sources are numbered [1], [2], etc.

## 4. Follow-up Suggestions

After an answer, you might see suggested follow-up questions:

- **Quick Options**: Click any suggestion to populate your message box with that question
- **Alternative Paths**: Suggestions help guide your learning
- **One-Click Use**: Just click the button - the suggestion automatically fills the input

## 5. Message Editing

You can edit your previous questions to refine your learning:

### How to Edit:
1. Find your message (blue bubble with your text)
2. Click the small "Edit" link below your message
3. The message becomes editable in a text area
4. **Save**: Click "Save" to update the message and regenerate the response
5. **Cancel**: Click "Cancel" to discard changes

### When to Edit:
- Clarify your original question
- Add more context
- Fix a typo that changed the meaning
- Ask a slightly different version of your question

## 6. Rich Markdown Formatting

All responses use Markdown formatting for better readability:

- **Bold**: Use **bold text** for emphasis
- **Italic**: Use *italic text* for emphasis
- **Lists**: Bullet points and numbered lists are formatted nicely
- **Links**: Click links to open them in new tabs
- **Blockquotes**: Quoted text appears indented

## Visual Guide

### User Message
```
┌─────────────────────────────────────┐
│  Your question in a blue bubble      │
│  with an Edit link below             │
└─────────────────────────────────────┘
```

### Assistant Response
```
┌─ 🤖 ─────────────────────────────────┐
│                                       │
│  Response with Markdown formatting   │
│                                       │
│  ▶ Reasoning (expandable)            │
│  ▶ Sources (n) (expandable)          │
│  ▶ Follow-up suggestions (buttons)   │
└───────────────────────────────────────┘
```

## Tips for Best Learning

1. **Use Code Examples**: When code is shown, study it carefully and try running it yourself
2. **Read Reasoning**: Expand reasoning sections to understand the problem-solving approach
3. **Check Sources**: For deeper learning, review the cited sources
4. **Follow Suggestions**: Use suggested questions to explore related concepts
5. **Edit & Refine**: If answers aren't quite right, edit your question for clarity

## Keyboard Shortcuts

- **Shift + Enter**: New line in message input
- **Enter**: Send your message
- **Escape**: (When editing) Cancel edit changes

## Troubleshooting

### Code block not showing properly?
- Ensure the code block uses the correct fence format: ``` language
- The language name should be lowercase

### Can't find the Edit button?
- The Edit link only appears below your messages (blue bubbles)
- It doesn't appear for AI responses

### Follow-up buttons not working?
- Make sure JavaScript is enabled in your browser
- Try refreshing the page

## Accessibility

All features are keyboard accessible:
- Tab through buttons and interactive elements
- Space or Enter to click buttons
- Shift+Tab to go backwards
- Expandable sections announce when expanded/collapsed

## Performance

The enhanced UI is optimized for:
- Quick rendering of code syntax highlighting
- Smooth scrolling with many messages
- Efficient message updates when editing
- Responsive design on mobile and desktop

## Browser Compatibility

Works best on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Older browsers may have limited styling but all features should still work.

## Feedback

The enhanced chat UI is designed to improve your learning experience. If you have suggestions for improvements or encounter issues, the feedback is invaluable for making it better!
