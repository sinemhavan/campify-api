const postService = require('../services/postService');

// 1. Gönderi Oluşturma
exports.createPost = async (req, res) => {
  try {
    // Şimdilik userId'yi body'den alıyoruz, ileride Auth eklendiğinde req.user.id olacak
    const { title, content, tags, userId } = req.body; 
    
    const newPost = await postService.createPost({ title, content, tags, userId });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 2. Gönderi Listeleme
exports.listPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await postService.listPosts(page, limit);
    res.status(200).json(result.posts); // API dökümanına göre sadece array dönebiliriz veya tüm result'ı dönebilirsin
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 3. Gönderi Güncelleme
exports.updatePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, tags } = req.body;

    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Gönderi bulunamadı" });
    }

    const updatedPost = await postService.updatePost(post, { title, content, tags });
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};

// 4. Gönderi Silme
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ code: "NOT_FOUND", message: "Gönderi bulunamadı" });
    }

    await postService.deletePost(post);
    res.status(204).send(); // 204 No Content genelde body döndürmez
  } catch (error) {
    res.status(400).json({ code: "BAD_REQUEST", message: error.message });
  }
};