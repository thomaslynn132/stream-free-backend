import Like from "../model/likeModel.js";
//! Post Request
export async function like(req, res) {
  const { userId, media } = req.body;
  try {
    const existingLike = await Like.findOne({ userId, media });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "You have already liked this media" });
    }

    const like = new Like({ userId, media });
    await like.save();
    res.status(201).json({ message: "Liked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "failed to like" });
  }
}

export async function unlike(req, res) {
  const { userId, media } = req.body;
  try {
    const like = await Like.findOneAndDelete({ userId, media });
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }
    res.status(200).json({ message: "Unliked successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "failed to unlike" });
  }
}

//! Get Request
export async function likeStatus(req, res) {
  const { userId, media } = req.params;
  try {
    const like = await Like.findOne({ userId, media }).select("userId media");
    res.status(200).json({ liked: !!like });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Failed to get like status" });
  }
}

export async function getLikes(req, res) {
  const { media } = req.params;
  try {
    const likes = await Like.find({ media }).select("_id");
    res.status(200).json({ total: likes.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error, message: "Failed to get likes" });
  }
}
