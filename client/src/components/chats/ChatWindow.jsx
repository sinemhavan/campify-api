import { useState, useRef, useEffect } from "react";
import { sendMessage } from "../../services/chatService";
import styles from "./ChatWindow.module.css";

/**
 * ChatWindow
 * Props:
 *   chat      – seçili sohbet odası nesnesi ({ _id, name, ... })
 *   messages  – o odaya ait mesaj dizisi
 *   setMessages – mesajları güncellemek için setter
 */
export default function ChatWindow({ chat, messages, setMessages }) {
  const [inputText, setInputText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!chat) {
    return (
      <div className={styles.placeholder}>
        <p>💬 Mesajlaşmaya başlamak için bir sohbet seç</p>
      </div>
    );
  }

  const handleSend = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || sending) return;

    // Optimistic update — API cevabını beklemeden mesajı ekrana yaz
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      content: text,
      sender: "me",
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInputText("");

    try {
      setSending(true);
      const result = await sendMessage(chat._id, text);
      // API gerçek mesajı döndürürse optimistic mesajı değiştir
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempId ? { ...result, sender: "me" } : m
        )
      );
    } catch {
      // Hata olursa optimistic mesajı geri al
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      alert("Mesaj gönderilemedi.");
    } finally {
      setSending(false);
    }
  };

  const chatName = chat.name || `Sohbet #${chat._id.slice(-4)}`;

  return (
    <div className={styles.window}>
      {/* Üst bar */}
      <div className={styles.topBar}>
        <div className={styles.avatar}>{chatName[0].toUpperCase()}</div>
        <div>
          <p className={styles.topName}>{chatName}</p>
          <p className={styles.topId}>ID: {chat._id}</p>
        </div>
      </div>

      {/* Mesaj alanı */}
      <div className={styles.messagesArea}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>
            <p>Mesaj gönder ve konuşmayı başlat! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`${styles.message} ${
                msg.sender === "me" ? styles.msgMe : styles.msgOther
              } ${msg.isOptimistic ? styles.optimistic : ""}`}
            >
              <span className={styles.msgContent}>{msg.content}</span>
              <span className={styles.msgTime}>
                {new Date(msg.createdAt).toLocaleTimeString("tr-TR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input alanı */}
      <form className={styles.inputArea} onSubmit={handleSend}>
        <input
          className={styles.msgInput}
          type="text"
          placeholder="Mesaj yaz..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={sending}
        />
        <button
          type="submit"
          className={styles.sendBtn}
          disabled={!inputText.trim() || sending}
        >
          {sending ? "..." : "Gönder →"}
        </button>
      </form>
    </div>
  );
}