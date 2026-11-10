import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
import connectDB from "./config/db.js";

// Guard against unhandled promise rejections crashing worker isolate
if (typeof process !== "undefined" && process.on) {
  process.on("unhandledRejection", (reason) => {
    console.error("[Worker Unhandled Rejection]:", reason);
  });
  process.on("uncaughtException", (err) => {
    console.error("[Worker Uncaught Exception]:", err);
  });
}

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

    // Handle CORS preflight explicitly at edge if needed
    if (request.method === "OPTIONS") {
      const origin = request.headers.get("Origin") || "*";
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin, Accept",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    try {
      await connectDB();
    } catch (err) {
      console.error("[Database Error] Cloudflare Worker DB connection failed:", err.message);
    }

    try {
      const response = await handler.fetch(request, env, ctx);
      return response;
    } catch (err) {
      console.error("[Worker Runtime Error]", err);
      const origin = request.headers.get("Origin") || "*";
      return new Response(
        JSON.stringify({
          success: false,
          message: err.message || "Internal Server Error in Worker execution.",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Origin, Accept",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }
  },
};
