import { createServer } from "./server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";
import logger from "./logs.js";


// Parse command line arguments, check for debug flag
export const isDebugMode = process.argv.includes("--debug");
export const isSSE = process.argv.includes("--sse");
const app = express();
const server = createServer();


/**
 * Start the server
 */
async function main_stdio() {
    logger.info("[Setup] Initializing FreeSWITCH MCP server...");
   
    const transport = new StdioServerTransport();
    await server.connect(transport);
    logger.info("[Setup] Server started");
}

async function main_sse() {

    let transport = SSEServerTransport;

    app.get("/sse", (req, res) => {
        logger.info("[sse] SSE connection established");
        transport = new SSEServerTransport("/messages", res);
        server.connect(transport);
    });

    app.post("/messages", (req, res) => {
        if (transport) {
            // debug only
            //logger.info("######[messages] Message received", req, res);
            transport.handlePostMessage(req, res);
        }
    });

    app.listen(3000);
    logger.info("[Setup] Server started");
}

async function main() {
    if (isSSE) {
        main_sse();
    } else {
        main_stdio();
    }
}

await main().catch((error) => {
    logger.error(`[Error] Server error: ${error}`);
    process.exit(1);
});