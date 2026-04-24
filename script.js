const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");
const latestQuestion = document.getElementById("latestQuestion");

const WORKER_URL = "https://loreal-chatbot.ppurohi5.workers.dev";

const conversationHistory = [
  {
    role: "system",
    content: `
You are L'Oréal's Smart Beauty Advisor.

Only answer beauty-related questions.
Refuse unrelated questions politely.
Be concise, elegant, and helpful.
`,
  },
];

function addMessage(role, text) {
  const row = document.createElement("div");
  row.className = `message-row ${role}`;

  const bubble = document.createElement("div");
  bubble.className = `message-bubble ${role === "user" ? "user-bubble" : "ai-bubble"}`;
  bubble.textContent = text;

  row.appendChild(bubble);
  chatWindow.appendChild(row);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  latestQuestion.textContent = message;
  addMessage("user", message);

  conversationHistory.push({ role: "user", content: message });

  userInput.value = "";

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: conversationHistory, // ✅ FIXED PAYLOAD
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      addMessage("ai", "Error: " + data.error);
      return;
    }

    const reply = data.reply || "No response";

    addMessage("ai", reply);

    conversationHistory.push({
      role: "assistant",
      content: reply,
    });
  } catch (err) {
    addMessage("ai", "Connection error");
    console.error(err);
  }
});
