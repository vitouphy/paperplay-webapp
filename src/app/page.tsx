export default function Page() {
  return (
    <div className="flex h-screen">
      <div className="bg-gray-800 text-white w-64 hidden lg:block">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Your App</h2>
        </div>
        <ul className="space-y-2">
          <li>
            <a href="#" className="block pl-6 py-2 hover:bg-gray-700">
              Dashboard
            </a>
          </li>
        </ul>
      </div>

      <div className="flex-1 h-screen overflow-y-auto relative">
        <div className="p-8">
          <div>
            <h1 className="text-2xl font-bold mb-4">
              Welcome to Your Dashboard
            </h1>
            <p>
              This is where your main content goes. You can add articles,
              charts, forms, and any other elements you need.
            </p>
            {/* Chat Boxes */}
            <div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-start">
                <div className="chat-bubble">
                  It's over Anakin,
                  <br />I have the high ground.
                </div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
              <div className="chat chat-end">
                <div className="chat-bubble">You underestimate my power!</div>
              </div>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 bg-black p-2 pt-0">
          <hr className="my-4 border-gray-800" />

          <div className="bottom-0 w-full">
            <form
              // onSubmit={handleSubmit}
              className="flex items-center p-2 space-x-2"
            >
              <textarea
                // value={message}
                // onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-l-md resize-none"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-r-md"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
