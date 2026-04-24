chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  latestQuestion.textContent = message;
  addMessage("user", message);

  userInput.value = "";
  userInput.disabled = true;
  sendBtn.disabled = true;

  addTypingMessage();

  try {
    const response = await fetch(WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userMessage: message,
        conversationHistory: conversationHistory
      }),
    });

    const data = await response.json();

    removeTypingMessage();

    if (!response.ok) {
      addMessage("assistant", `Error: ${data.error}`);
      return;
    }

    const reply = data.reply;

    addMessage("assistant", reply);

    // store history correctly
    conversationHistory.push(
      { role: "user", content: message },
      { role: "assistant", content: reply }
    );

  } catch (error) {
    removeTypingMessage();
    addMessage("assistant", `Connection error: ${error.message}`);
  } finally {
    userInput.disabled = false;
    sendBtn.disabled = false;
    userInput.focus();
  }
});