const API_KEY = "{{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}}" // Replace this with your actual API key.
const API_URL = "https://api.openai.com/v1/chat/completions"; // Using OpenAI ChatGPT API as an example.

// Function to send message.
async function sendMessage() {
  const userInput = document.getElementById("userInput").value;
  if (!userInput) return; // Do nothing if no input.

  // Display user's message in the chat interface.
  addMessageToChat(userInput, "user");

  // Clear input field for the next message.
  document.getElementById("userInput").value = "";

  try {
    // Call the ChatGPT API with the user's message.
    const botResponse = await getBotResponse(userInput);
    addMessageToChat(botResponse, "bot");
  } catch (error) {
    console.error("Error getting bot response:", error);
    addMessageToChat("Sorry, there was an error communicating with the server.", "bot");
  }
}

// Function to fetch bot's response from API.
async function getBotResponse(message) {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`
  };

  const body = {
    model: "gpt-3.5-turbo", // Specify model ID.
    messages: [{ role: "user", content: message }]
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Function to add a message to the chat interface.
function addMessageToChat(message, sender) {
  const messagesDiv = document.getElementById("messages");
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);

  // Scroll to the bottom of the messages.
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
