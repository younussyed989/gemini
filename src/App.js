import { useState, useEffect, useRef } from "react";

const App = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedActivity, setSuggestedActivity] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [chatHistory]);

  const getResponse = async () => {
    let messageToSend = value; // Default message to the input value

    // If value is empty and there's a suggestion, use the suggestion as the message
    if (!value && suggestedActivity) {
      messageToSend = suggestedActivity;
      setSuggestedActivity(null); // Reset suggested activity
    }

    // If there's still no message to send, show error
    if (!messageToSend) {
      setError("Error! Please ask a question or click 'Suggest Fun Activities' button.");
      return;
    }

    setIsLoading(true);
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory.map,
          message: messageToSend
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();
      console.log(data);

      setChatHistory(oldChatHistory => [...oldChatHistory,
        {
          role: "You",
          parts: messageToSend,
        },
        {
          role: "Gemini",
          parts: data,
        },
      ]);
      setValue("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const clear = () => {
    setValue("");
    setError("");
    setChatHistory([]);
    inputRef.current.focus();
  };

  const suggestActivity = () => {
    const suggestions = [
      "How to play soccer?",
      "What to play in a park?",
      "Give me a new recipe",
      "Recommend a book",
      "Recommend a movie",
      "How to do  gardening?",
      "Recommend some music",
      "how to Paint or Draw?",
      "Recommend a board game",
      "Recommend a new hobby",
    ];
    const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
    setSuggestedActivity(randomSuggestion);
    setValue(randomSuggestion); // Populate the input field with the suggested activity
  };

  const brainstormNames = () => {
    const names = [
      "Brainstorm Names for a Bakery",
      "Brainstorm Names for a Travel Agency",
      "Brainstorm Names for a Fashion Brand",
      "Brainstorm Names for a pet grooming service",
      "Brainstorm Names for a podcast network dedicated to exploring conspiracy theories.",
      "Brainstorm Names for a restaurant chain featuring fusion cuisine",
      "Brainstorm Names for a Tech Company",
      "Brainstorm Names for a tutoring service offering virtual reality-enhanced",
      "Brainstorm Names for a gardening center specializing in sustainable urban gardening",
      "Brainstorm Names for a nonprofit organization promoting STEM education",
    ];
    const randomName = names[Math.floor(Math.random() * names.length)];
    setValue(randomName);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      getResponse();
    }
  };

  return (
    <div className="app">
      <p>What do you want to know?</p>
      <div className="input-container">
        <input
          ref={inputRef}
          value={value}
          placeholder="Message Chatbot..."
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        {!isLoading && !error && <button onClick={getResponse}>↑</button>}
        {!isLoading && error && <button onClick={clear}>Clear</button>}
        {isLoading && <div className="loader"></div>}
      </div>
      {error && <p>{error}</p>}
      <div className="search-results">
        {chatHistory.map((chatItem, _index) => <div key={_index}>
          <p className="answer">{chatItem.role} : {chatItem.parts}</p>
        </div>)}
      </div>
      <div className="suggestion-container">
        <button className="suggestion-button" onClick={suggestActivity}>
          <span>Suggest Fun Activities</span>
        </button>
        <button className="brainstorm-button" onClick={brainstormNames}>
          Brainstorm Names
        </button>
      </div>
    </div>
  );
};
export default App;
