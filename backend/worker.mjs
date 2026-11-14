import { httpServerHandler } from "cloudflare:node";
import app from "./app.js";
import connectDB from "./config/db.js";
import domainSecurity from "./middlewares/domainSecurity.js";

const { isOriginAllowed } = domainSecurity;

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

    const origin = request.headers.get("Origin");
    const allowed = origin && isOriginAllowed(origin);

    // 1. Handle CORS preflight explicitly at edge
    if (request.method === "OPTIONS") {
      if (allowed) {
        const reqHeaders =
          request.headers.get("Access-Control-Request-Headers") ||
          "Content-Type, Authorization, X-Requested-With, Origin, Accept";
        return new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": reqHeaders,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Max-Age": "86400",
          },
        });
      }
      return new Response(`Blocked by CORS: Origin '${origin}' is not authorized.`, {
        status: 403,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // 2. Connect DB
    try {
      await connectDB();
    } catch (err) {
      console.error("[Database Error] Cloudflare Worker DB connection failed:", err.message);
    }

    // 4. Process Request via Express
    try {
      const response = await handler.fetch(request, env, ctx);

      // Ensure CORS headers are attached on all responses if origin is authorized
      if (allowed) {
        const newHeaders = new Headers(response.headers);
        newHeaders.set("Access-Control-Allow-Origin", origin);
        newHeaders.set("Access-Control-Allow-Credentials", "true");
        const body = response.status === 204 || response.status === 304 ? null : response.body;
        return new Response(body, {
          status: response.status,
          headers: newHeaders,
        });
      }

      return response;
    } catch (err) {
      console.error("[Worker Runtime Error]", err);
      const headers = {
        "Content-Type": "application/json",
      };
      if (allowed) {
        headers["Access-Control-Allow-Origin"] = origin;
        headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, PATCH, DELETE, OPTIONS";
        headers["Access-Control-Allow-Headers"] = "*";
        headers["Access-Control-Allow-Credentials"] = "true";
      }
      return new Response(
        JSON.stringify({
          success: false,
          message: err.message || "Internal Server Error in Worker execution.",
        }),
        {
          status: 500,
          headers,
        }
      );
    }
  },
};
