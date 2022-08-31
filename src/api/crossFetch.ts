interface RequestMessageEvent {
  type: "request",
  url: string
}
interface ResponseMessageEvent {
  type: "response",
  url: string,
  text: string,
  headers: Map<string, string>,
  status: Response["status"]
}
  
export const crossFetch: typeof fetch = (input): Promise<Response> => {
  if (typeof input !== "string") {
    throw new Error();
  }
  const url = input;
  return new Promise<Response>((resolve, reject) => {
    function listener(event: MessageEvent<ResponseMessageEvent>): void {
      if (event.data.type === "response") {
        if (event.data.url === url) {
          // todo: if fetch failed, we should reject the promise
          window.removeEventListener("message", listener);
          const { text, headers, status } = event.data;
          // fixme?: what url will the response have? can that cause trouble?
          const response = new Response(
            text, { "status": status, "headers": new Headers(Array.from(headers)) }
          );
          Object.defineProperty(response, "url", { value: "foobar" });  
          resolve(response);
        }      
      }
    }
    window.addEventListener("message", listener);
    const message: RequestMessageEvent = {
      type: "request",
      url
    }
    window.parent.postMessage(
      message,
      "*"
    );
  });
}

export function getRequestMessageListener(
  fetchFn: typeof fetch,
  window: Window
): (event: MessageEvent<RequestMessageEvent>) => void {
  return async (event) => {
    // if (event.origin !== "https://example.org:8080") return;
    if (event.data.type === "request" ) {
      const { url } = event.data;
      // todo: return an error message in case of error
      const response = await fetchFn(url);
      const text = await response.text();
      const headers = new Map(response.headers);
  
      window.postMessage(
        {
          type: "response",
          url,
          text,
          headers,
          status: response.status
        },
        "*"    
        // event.origin
      )
    }  
  }
}
