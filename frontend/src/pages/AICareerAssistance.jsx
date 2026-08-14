import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function AICareerAssistance() {
  const navigate = useNavigate();

  // =========================================================
  // State
  // =========================================================

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================================================
  // Get logged-in user ID
  // =========================================================
  //
  // Your backend requires:
  //
  // {
  //   "user_id": 1,
  //   "question": "..."
  // }
  //
  // We first try to get the ID from localStorage.
  // For current testing, if it is not available,
  // we use user ID 1.
  //
  // =========================================================

  const getUserId = () => {
    try {
      // Option 1
      const userId = localStorage.getItem("user_id");

      if (userId && !isNaN(Number(userId))) {
        return Number(userId);
      }

      // Option 2
      const userId2 = localStorage.getItem("userId");

      if (userId2 && !isNaN(Number(userId2))) {
        return Number(userId2);
      }

      // Option 3
      const userData = localStorage.getItem("user");

      if (userData) {
        try {
          const user = JSON.parse(userData);

          if (user?.id && !isNaN(Number(user.id))) {
            return Number(user.id);
          }

          if (user?.user_id && !isNaN(Number(user.user_id))) {
            return Number(user.user_id);
          }
        } catch (jsonError) {
          console.warn("Could not parse user data from localStorage.");
        }
      }

      // -----------------------------------------------------
      // TEMPORARY TESTING FALLBACK
      // -----------------------------------------------------
      // Your Swagger test is currently using user_id = 1.
      // Remove this fallback after login/localStorage is confirmed.
      return 1;
    } catch (error) {
      console.error("Could not get user ID:", error);

      // Temporary testing fallback
      return 1;
    }
  };

  // =========================================================
  // Send question to AI Career Assistant
  // =========================================================

  const handleAskAI = async () => {
    const currentQuestion = question.trim();

    // Do not send empty question
    if (!currentQuestion) {
      alert("Please enter your career question.");
      return;
    }

    // Get user ID
    const userId = getUserId();

    // Validate user ID
    if (!userId || isNaN(Number(userId))) {
      const errorMessage = {
        role: "assistant",
        content:
          "Unable to identify your user account. Please login again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // =======================================================
    // Add user's question to chat
    // =======================================================

    const userMessage = {
      role: "user",
      content: currentQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);

    // Clear input
    setQuestion("");

    // Show loading
    setLoading(true);

    try {
      // =====================================================
      // Request body
      // =====================================================
      //
      // IMPORTANT:
      // Backend requires BOTH user_id and question.
      //
      const requestData = {
        user_id: Number(userId),
        question: currentQuestion,
      };

      console.log("====================================");
      console.log("AI CAREER ASSISTANT REQUEST");
      console.log("User ID:", requestData.user_id);
      console.log("Question:", requestData.question);
      console.log("====================================");

      // =====================================================
      // Call FastAPI
      // =====================================================

      const response = await API.post(
        "/ai-career-assistance/",
        requestData
      );

      console.log("====================================");
      console.log("AI CAREER ASSISTANT RESPONSE");
      console.log("Status:", response.status);
      console.log("Data:", response.data);
      console.log("====================================");

      // =====================================================
      // Get backend response
      // =====================================================

      const data = response.data;

      // -----------------------------------------------------
      // Backend returned successful AI response
      // -----------------------------------------------------

      if (data?.success === true) {
        const aiResponse =
          typeof data.response === "string"
            ? data.response
            : "The AI generated a response, but it could not be displayed.";

        const aiMessage = {
          role: "assistant",
          content: aiResponse,
        };

        setMessages((prev) => [...prev, aiMessage]);

        return;
      }

      // -----------------------------------------------------
      // Backend responded but success = false
      // -----------------------------------------------------

      if (data?.success === false) {
        let backendMessage =
          data?.response ||
          "The AI could not generate a response right now.";

        // Make sure the message is a string
        if (typeof backendMessage !== "string") {
          backendMessage = JSON.stringify(backendMessage, null, 2);
        }

        const aiMessage = {
          role: "assistant",
          content: backendMessage,
        };

        setMessages((prev) => [...prev, aiMessage]);

        return;
      }

      // -----------------------------------------------------
      // Unexpected backend response
      // -----------------------------------------------------

      const unexpectedResponse =
        typeof data === "string"
          ? data
          : JSON.stringify(data, null, 2);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "The server returned an unexpected response:\n\n" +
            unexpectedResponse,
        },
      ]);
    } catch (error) {
      // =====================================================
      // Error handling
      // =====================================================

      console.error("====================================");
      console.error("AI CAREER ASSISTANT ERROR");
      console.error(error);
      console.error("====================================");

      let errorMessage =
        "Sorry, something went wrong. Please try again.";

      // =====================================================
      // Backend returned an error
      // =====================================================

      if (error?.response) {
        console.error(
          "Backend status:",
          error.response.status
        );

        console.error(
          "Backend data:",
          error.response.data
        );

        const status = error.response.status;
        const backendData = error.response.data;

        // ---------------------------------------------------
        // 422 Validation Error
        // ---------------------------------------------------

        if (status === 422) {
          if (backendData?.detail) {
            if (Array.isArray(backendData.detail)) {
              const validationErrors = backendData.detail
                .map((item) => {
                  const field =
                    item?.loc?.join(" → ") || "field";

                  const message =
                    item?.msg || "Invalid value";

                  return `${field}: ${message}`;
                })
                .join("\n");

              errorMessage =
                "Validation error:\n\n" + validationErrors;
            } else if (
              typeof backendData.detail === "string"
            ) {
              errorMessage =
                "Validation error: " +
                backendData.detail;
            } else {
              errorMessage =
                "Validation error:\n\n" +
                JSON.stringify(
                  backendData.detail,
                  null,
                  2
                );
            }
          } else {
            errorMessage =
              "Invalid request. Please check the user ID and question.";
          }
        }

        // ---------------------------------------------------
        // 404
        // ---------------------------------------------------

        else if (status === 404) {
          if (backendData?.detail) {
            errorMessage =
              "Error: " +
              formatErrorMessage(backendData.detail);
          } else {
            errorMessage =
              "User or requested resource was not found.";
          }
        }

        // ---------------------------------------------------
        // 500
        // ---------------------------------------------------

        else if (status >= 500) {
          errorMessage =
            "The backend server encountered an error. Please check the FastAPI terminal.";
        }

        // ---------------------------------------------------
        // Other backend errors
        // ---------------------------------------------------

        else {
          if (backendData?.detail) {
            errorMessage =
              "Error: " +
              formatErrorMessage(backendData.detail);
          } else if (backendData?.message) {
            errorMessage =
              "Error: " +
              formatErrorMessage(backendData.message);
          } else {
            errorMessage =
              "Server returned error " + status;
          }
        }
      }

      // =====================================================
      // Request was sent but no response received
      // =====================================================

      else if (error?.request) {
        console.error(
          "No response received from backend."
        );

        errorMessage =
          "Unable to connect to the FastAPI backend.\n\n" +
          "Please make sure your backend is running on port 8000.";
      }

      // =====================================================
      // Something happened while creating request
      // =====================================================

      else {
        errorMessage =
          "Request error: " +
          formatErrorMessage(error?.message);
      }

      // =====================================================
      // Display error in chat
      // =====================================================

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Convert error objects into readable text
  // =========================================================

  const formatErrorMessage = (error) => {
    if (!error) {
      return "Unknown error";
    }

    if (typeof error === "string") {
      return error;
    }

    if (error instanceof Error) {
      return error.message;
    }

    try {
      return JSON.stringify(error, null, 2);
    } catch {
      return String(error);
    }
  };

  // =========================================================
  // Quick question
  // =========================================================

  const handleQuickQuestion = (text) => {
    setQuestion(text);
  };

  // =========================================================
  // Clear chat
  // =========================================================

  const handleClearChat = () => {
    setMessages([]);
    setQuestion("");
  };

  // =========================================================
  // Enter = Send
  // Shift + Enter = New Line
  // =========================================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      if (!loading) {
        handleAskAI();
      }
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white shadow-lg">

        <div className="max-w-6xl mx-auto px-6 py-6">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">

            <div>

              <h1 className="text-3xl md:text-4xl font-bold">
                🤖 AI Career Assistance
              </h1>

              <p className="mt-2 text-blue-100">
                Your personal AI-powered career assistant
              </p>

            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="bg-white text-blue-700 hover:bg-blue-50 px-5 py-2 rounded-lg font-semibold transition"
            >
              ← Dashboard
            </button>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* ===================================================
            INTRODUCTION
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex items-start gap-4">

            <div className="text-5xl">
              🤖
            </div>

            <div>

              <h2 className="text-2xl font-bold text-gray-800">
                How can I help you? 👋
              </h2>

              <p className="text-gray-600 mt-2">
                Ask me anything about your career,
                skills, jobs, learning path, projects,
                resume or placement preparation.
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            QUICK QUESTIONS
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">

          <div className="flex justify-between items-center mb-4">

            <h3 className="text-xl font-bold text-gray-800">
              Quick Questions
            </h3>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

            <button
              onClick={() =>
                handleQuickQuestion(
                  "Which career path is suitable for me?"
                )
              }
              className="text-left border border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-xl transition"
            >
              🎯 Which career path is suitable for me?
            </button>

            <button
              onClick={() =>
                handleQuickQuestion(
                  "What skills should I learn for an AI/ML career?"
                )
              }
              className="text-left border border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-xl transition"
            >
              💻 What skills should I learn for AI/ML?
            </button>

            <button
              onClick={() =>
                handleQuickQuestion(
                  "What projects should I build for my resume?"
                )
              }
              className="text-left border border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-xl transition"
            >
              🛠️ What projects should I build?
            </button>

            <button
              onClick={() =>
                handleQuickQuestion(
                  "How can I prepare for campus placements?"
                )
              }
              className="text-left border border-gray-200 hover:border-blue-500 hover:bg-blue-50 p-4 rounded-xl transition"
            >
              🎓 How can I prepare for placements?
            </button>

          </div>

        </div>

        {/* ===================================================
            CHAT AREA
        ==================================================== */}

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          {/* =================================================
              CHAT HEADER
          ================================================== */}

          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5">

            <div className="flex justify-between items-center">

              <div>

                <h3 className="text-xl font-bold">
                  💬 Career Assistant Chat
                </h3>

                <p className="text-blue-100 text-sm mt-1">
                  Ask your career-related questions below.
                </p>

              </div>

              {messages.length > 0 && (
                <button
                  onClick={handleClearChat}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  🗑️ Clear
                </button>
              )}

            </div>

          </div>

          {/* =================================================
              MESSAGES
          ================================================== */}

          <div className="min-h-[400px] max-h-[550px] overflow-y-auto p-6">

            {messages.length === 0 ? (

              <div className="flex flex-col items-center justify-center h-[350px] text-center">

                <div className="text-6xl mb-5">
                  🤖
                </div>

                <h3 className="text-2xl font-bold text-gray-700">
                  Start your career conversation
                </h3>

                <p className="text-gray-500 mt-2 max-w-md">
                  Ask a question or select one of the
                  quick questions above to get started.
                </p>

              </div>

            ) : (

              <div className="space-y-5">

                {messages.map((message, index) => (

                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >

                    <div
                      className={`max-w-[85%] rounded-2xl px-5 py-4 ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >

                      {/* Message sender */}

                      <div className="text-xs font-semibold mb-2 opacity-70">

                        {message.role === "user"
                          ? "You"
                          : "🤖 AI Career Assistant"}

                      </div>

                      {/* Message content */}

                      <p className="whitespace-pre-wrap leading-7">
                        {message.content}
                      </p>

                    </div>

                  </div>

                ))}

                {/* =================================================
                    LOADING
                ================================================== */}

                {loading && (

                  <div className="flex justify-start">

                    <div className="bg-gray-100 rounded-2xl px-5 py-4 text-gray-600">

                      <div className="flex items-center gap-2">

                        <span className="animate-pulse">
                          🤖
                        </span>

                        <span>
                          AI is thinking...
                        </span>

                      </div>

                    </div>

                  </div>

                )}

              </div>

            )}

          </div>

          {/* =================================================
              INPUT
          ================================================== */}

          <div className="border-t border-gray-200 p-5">

            <div className="flex flex-col md:flex-row gap-3">

              <textarea
                value={question}
                onChange={(e) =>
                  setQuestion(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask your career question..."
                rows="3"
                disabled={loading}
                className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 resize-none disabled:bg-gray-100"
              />

              <button
                onClick={handleAskAI}
                disabled={
                  loading ||
                  !question.trim()
                }
                className="md:w-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl px-5 py-3 transition"
              >

                {loading
                  ? "⏳ Thinking..."
                  : "✨ Ask AI"}

              </button>

            </div>

            <p className="text-xs text-gray-400 mt-2">
              Press Enter to send. Use Shift + Enter
              for a new line.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AICareerAssistance;