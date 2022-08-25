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