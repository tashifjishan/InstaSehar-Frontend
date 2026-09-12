
import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Phone,
  Video,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Send,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  PhoneOff,
  X,
  ArrowLeft,
} from "lucide-react";

const conversations = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "AJ",
    lastMessage: "See you tomorrow!",
    time: "10:42 AM",
    unread: 2,
    online: true,
  },
  {
    id: 2,
    name: "Sarah Wilson",
    avatar: "SW",
    lastMessage: "That sounds great 👍",
    time: "Yesterday",
    unread: 0,
    online: false,
  },
  {
    id: 3,
    name: "Mike Chen",
    avatar: "MC",
    lastMessage: "Can you send me the file?",
    time: "Monday",
    unread: 0,
    online: true,
  },
];

const initialMessages = [
  {
    id: 1,
    sender: "them",
    text: "Hey! How are you doing?",
    time: "10:35 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "I'm doing great! Just working on this chat app.",
    time: "10:37 AM",
  },
  {
    id: 3,
    sender: "them",
    text: "Nice! Are you building it from scratch?",
    time: "10:39 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Yep. Just practicing React and WebRTC.",
    time: "10:40 AM",
  },
  {
    id: 5,
    sender: "them",
    text: "See you tomorrow!",
    time: "10:42 AM",
  },
];

