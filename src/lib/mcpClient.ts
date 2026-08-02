// Thin browser-side client for invoking this app's public MCP tools.
// The MCP edge function exposes a REST-style shortcut at
// /.mcp/invoke-tool/<tool> that accepts the tool arguments as the JSON body.

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mcp`;

export interface McpToolResult<T> {
  content?: Array<{ type: string; text?: string }>;
  structuredContent?: T;
  isError?: boolean;
}

export class McpToolError extends Error {}

export async function invokeMcpTool<T>(
  toolName: string,
  args: Record<string, unknown>,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${FUNCTIONS_BASE}/.mcp/invoke-tool/${toolName}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify(args),
    signal,
  });

  if (!response.ok) {
    throw new McpToolError(`MCP tool "${toolName}" failed with status ${response.status}`);
  }

  const result = (await response.json()) as McpToolResult<T>;

  if (result.isError) {
    const message = result.content?.find((c) => c.type === 'text')?.text;
    throw new McpToolError(message || `MCP tool "${toolName}" returned an error`);
  }

  if (result.structuredContent) return result.structuredContent;

  // Fall back to parsing the text payload when structuredContent is absent.
  const text = result.content?.find((c) => c.type === 'text')?.text;
  if (text) {
    try {
      return JSON.parse(text) as T;
    } catch {
      throw new McpToolError(`MCP tool "${toolName}" returned an unparsable payload`);
    }
  }

  throw new McpToolError(`MCP tool "${toolName}" returned no content`);
}
