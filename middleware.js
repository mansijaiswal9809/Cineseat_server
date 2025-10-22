import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
  const authHeader = req.get("Authorization") || "";
  const tokenFromHeader = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const token = tokenFromHeader || (req.cookies && req.cookies.token);

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // console.log("Verifying token:", token);
    // console.log(process.env.JWT_SECRET);
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "your_secret_key_here"
    );
    // console.log("Authenticated user:", payload);
    req.user = payload;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
