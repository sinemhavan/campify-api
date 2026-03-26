import styles from "./ChatList.module.css";

/**
 * ChatList
 * Props:
 *   chats          – sohbet odaları dizisi
 *   selectedChatId – seçili odanın _id'si
 *   onSelect       – bir sohbete tıklandığında çağrılır
 */
export default function ChatList({ chats, selectedChatId, onSelect }) {
  if (chats.length === 0) {
    return <p className={styles.empty}>Henüz sohbet yok.</p>;
  }

  return (
    <ul className={styles.list}>
      {chats.map((chat) => {
        const name = chat.name || `Sohbet #${chat._id.slice(-4)}`;
        const initial = name[0].toUpperCase();
        const isActive = chat._id === selectedChatId;

        return (
          <li key={chat._id}>
            <button
              className={`${styles.item} ${isActive ? styles.active : ""}`}
              onClick={() => onSelect(chat)}
            >
              <div className={styles.avatar}>{initial}</div>
              <div className={styles.meta}>
                <span className={styles.name}>{name}</span>
                {chat.lastMessage && (
                  <span className={styles.lastMsg}>{chat.lastMessage}</span>
                )}
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}