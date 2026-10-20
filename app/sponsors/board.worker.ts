// Runs the sponsor lanyards' scene off the main thread (see board.ts).
import { createRuntime, type FromWorker, type Runtime, type ToWorker } from "./runtime";

const scope = self as unknown as { postMessage: (message: FromWorker) => void; onmessage: ((event: MessageEvent<ToWorker>) => void) | null };
let runtime: Runtime | undefined;

scope.onmessage = async ({ data }) => {
  if (data.type === "init") {
    try {
      runtime = await createRuntime(data.canvas, data.options, data.assets, data.size, (value) => scope.postMessage({ type: "cursor", value }));
      scope.postMessage({ type: "ready" });
    } catch (error) {
      scope.postMessage({ type: "error", message: String(error) });
    }
  } else if (data.type === "resize") runtime?.resize(data.width, data.height, data.dpr);
  else if (data.type === "pointer") runtime?.pointer(data.input);
  else runtime?.visible(data.on, data.ratio);
};
