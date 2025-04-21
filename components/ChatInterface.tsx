import React, { useState, useRef, useEffect } from 'react' // Add useRef, useEffect
import Button from './Button' // Import Button component
import { getChatStream, buildApiHistory } from '../lib/gemini' // Import Gemini functions

interface Message {
  sender: 'user' | 'ai'
  text: string
}

/**
 * Placeholder component for the AI chat interface.
 */
function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Welcome! I'm here to help you build your pitch deck. What would you like to work on first?" }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  // const [error, setError] = useState<string | null>(null) // Removed unused error state
  const chatHistoryRef = useRef<HTMLDivElement>(null) // Ref for scrolling

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    chatHistoryRef.current?.scrollTo({ top: chatHistoryRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const trimmedMessage = currentMessage.trim()
    if (!trimmedMessage || isSending) return

    const newUserMessage: Message = { sender: 'user', text: trimmedMessage }
    const currentHistory = [...messages, newUserMessage]
    setMessages(currentHistory)
    setCurrentMessage('')
    setIsSending(true)
    // setError(null) // Clear previous errors - state removed

    try {
      // Prepare the full history for the API, including the latest user message
      const apiContents = buildApiHistory(currentHistory)

      // Get the stream, passing the full contents array
      const stream = await getChatStream(apiContents)

      // Process the stream
      for await (const chunk of stream) {
        let chunkText = ''; // Initialize chunkText for this iteration

        try {
          // More robust check: ensure text() exists AND returns a string
          if (chunk && typeof chunk.text === 'function') {
            const textResult = chunk.text(); // Call text() within try block
            if (typeof textResult === 'string') {
              chunkText = textResult; // Assign only if it's a string
            } else {
               console.warn("chunk.text() did not return a string:", textResult);
            }
          } else {
            console.warn("Received chunk without a valid text() method:", chunk);
          }
        } catch (e) {
           console.error("Error calling chunk.text():", e, "Chunk:", chunk);
           // Skip this chunk if text() throws an error
           continue;
        }

        // Only proceed to update state if we successfully extracted text
        if (chunkText) {
          // Add or update the AI message in the state using functional updates
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1]
            // Check if the last message exists and is from the AI
            if (lastMessage && lastMessage.sender === 'ai') {
              // Append to the last AI message
              const updatedMessages = [...prev]
              updatedMessages[prev.length - 1] = {
                ...lastMessage,
                text: lastMessage.text + chunkText,
              }
              return updatedMessages
            } else {
              // Add a new AI message if the last one wasn't AI or doesn't exist
              return [...prev, { sender: 'ai', text: chunkText }]
            }
          })
        }
        // If chunkText was empty or text() failed, the loop continues to the next chunk
      }

      // Check if the last message added was empty or just the placeholder after stream ends
      setMessages(prev => {
         const lastMessage = prev[prev.length - 1]
         if (lastMessage && lastMessage.sender === 'ai' && lastMessage.text.trim() === '') {
            // Optionally update placeholder or remove if needed, or add a specific message
            const updatedMessages = [...prev]
            updatedMessages[prev.length - 1] = { ...lastMessage, text: "(No response generated)" }
            return updatedMessages
         }
         // If the last message is fine or not from AI, return previous state
         return prev
      })


    } catch (err) {
      console.error("Error calling Gemini API:", err)
      const message = (err instanceof Error) ? err.message : "An error occurred while contacting the AI."
      // setError(message) // State removed
      // Add error message directly to chat
      setMessages(prev => [...prev, { sender: 'ai', text: `Error: ${message}` }])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="p-4 h-full flex flex-col bg-[color:var(--c-bg)]">
      <h2 className="text-xl font-semibold border-b-[1px] border-b-[color:white] pb-2 mb-3 flex-shrink-0 text-[color:var(--c-fg)]">
        AI Assistant
      </h2>
      {/* Chat History */}
      <div ref={chatHistoryRef} className="flex-grow overflow-y-auto mb-3 space-y-3 pr-2"> {/* Attach ref */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`p-2 rounded max-w-[75%] text-sm text-left border-[1px] border-[color:var(--c-stroke)] bg-[color:var(--c-bg)] text-[color:var(--c-fg)] ${msg.sender === 'user' ? 'ml-auto' : 'mr-auto'}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isSending && (
           <div className="flex justify-start">
             <p className="italic text-gray-500 text-sm">AI is thinking...</p>
           </div>
        )}
      </div>
      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="mt-auto flex gap-2 flex-shrink-0"> {/* Push input to bottom */}
        <input
          type="text"
          placeholder="Type your message here..."
          className="flex-grow p-2 bg-[color:var(--c-bg)] text-[color:var(--c-fg)] border-[1px] border-[color:var(--c-stroke)] rounded"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={isSending}
        />
        <Button
          type="submit"
          buttonText="Send"
          color="violet"
          disabled={isSending || !currentMessage.trim()}
          className="flex-shrink-0" // Prevent button from shrinking
        />
      </form>
    </div>
  )
}

export default ChatInterface
