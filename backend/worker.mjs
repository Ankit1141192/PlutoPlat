import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = 3000;
app.listen(PORT);

const handler = httpServerHandler({ port: PORT });

export default {
  async fetch(request, env, ctx) {
    if (env) {
      for (const [key, value] of Object.entries(env)) {
        if (typeof value === "string") {
          process.env[key] = value;
        }
      }
    }

    try {
      await connectDB();
    } catch (err) {
      console.error("[Database Error] Cloudflare Worker DB connection failed:", err.message);
    }

    return handler.fetch(request, env, ctx);
  },
};
