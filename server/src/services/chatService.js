const Chat = require("../models/Chat");
const Message = require("../models/Message");

// 5. Mesaj Gönderme (POST /chats/{chatId}/messages)
exports.sendMessage = async ({ chatId, senderId, content }) => {
  // Yeni mesajı oluştur
  const message = await Message.create({
    chatId,
    senderId,
    content,
    sentAt: Date.now()
  });

  // Mesaj gönderildiğinde, ilgili sohbetin (Chat) 'lastMessage' bilgisini güncelle
  await Chat.findByIdAndUpdate(chatId, { 
    lastMessage: message._id, 
    updatedAt: Date.now() 
  });

  return message;
};

// 6. Sohbet Listeleme (GET /chats)
exports.listChats = async (userId) => {
  // Giriş yapmış kullanıcının (userId) katılımcısı olduğu tüm sohbetleri getir
  return await Chat.find({ participants: userId })
    .populate('lastMessage') // Son mesajın detaylarını da modele dahil et
    .sort({ updatedAt: -1 }); // En son mesajlaşılan sohbet en üstte olsun
};

// Ekstra Yardımcı: Belirli bir sohbetin içindeki mesajları listeleme (GET /chats/{chatId}/messages)
exports.listMessages = async (chatId, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const [messages, total] = await Promise.all([
    Message.find({ chatId }).skip(skip).limit(limit).sort({ sentAt: -1 }),
    Message.countDocuments({ chatId })
  ]);
  return { messages, total, page, limit, totalPages: Math.ceil(total / limit) };
};