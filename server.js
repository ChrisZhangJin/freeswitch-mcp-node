import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
  } from "@modelcontextprotocol/sdk/types.js";
import { tools, toolHandlers } from "./tools/index.js";
import logger from './logs.js';

export function createServer() {
    // Initialize FastMCP server
    const server = new Server(
        {
            name: "freeswitch-mcp",
            version: "1.0.0"
        },
        {
            capabilities: {
                tools: {},
            }
        }
    );

    server.setRequestHandler(ListToolsRequestSchema, async () => {
        logger.info("[ListToolsRequest] List available tools ", tools);
        return {
          tools,
        };
      });

    /**
     * Handle tool call requests
     * Dispatch to the appropriate tool implementation
     */
    server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        const handler = toolHandlers[toolName];

        if (!handler) {
            throw new Error(`Unknown tool: ${toolName}`);
        }

        logger.debug("[CallToolRequest]request.params", request.params)
        return handler(request.params.arguments);
    });

    return server;
};





