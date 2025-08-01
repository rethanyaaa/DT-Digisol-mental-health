// Simple test script to verify chat functionality
// This can be run in the browser console to test the chat

function testChatFunctionality() {
  console.log("=== Testing Chat Functionality ===");

  // Test 1: Check if socket is available
  if (typeof io === "undefined") {
    console.error("❌ Socket.IO not available");
    return;
  }
  console.log("✅ Socket.IO available");

  // Test 2: Check if we can connect to the backend
  const testSocket = io("http://localhost:4000", {
    auth: {
      token: "test-token",
      userType: "test",
    },
  });

  testSocket.on("connect", () => {
    console.log("✅ Socket connected successfully");

    // Test 3: Test chat message emission
    const testMessage = {
      roomId: "test-room",
      message: "Test message",
      sender: "Test User",
      userType: "test",
      timestamp: new Date(),
    };

    console.log("📤 Emitting test message:", testMessage);
    testSocket.emit("chat-message", testMessage);

    // Test 4: Listen for chat messages
    testSocket.on("chat-message", (data) => {
      console.log("📥 Received chat message:", data);
      console.log("✅ Chat functionality is working!");
    });

    // Test 5: Test typing indicators
    console.log("📤 Emitting typing start");
    testSocket.emit("typing-start", { roomId: "test-room", userType: "test" });

    testSocket.on("typing-start", (data) => {
      console.log("📥 Received typing start:", data);
    });

    testSocket.on("typing-stop", (data) => {
      console.log("📥 Received typing stop:", data);
    });

    // Clean up after 5 seconds
    setTimeout(() => {
      console.log("🧹 Cleaning up test socket");
      testSocket.disconnect();
    }, 5000);
  });

  testSocket.on("connect_error", (error) => {
    console.error("❌ Socket connection failed:", error);
  });
}

// Run the test
testChatFunctionality();
