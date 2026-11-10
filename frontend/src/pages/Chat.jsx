import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ResultsGrid from "../components/results/ResultsGrid";

// ============================================================
// API
// ============================================================

const API_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ||
  "http://127.0.0.1:8000";

// ============================================================
// STORAGE KEYS
// ============================================================

const CHAT_SESSION_KEY = "vastra-chat-session";
const PENDING_FLOW_KEY =
  "vastra-pending-stylist-flow";

const STYLIST_RETURN_KEY =
  "vastra-stylist-return-path";

const STYLIST_FLOW_ID_KEY =
  "vastra-stylist-flow-id";

// ============================================================
// FALLBACK PROMPT
// ============================================================

const FALLBACK_PROMPT =
  "Bro, I need help putting together an outfit. Ask me whatever you actually need to know, but keep it natural.";

// ============================================================
// VISUAL FLOW USER MESSAGES
// ============================================================

const VISUAL_USER_MESSAGES = {
  analyze:
    "I uploaded my outfit photo. Please analyse it and tell me what is working, what I can improve, which colours suit the combination, and how I can improve my overall style.",

  complete:
    "I uploaded my look. Please check what is working, what is mismatching, what I should keep, change or remove, and what I could add to make the outfit look better.",

  wardrobe:
    "I uploaded my wardrobe photos. Please identify what I have and create useful outfit combinations from the clothes I already own.",
};


// ============================================================
// RESPONSE HELPERS
// ============================================================

function extractAssistantMessage(data) {
  if (!data) {
    return "";
  }

  // Preferred backend response:
  // {
  //   success: true,
  //   response: {
  //     assistant_message: "..."
  //   }
  // }

  if (
    data.response &&
    typeof data.response === "object" &&
    typeof data.response.assistant_message === "string"
  ) {
    return data.response.assistant_message;
  }

  // Direct response

  if (typeof data.assistant_message === "string") {
    return data.assistant_message;
  }

  // Response may itself be a string

  if (typeof data.response === "string") {
    const raw = data.response.trim();

    try {
      const parsed = JSON.parse(raw);

      if (typeof parsed === "string") {
        return parsed;
      }

      if (typeof parsed?.assistant_message === "string") {
        return parsed.assistant_message;
      }

      if (typeof parsed?.message === "string") {
        return parsed.message;
      }
    } catch {
      // Continue with fallback parsing.
    }

    // Python-dict style fallback

    const match = raw.match(
      /['"]assistant_message['"]\s*:\s*(['"])([\s\S]*?)\1\s*(?:,|\})/
    );

    if (match?.[2]) {
      return match[2]
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\'/g, "'")
        .trim();
    }

    if (
      !raw.startsWith("{") &&
      !raw.startsWith("[")
    ) {
      return raw;
    }
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  return "";
}

