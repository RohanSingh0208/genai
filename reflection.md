# Assignment 01 Reflection

## What Worked
The most successful part of this assignment was structuring the few-shot examples within the system prompt. Initially, without few-shot examples, the model (Gemini) would adopt a generic "helpful assistant" tone, merely sprinkling in references to "Scaler" or "Facebook" artificially. Once I embedded complete, multi-sentence examples matching the exact persona constraints (e.g., 4-5 sentences, ending with a question), the model’s tone immediately shifted to match the founders’ actual voices. 

I also successfully implemented **Streaming Responses**. By using `generateContentStream` and a `ReadableStream`, the UI now renders the bot's response token-by-token. This significantly improved the user experience by reducing perceived latency and making the interaction feel more like a real conversation.

## The GIGO Principle in Action
This assignment was a masterclass in "Garbage In, Garbage Out". Early prompt tests with instructions like "Act like Anshuman Singh, be smart" yielded terribly generic results. The model did not know *how* Anshuman thinks. Only when I provided specific background context (e.g., first principles, scaling Messenger, ignoring shiny frameworks) and explicit constraints (e.g., "Never give shortcuts") did the output become high-quality. 

I also noticed GIGO regarding the "Chain of Thought" instruction. Without explicitly telling the model to *internally reason* before responding, it would immediately generate a generic reply. Adding the CoT instruction forced the model to align its response with the persona's fundamental values before formulating the final sentence structure.

## What I Would Improve
If I had more time, I would implement **Retrieval-Augmented Generation (RAG)** by embedding transcripts of their actual YouTube masterclasses and LinkedIn posts. Relying purely on the system prompt means the model is limited to the context window and its pre-training data. A vector database would allow the chatbot to pull actual anecdotes and exact quotes, making the personas even more authentic. 
