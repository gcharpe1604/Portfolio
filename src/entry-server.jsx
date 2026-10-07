import { PassThrough } from "node:stream";
import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import App from "./App";

export function render(pathname) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    let html = "";
    let error;
    output.setEncoding("utf8");
    output.on("data", (chunk) => {
      html += chunk;
    });
    output.on("error", reject);
    output.on("end", () => (error ? reject(error) : resolve(html)));
    const stream = renderToPipeableStream(
      <StrictMode>
        <StaticRouter location={pathname}>
          <App />
        </StaticRouter>
      </StrictMode>,
      {
        onAllReady() {
          stream.pipe(output);
        },
        onShellError: reject,
        onError(cause) {
          error = cause;
        },
      },
    );
  });
}