export default function MainPage({user, socket}) {
  const [selectedConversation, setSelectedConversation] = useState(
    conversations[0]
  );

  const [messages, setMessages] = useState(initialMessages);
  const [message, setMessage] = useState("");

  // UI-only call states.
  // Replace these with your WebRTC/backend state later.
  const [callState, setCallState] = useState("idle");
  // idle | calling | connected | ended

  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [showConversationList, setShowConversationList] = useState(true);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        sender: "me",
        text: message,
        time: "Now",
      },
    ]);

    alert(message+selectedConversation._id)

    setMessage("");
  };

  const startVideoCall = () => {
    setCallState("calling");
  };

  const acceptCall = () => {
    setCallState("connected");
  };

  const endCall = () => {
    setCallState("ended");

    // Demo only — reset after a short delay.
    setTimeout(() => {
      setCallState("idle");
    }, 1000);
  };

  const selectConversation = (conversation) => {
    setSelectedConversation(conversation);
    setShowConversationList(false);

    // In a real application:
    // fetch/load messages for this conversation here.
  };


  const [inbox, setInbox] = useState([]);

  useEffect(()=>{
    socket.on("new_message", (data)=>{alert(data)})
  }, [socket])

  useEffect(()=>{
    (async()=>{
      try {
        let response = await fetch("http://localhost:8080/inbox", {credentials: "include"});
        const resOk = response.ok;
        response = await response.json();
        if(!resOk)
          throw new error(response.message);

        console.log(response.inbox);
        setInbox(response.inbox);
        console.log(user)
      } catch (error) {
        alert(error.message)
      }
    })()
  }, [])
  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex overflow-hidden">
      {/* ============================================================
          SIDEBAR
      ============================================================ */}

      <aside
        className={`
          w-full md:w-80 bg-white border-r border-slate-200
          flex flex-col
          ${showConversationList ? "flex" : "hidden md:flex"}
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <MessageCircle size={19} />
            </div>

            <h1 className="font-semibold text-lg">ChatApp</h1>
          </div>

          <button className="p-2 rounded-lg hover:bg-slate-100">
            <MoreVertical size={19} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search conversations"
              className="
                w-full h-10 pl-9 pr-3
                bg-slate-100 rounded-lg
                text-sm outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto">
          {inbox.map((conversation) => {
            const active = selectedConversation.id === conversation.id;

            return (
              <button
                key={conversation._id}
                onClick={() => selectConversation(conversation)}
                className={`
                  w-full px-4 py-3 flex gap-3 text-left
                  transition-colors
                  ${
                    active
                      ? "bg-blue-50"
                      : "hover:bg-slate-50"
                  }
                `}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                    {conversation.avatar}
                  </div>

                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                  )}
                </div>

                {/* Preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <span className="font-medium truncate">
                      {conversation.participants.filter(participant=>participant._id!=user._id)[0].name}
                    </span>

                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {conversation.time}
                    </span>
                  </div>

                  <div className="flex justify-between mt-1">
                    <p className="text-sm text-slate-500 truncate">
                      {conversation.messages.sort((a,b)=>b.createdAt -a.createdAt)[0].content}
                    </p>

                    {conversation.unread > 0 && (
                      <span className="ml-2 shrink-0 w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {conversation.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </aside>

      {/* ============================================================
          CHAT
      ============================================================ */}

      <main
        className={`
          flex-1 flex flex-col min-w-0
          ${showConversationList ? "hidden md:flex" : "flex"}
        `}
      >
        {/* Chat header */}
        <header className="h-16 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConversationList(true)}
              className="md:hidden p-2 hover:bg-slate-100 rounded-lg"
            >
              <ArrowLeft size={19} />
            </button>

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold">
                {selectedConversation.avatar}
              </div>

              {selectedConversation.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>

            <div>
              <h2 className="font-semibold">
                {selectedConversation?.participants?.filter(el=>el._id!=user._id)[0].name}

a              </h2>

              <p className="text-xs text-slate-400">
                {selectedConversation.online ? "Online" : "Offline"}
              </p>
            </div>
          </div>

          {/* Call buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={startVideoCall}
              className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Video call"
            >
              <Video size={20} />
            </button>

            <button
              className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-600"
              title="Audio call"
            >
              <Phone size={19} />
            </button>

            <button className="p-2.5 rounded-lg hover:bg-slate-100 text-slate-600">
              <MoreVertical size={19} />
            </button>
          </div>
        </header>

        {/* Messages */}
        <section className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="text-center">
            <span className="inline-block px-3 py-1 rounded-full bg-slate-200 text-xs text-slate-500">
              Today
            </span>
          </div>

          {selectedConversation?.messages?.map((msg) => {
            const isMe = msg.sentBy===user._id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`
                    max-w-[75%] md:max-w-[60%]
                    ${isMe ? "items-end" : "items-start"}
                    flex flex-col
                  `}
                >
                  <div
                    className={`
                      px-4 py-2.5 rounded-2xl text-sm
                      ${
                        isMe
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white border border-slate-200 rounded-bl-md"
                      }
                    `}
                  >
                    {msg.content}
                  </div>

                  <span className="text-[11px] text-slate-400 mt-1 px-1">
                    {new Date(msg.createdAt).toString()}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Message composer */}
        <footer className="bg-white border-t border-slate-200 p-3 md:p-4">
          <div className="flex items-center gap-2 max-w-5xl mx-auto">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
              <Paperclip size={20} />
            </button>

            <div className="flex-1 relative">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") sendMessage();
                }}
                placeholder="Write a message..."
                className="
                  w-full h-11 px-4 pr-10
                  bg-slate-100 rounded-xl
                  outline-none text-sm
                  focus:ring-2 focus:ring-blue-500
                "
              />

              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400">
                <Smile size={19} />
              </button>
            </div>

            <button
              onClick={sendMessage}
              className="
                w-11 h-11 rounded-xl
                bg-blue-600 text-white
                flex items-center justify-center
                hover:bg-blue-700
                transition-colors
              "
            >
              <Send size={18} />
            </button>
          </div>
        </footer>
      </main>

      {/* ============================================================
          VIDEO CALL OVERLAY
      ============================================================ */}

      {callState !== "idle" && (
        <div className="fixed inset-0 z-50 bg-slate-950 text-white">
          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 z-10 px-5 py-4 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent">
            <div>
              <h2 className="font-semibold">
                {selectedConversation.name}
              </h2>

              <p className="text-sm text-white/60">
                {callState === "calling" && "Calling..."}
                {callState === "connected" && "Connected"}
                {callState === "ended" && "Call ended"}
              </p>
            </div>

            <button
              onClick={endCall}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          {/* Remote video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            {callState === "connected" ? (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                {/* Replace this div with your remote <video> element */}
                <div className="text-center">
                  <div className="w-28 h-28 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-3xl font-semibold">
                    {selectedConversation.avatar}
                  </div>

                  <p className="mt-4 text-white/70">
                    Remote video stream
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full bg-blue-600 flex items-center justify-center text-2xl font-semibold">
                  {selectedConversation.avatar}
                </div>

                <h3 className="mt-5 text-xl font-semibold">
                  {selectedConversation.name}
                </h3>

                <p className="mt-1 text-white/50">
                  {callState === "calling"
                    ? "Calling..."
                    : "Call ended"}
                </p>
              </div>
            )}
          </div>

          {/* Local video */}
          {callState === "connected" && (
            <div className="absolute right-4 top-20 w-32 md:w-48 aspect-video rounded-xl overflow-hidden bg-slate-700 border border-white/20 shadow-xl">
              {isCameraOff ? (
                <div className="w-full h-full flex items-center justify-center">
                  <CameraOff size={22} className="text-white/50" />
                </div>
              ) : (
                <>
                  {/* Replace with your local <video> element */}
                  <div className="w-full h-full bg-slate-600 flex items-center justify-center text-xs text-white/50">
                    Your camera
                  </div>
                </>
              )}
            </div>
          )}

          {/* Incoming call simulation */}
          {callState === "calling" && (
            <div className="absolute bottom-28 left-1/2 -translate-x-1/2 flex gap-3">
              <button
                onClick={acceptCall}
                className="
                  px-5 py-3 rounded-full
                  bg-green-500 hover:bg-green-600
                  font-medium
                "
              >
                Accept
              </button>

              <button
                onClick={endCall}
                className="
                  px-5 py-3 rounded-full
                  bg-red-500 hover:bg-red-600
                  font-medium
                "
              >
                Decline
              </button>
            </div>
          )}

          {/* Call controls */}
          {callState === "connected" && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  ${
                    isMuted
                      ? "bg-white text-slate-900"
                      : "bg-white/15 hover:bg-white/25"
                  }
                `}
              >
                {isMuted ? (
                  <MicOff size={20} />
                ) : (
                  <Mic size={20} />
                )}
              </button>

              <button
                onClick={() => setIsCameraOff(!isCameraOff)}
                className={`
                  w-12 h-12 rounded-full
                  flex items-center justify-center
                  ${
                    isCameraOff
                      ? "bg-white text-slate-900"
                      : "bg-white/15 hover:bg-white/25"
                  }
                `}
              >
                {isCameraOff ? (
                  <CameraOff size={20} />
                ) : (
                  <Camera size={20} />
                )}
              </button>

              <button
                onClick={endCall}
                className="
                  w-14 h-14 rounded-full
                  bg-red-500 hover:bg-red-600
                  flex items-center justify-center
                "
              >
                <PhoneOff size={22} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