function cleanMessage(text) {
  return String(text || "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .trim();
}

function renderVastraMessage(text) {
  const lines = cleanMessage(text).split("\n");

  const renderInline = (value) => {
    const parts = value.split(
      /(\*\*.*?\*\*|\*.*?\*)/g
    );

    return parts.map((part, index) => {
      if (
        part.startsWith("**") &&
        part.endsWith("**")
      ) {
        return (
          <strong
            key={index}
            className="font-semibold text-[#f4efe3]"
          >
            {part.slice(2, -2)}
          </strong>
        );
      }

      if (
        part.startsWith("*") &&
        part.endsWith("*")
      ) {
        return (
          <strong
            key={index}
            className="font-semibold text-[#f4efe3]"
          >
            {part.slice(1, -1)}
          </strong>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3">
      {lines.map((line, index) => {
        const trimmed = line.trim();

        if (!trimmed) {
          return (
            <div
              key={index}
              className="h-1"
            />
          );
        }

        // Remove markdown heading markers
        const heading = trimmed.replace(
          /^#{1,6}\s*/,
          ""
        );

        // Section headings
        const sectionHeadings = [
          "WHAT'S WORKING",
          "WHAT I WOULD CHANGE",
          "WAYS TO IMPROVE",
          "TRY THIS INSTEAD",
          "WHY IT WORKS",
          "COLOUR DIRECTION",
          "FINISHING TOUCHES",
          "BEST SINGLE CHANGE",
          "WHAT I SEE",
          "WARDROBE GAP",
          "OUTFIT 1",
          "OUTFIT 2",
          "OUTFIT 3",
        ];

        if (
          sectionHeadings.includes(
            heading
              .replace(/\*\*/g, "")
              .toUpperCase()
          )
        ) {
          return (
            <div
              key={index}
              className="pt-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#D4AF37]"
            >
              {heading.replace(/\*\*/g, "")}
            </div>
          );
        }

        // Numbered list
        const numbered = trimmed.match(
          /^(?:[0-9️⃣]+[.)️⃣]|[0-9]+\.)\s*(.*)$/
        );

        if (numbered) {
          return (
            <div
              key={index}
              className="flex gap-3 leading-7"
            >
              <span className="flex-none font-semibold text-[#D4AF37]">
                {trimmed.match(
                  /^(?:[0-9]+|[1-9]️⃣)/
                )?.[0] || "•"}
              </span>

              <span>
                {renderInline(numbered[1])}
              </span>
            </div>
          );
        }

        // Bullet list
        const bullet = trimmed.match(
          /^(?:[-•*])\s+(.*)$/
        );

        if (bullet) {
          return (
            <div
              key={index}
              className="flex gap-3 leading-7"
            >
              <span className="text-[#D4AF37]">
                •
              </span>

              <span>
                {renderInline(bullet[1])}
              </span>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p
            key={index}
            className="leading-7"
          >
            {renderInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
}

function readJsonStorage(key) {
  try {
    const raw = sessionStorage.getItem(key);

    if (!raw) {
      return null;
    }

    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// ============================================================
// CHAT
// ============================================================

function Chat() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // ==========================================================
  // URL PROMPT
  // ==========================================================

  const promptFromUrl =
    searchParams.get("prompt")?.trim() || "";

  // ==========================================================
  // PENDING IMAGE / WARDROBE FLOW
  // ==========================================================

  const pendingFlow = readJsonStorage(
    PENDING_FLOW_KEY
  );

  const visualFlow =
    pendingFlow &&
    Array.isArray(pendingFlow.images) &&
    pendingFlow.images.length > 0 &&
    [
      "analyze",
      "complete",
      "wardrobe",
    ].includes(pendingFlow.tool)
      ? pendingFlow
      : null;


  // ==========================================================
  // SAVED CHAT SESSION
  // ==========================================================

  const storedChatSession = readJsonStorage(
    CHAT_SESSION_KEY
  );

  const canRestoreStoredSession =
    !visualFlow &&
    Array.isArray(storedChatSession?.messages) &&
    storedChatSession.messages.length > 0 &&
    (
      !promptFromUrl ||
      storedChatSession.prompt === promptFromUrl
    );

  const restoredMessages =
    canRestoreStoredSession
      ? storedChatSession.messages
      : [];

  const sessionPrompt =
    promptFromUrl ||
    storedChatSession?.prompt ||
    "";

  // IMPORTANT:
  // Only ONE initialPrompt declaration exists.
  const initialPrompt =
    promptFromUrl ||
    (
      canRestoreStoredSession
        ? sessionPrompt
        : FALLBACK_PROMPT
    );

  // ==========================================================
  // STATE
  // ==========================================================

  const [messages, setMessages] =
    useState(restoredMessages);

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================================
  // REFS
  // ==========================================================

  const inputRef = useRef(null);

  const chatScrollRef = useRef(null);

  const messageRefs = useRef({});

  const initialSentRef = useRef(
    restoredMessages.length > 0 ||
    !!visualFlow
  );

  const visualFlowStartedRef =
    useRef(false);

  const previousLastMessageIdRef =
    useRef(
      restoredMessages.length > 0
        ? restoredMessages[
            restoredMessages.length - 1
          ]?.id
        : null
    );

  const restoringScrollRef = useRef(
    restoredMessages.length > 0
  );

  // ==========================================================
  // CHAT SCROLL
  // ==========================================================

  useEffect(() => {
    const scrollContainer =
      chatScrollRef.current;

    if (!scrollContainer) {
      return;
    }

    // --------------------------------------------------------
    // RETURNING FROM PRODUCT DETAILS
    // --------------------------------------------------------

    if (restoringScrollRef.current) {
      restoringScrollRef.current = false;

      const savedSession =
        readJsonStorage(
          CHAT_SESSION_KEY
        );

      const savedScrollTop =
        Number(
          savedSession?.scrollTop
        );

      requestAnimationFrame(() => {
        if (
          Number.isFinite(
            savedScrollTop
          ) &&
          savedScrollTop >= 0
        ) {
          scrollContainer.scrollTop =
            savedScrollTop;
        }
      });

      return;
    }

    // --------------------------------------------------------
    // NO MESSAGES
    // --------------------------------------------------------

    if (!messages.length) {
      return;
    }

    const latestMessage =
      messages[
        messages.length - 1
      ];

    if (!latestMessage?.id) {
      return;
    }

    // Prevent repeated scrolling on normal re-renders.

    if (
      previousLastMessageIdRef.current ===
      latestMessage.id
    ) {
      return;
    }

    previousLastMessageIdRef.current =
      latestMessage.id;

    // Scroll to the newly added message,
    // NOT to the bottom of product cards.

    requestAnimationFrame(() => {
      const messageElement =
        messageRefs.current[
          latestMessage.id
        ];

      if (!messageElement) {
        return;
      }

      messageElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [messages]);

  // ==========================================================
  // AUTO FOCUS
  // ==========================================================

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // ==========================================================
  // SAVE CHAT SESSION
  // ==========================================================

  useEffect(() => {
    try {
      if (!messages.length) {
        return;
      }

      sessionStorage.setItem(
        CHAT_SESSION_KEY,
        JSON.stringify({
          prompt:
            promptFromUrl ||
            sessionPrompt,

          messages,

          scrollTop:
            chatScrollRef.current
              ?.scrollTop ?? 0,
        })
      );
    } catch (error) {
      console.warn(
        "VASTRA → Could not save chat session.",
        error
      );
    }
  }, [
    messages,
    promptFromUrl,
    sessionPrompt,
  ]);

  // ==========================================================
  // SAVE CURRENT SCROLL POSITION
  // ==========================================================

  useEffect(() => {
    const scrollContainer =
      chatScrollRef.current;

    if (!scrollContainer) {
      return;
    }

    const handleScroll = () => {
      try {
        const raw =
          sessionStorage.getItem(
            CHAT_SESSION_KEY
          );

        if (!raw) {
          return;
        }

        const session =
          JSON.parse(raw);

        session.scrollTop =
          scrollContainer.scrollTop;

        sessionStorage.setItem(
          CHAT_SESSION_KEY,
          JSON.stringify(session)
        );
      } catch {
        // Ignore storage errors.
      }
    };

    scrollContainer.addEventListener(
      "scroll",
      handleScroll,
      { passive: true }
    );

    return () => {
      scrollContainer.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  // ==========================================================
  // VISUAL STYLIST FLOW
  // ==========================================================
  //
  // Used by:
  //
  // 01 Analyze My Outfit
  // 02 Complete & Improve My Look
  // 03 Style My Wardrobe
  //
  // The image(s) are sent to:
  //
  // POST /stylist-vision
  //
  // They are NOT sent as a fake text-only /chat request.
  //
  // ==========================================================

  useEffect(() => {
    if (!visualFlow) {
      return;
    }

    if (visualFlowStartedRef.current) {
      return;
    }

    visualFlowStartedRef.current = true;

    const tool =
      visualFlow.tool;

    const images =
      visualFlow.images;

    const userContent =
      VISUAL_USER_MESSAGES[tool] ||
      VISUAL_USER_MESSAGES.analyze;

    const userMessage = {
      id:
        `user-visual-${Date.now()}`,

      role: "user",

      content:
        userContent,

      images,

      visualTool:
        tool,
    };

    setMessages([
      userMessage,
    ]);

    setLoading(true);

    const analyseImages =
      async () => {
        try {
          console.log(
            "VASTRA → Visual flow:",
            tool
          );

          console.log(
            "VASTRA → Images:",
            images.length
          );

          const response =
            await fetch(
              `${API_URL}/stylist-vision`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",

                  Accept:
                    "application/json",
                },

                body:
                  JSON.stringify({
                    tool,
                    images,
                  }),
              }
            );

          const raw =
            await response.text();

          let data;

          try {
            data =
              JSON.parse(raw);
          } catch {
            throw new Error(
              "VASTRA returned invalid visual-analysis JSON."
            );
          }

          if (!response.ok) {
            throw new Error(
              data?.detail ||
                data?.error ||
                `Visual analysis failed (${response.status})`
            );
          }

          const answer =
            cleanMessage(
              extractAssistantMessage(data)
            );

          if (!answer) {
            throw new Error(
              "VASTRA returned an empty visual analysis."
            );
          }

          const assistantMessage = {
            id:
              `assistant-visual-${Date.now()}`,

            role:
              "assistant",

            content:
              answer,

            products:
              [],

            userRequest:
              userContent,
          };

          setMessages(
            (prev) => [
              ...prev,
              assistantMessage,
            ]
          );
        } catch (error) {
          console.error(
            "VASTRA → Visual analysis error:",
            error
          );

          setMessages(
            (prev) => [
              ...prev,
              {
                id:
                  `error-visual-${Date.now()}`,

                role:
                  "assistant",

                content:
                  "I couldn't analyse the uploaded photo right now. Please try the image again.",
              },
            ]
          );
        } finally {
          setLoading(false);

          try {
            sessionStorage.removeItem(
              PENDING_FLOW_KEY
            );
          } catch {
            // Ignore.
          }

          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
        }
      };

    analyseImages();
  }, [
    visualFlow,
    restoredMessages.length,
  ]);

  // ==========================================================
  // NORMAL CHAT MESSAGE
  // ==========================================================

  const sendMessage =
    async (message) => {
      const trimmed =
        message?.trim();

      if (
        !trimmed ||
        loading
      ) {
        return;
      }

      const userMessage = {
        id:
          `user-${Date.now()}`,

        role:
          "user",

        content:
          trimmed,
      };

      // Build history BEFORE setMessages().

      const conversationHistory = [
        ...messages
          .filter(
            (item) =>
              item &&
              typeof item.role ===
                "string" &&
              typeof item.content ===
                "string"
          )
          .map((item) => ({
            role:
              item.role,

            content:
              item.content,
          })),

        {
          role:
            "user",

          content:
            trimmed,
        },
      ];

      // Show user message immediately.

      setMessages(
        (prev) => [
          ...prev,
          userMessage,
        ]
      );

      setInput("");

      setLoading(true);

      try {
        console.log(
          "VASTRA → Sending message:",
          trimmed
        );

        console.log(
          "VASTRA → Conversation history:",
          conversationHistory
        );

        const response =
          await fetch(
            `${API_URL}/chat`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify({
                  message:
                    trimmed,

                  history:
                    conversationHistory,
                }),
            }
          );

        const raw =
          await response.text();

        let data;

        try {
          data =
            JSON.parse(raw);
        } catch {
          throw new Error(
            "Backend returned invalid JSON."
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              data?.error ||
              data?.message ||
              `Backend error (${response.status})`
          );
        }

        const assistantMessage =
          cleanMessage(
            extractAssistantMessage(
              data
            )
          );

        const responsePayload =
          data?.response ??
          data;

        const products =
          Array.isArray(
            responsePayload?.products
          )
            ? responsePayload.products
            : [];

        if (!assistantMessage) {
          throw new Error(
            "VASTRA returned a response, but no assistant message was found."
          );
        }

        setMessages(
          (prev) => [
            ...prev,

            {
              id:
                `assistant-${Date.now()}`,

              role:
                "assistant",

              content:
                assistantMessage,

              products,

              userRequest:
                trimmed,
            },
          ]
        );
      } catch (error) {
        console.error(
          "VASTRA → Chat error:",
          error
        );

        setMessages(
          (prev) => [
            ...prev,

            {
              id:
                `error-${Date.now()}`,

              role:
                "assistant",

              content:
                "Sorry bro, I couldn't connect to VASTRA right now. Please try again.",
            },
          ]
        );
      } finally {
        setLoading(false);

        setTimeout(() => {
          inputRef.current?.focus();
        }, 50);
      }
    };

  // ==========================================================
  // INITIAL NORMAL CHAT PROMPT
  // ==========================================================

  useEffect(() => {
    // Visual flows use /stylist-vision,
    // so do not send their prompt through /chat.

    if (visualFlow) {
      return;
    }

    if (
      !initialPrompt ||
      initialSentRef.current
    ) {
      return;
    }

    const timer =
      setTimeout(() => {
        if (
          initialSentRef.current
        ) {
          return;
        }

        initialSentRef.current =
          true;

        console.log(
          "VASTRA → Initial stylist prompt:",
          initialPrompt
        );

        sendMessage(
          initialPrompt
        );
      }, 150);

    return () => {
      clearTimeout(timer);
    };

    // sendMessage intentionally omitted.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    initialPrompt,
    visualFlow,
  ]);

  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  const handleSubmit = (
    event
  ) => {
    event.preventDefault();

    sendMessage(input);
  };

  // ==========================================================
  // ENTER KEY
  // ==========================================================

  const handleKeyDown = (
    event
  ) => {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage(input);
    }
  };

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="min-h-screen h-screen overflow-hidden bg-[#050505] text-white flex flex-col">

      <style>{`
        .vastra-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .vastra-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .vastra-scroll::-webkit-scrollbar-thumb {
          background: rgba(212,175,55,.22);
          border-radius: 999px;
        }

        .vastra-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(212,175,55,.22) transparent;
        }

        @keyframes vastra-message-in {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes vastra-dot {
          0%,
          70%,
          100% {
            opacity: .25;
            transform: translateY(0);
          }

          35% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        .vastra-message-in {
          animation:
            vastra-message-in
            .28s
            ease
            both;
        }

        .vastra-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #d4af37;
          animation:
            vastra-dot
            1s
            infinite
            ease-in-out;
        }

        .vastra-dot:nth-child(2) {
          animation-delay: .14s;
        }

        .vastra-dot:nth-child(3) {
          animation-delay: .28s;
        }
      `}</style>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="w-full flex-none">
        <div className="mx-auto flex h-[88px] w-[min(1080px,calc(100%-40px))] items-center gap-4">

          <button
            type="button"
            onClick={() => {
  // Keep the current visual flow's tool BEFORE clearing storage.
  const flowTool = visualFlow?.tool;

  const returnPath =
    searchParams.get("from")?.trim() ||
    sessionStorage.getItem(STYLIST_RETURN_KEY)?.trim() ||
    (flowTool
      ? `/stylist/tool/${flowTool}`
      : "/stylist");

  // Leaving Chat ends this exact review.
  // The next upload must start completely fresh.
  try {
    sessionStorage.removeItem(PENDING_FLOW_KEY);
    sessionStorage.removeItem(CHAT_SESSION_KEY);
    sessionStorage.removeItem(STYLIST_RETURN_KEY);
    sessionStorage.removeItem(STYLIST_FLOW_ID_KEY);
  } catch {
    // Ignore storage errors.
  }

  navigate(returnPath);
}}
            aria-label="Go back"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/[0.08] bg-white/[0.02] text-white/70 transition hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.05] hover:text-white"
          >
            <span className="text-[21px]">
              ←
            </span>
          </button>

          <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#9a7916] text-black shadow-[0_10px_30px_rgba(212,175,55,.12)]">
            <span className="text-[19px]">
              ✦
            </span>
          </div>

          <div className="flex flex-col gap-[2px]">
            <div className="text-[10px] font-bold tracking-[0.34em] text-[#d4af37]">
              VASTRA AI
            </div>

            <div className="text-[18px] font-semibold text-[#eeeae2]">
              Personal Stylist
            </div>
          </div>

        </div>
      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="mx-auto flex w-[min(1000px,calc(100%-40px))] min-h-0 flex-1 flex-col">

        {/* ===================================================
            MESSAGE AREA
        =================================================== */}

        <section
          ref={chatScrollRef}
          className="vastra-scroll flex-1 min-h-0 overflow-y-auto px-0 pb-7 pt-3"
          aria-live="polite"
        >

          {messages.map(
            (message) => {
              const isUser =
                message.role ===
                "user";

              return (
                <div
                  key={
                    message.id
                  }
                  ref={(
                    element
                  ) => {
                    if (element) {
                      messageRefs.current[
                        message.id
                      ] =
                        element;
                    } else {
                      delete messageRefs.current[
                        message.id
                      ];
                    }
                  }}
                  className={`vastra-message-in mb-3 flex w-full ${
                    isUser
                      ? "justify-end"
                      : "justify-start gap-2.5"
                  }`}
                >

                  {/* VASTRA ICON */}

                  {!isUser && (
                    <div className="mt-1 grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-[#d4af37]/20 bg-[#151209] text-[14px] text-[#d4af37]">
                      ✦
                    </div>
                  )}

                  <div
                    className={`min-w-0 flex flex-col ${
                      isUser
                        ? "w-fit max-w-[86%] items-end"
                        : "w-full max-w-[86%] items-start"
                    }`}
                  >

                    {/* =================================================
                        USER UPLOADED IMAGE(S)
                    ================================================= */}

                    {isUser &&
                      Array.isArray(
                        message.images
                      ) &&
                      message.images.length >
                        0 && (
                        <div className="mb-2 flex max-w-full flex-wrap justify-end gap-2">

                          {message.images.map(
                            (
                              image,
                              index
                            ) => (
                              <img
                                key={
                                  `${message.id}-${index}`
                                }
                                src={
                                  image
                                }
                                alt={`Uploaded style ${index + 1}`}
                                className="h-32 w-28 rounded-2xl border border-[#d4af37]/20 object-cover shadow-[0_10px_30px_rgba(0,0,0,.28)] sm:h-40 sm:w-32"
                              />
                            )
                          )}

                        </div>
                      )}

                    {/* =================================================
                        MESSAGE TEXT
                    ================================================= */}

                    <div
                      className={
                        isUser
                          ? "w-fit max-w-full whitespace-pre-wrap break-words rounded-[23px_23px_7px_23px] border border-[#d4af37]/25 bg-gradient-to-br from-[#8a6d18] to-[#705915] px-[18px] py-[13px] text-[15px] leading-[1.65] text-[#f7f3e9] shadow-[0_12px_34px_rgba(0,0,0,.22)]"
                          : "w-fit max-w-full whitespace-pre-wrap break-words rounded-[7px_23px_23px_23px] border border-white/[0.06] bg-[#111111] px-[18px] py-[13px] text-[15px] leading-[1.65] text-[#e7e3da] shadow-[0_12px_34px_rgba(0,0,0,.18)]"
                      }
                    >
                      {isUser
  ? cleanMessage(message.content)
  : renderVastraMessage(message.content)}
                    </div>

                    {/* =================================================
                        PRODUCT RESULTS
                    ================================================= */}

                    {!isUser &&
                      message.products?.length >
                        0 && (
                        <div className="mt-4 w-full">
                          <ResultsGrid
                            products={
                              message.products
                            }
                            userRequest={
                              message.userRequest ||
                              ""
                            }
                          />
                        </div>
                      )}

                  </div>
                </div>
              );
            }
          )}

          {/* =================================================
              THINKING INDICATOR
          ================================================= */}

          {loading && (
            <div className="mb-5 flex items-start gap-2.5">

              <div className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full border border-[#d4af37]/20 bg-[#151209] text-[14px] text-[#d4af37]">
                ✦
              </div>

              <div className="inline-flex items-center gap-2.5 rounded-[7px_18px_18px_18px] border border-white/[0.06] bg-[#111111] px-4 py-[13px] text-[14px] text-[#9c978e]">

                <span>
                  VASTRA is thinking
                </span>

                <span
                  className="inline-flex gap-1"
                  aria-hidden="true"
                >
                  <span className="vastra-dot" />
                  <span className="vastra-dot" />
                  <span className="vastra-dot" />
                </span>

              </div>
            </div>
          )}

        </section>

        {/* ===================================================
            INPUT
        =================================================== */}

        <div className="flex-none pb-5 pt-2">

          <form
            onSubmit={
              handleSubmit
            }
            className="flex min-h-[62px] w-full items-center gap-2.5 rounded-[20px] border border-white/[0.07] bg-[#0d0d0d] px-[18px] py-[7px] shadow-[0_16px_45px_rgba(0,0,0,.3)] focus-within:border-[#d4af37]/35"
          >

            <input
              ref={
                inputRef
              }
              type="text"
              value={
                input
              }
              onChange={(
                event
              ) =>
                setInput(
                  event.target.value
                )
              }
              onKeyDown={
                handleKeyDown
              }
              placeholder="Tell VASTRA what you're looking for..."
              disabled={
                loading
              }
              className="min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-[15px] text-[#eeebe3] outline-none placeholder:text-[#67645f]"
              aria-label="Ask VASTRA"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !input.trim()
              }
              aria-label="Send message"
              className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#a7831c] text-[19px] text-black transition hover:scale-[1.03] disabled:cursor-default disabled:opacity-40"
            >
              ➤
            </button>

          </form>

          <div className="pt-2 text-center text-[10px] tracking-[.04em] text-[#4e4b46]">
            VASTRA Personal Stylist
          </div>

        </div>

      </main>

    </div>
  );
}

export default Chat;