import { z } from "zod";
import { playgroundFormSchema } from "~/lib/playground-form-schema";

import { generateResponses } from "./generate-responses";

type RequestData = z.infer<typeof playgroundFormSchema> & {
  paths?: string[];
  variables?: Record<string, string>;
  stream?: boolean;
};
type ResponseData = any[];

export async function POST(request: Request) {
  const data: RequestData = await request.json();
  const responseData: ResponseData = [];

  const shouldStream = data.stream ?? true;

  if (shouldStream) {
    const encoder = new TextEncoder();
    const customReadable = new ReadableStream({
      async start(controller) {
        for await (const obj of generateResponses(data.input, data.paths, data.variables)) {
          controller.enqueue(encoder.encode(JSON.stringify(obj)));
          responseData.push(obj);
        }
        controller.close();
      },
    });

    return new Response(customReadable, {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  } else {
    for await (const obj of generateResponses(data.input, data.paths, data.variables)) {
      responseData.push(obj);
    }

    const lastOutput = responseData[responseData.length - 1];
    return new Response(JSON.stringify(lastOutput), {
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  }
}
