// backend/middleware/authMiddleware.js
import { findOne } from "backend/models/User";

async function ensureVerified(req, res, next) {
  const { email } = req.body; // we'll pass email in API requests
  if (!email) return res.status(400).json({ error: "Email required" });

  const user = await findOne({ email });
  if (!user || !user.verified) {
    return res.status(403).json({ error: "User not verified" });
  }

  req.user = user; // attach to request
  next();
}

export default ensureVerified;
