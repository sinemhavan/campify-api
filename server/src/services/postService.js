const Post = require("../models/Post");

// 1. Gönderi Oluşturma (POST /posts)
exports.createPost = async ({ title, content, tags, userId }) => {
  return await Post.create({
    title,
    content,
    tags,
    userId
  });
};

// 2. Gönderi Listeleme (GET /posts)
exports.listPosts = async (page = 1, limit = 10, filters = {}) => {
  const skip = (page - 1) * limit;
  const [posts, total] = await Promise.all([
    Post.find(filters).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Post.countDocuments(filters)
  ]);
  return { posts, total, page, limit, totalPages: Math.ceil(total / limit) };
};

// Tekil gönderi getirme (Güncelleme ve Silme öncesi kontrol için yardımcı fonksiyon)
exports.getPostById = async (postId) => {
  return await Post.findById(postId);
};

// 3. Gönderi Güncelleme (PUT /posts/{postId})
exports.updatePost = async (post, { title, content, tags }) => {
  // Sadece gelen alanları güncelle
  if (title) post.title = title;
  if (content) post.content = content;
  if (tags) post.tags = tags;
  
  // Güncellenme tarihini API dökümanına uygun şekilde tetikle
  post.updatedAt = Date.now();
  
  return await post.save();
};

// 4. Gönderi Silme (DELETE /posts/{postId})
exports.deletePost = async (post) => {
  return await post.deleteOne();
};