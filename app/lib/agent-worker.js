const { parentPort, workerData } = require("worker_threads");
const { spawn } = require("child_process");

function startWorker() {
  const { codingAgentCli, systemPrompt, workDir } = workerData;

  const args = ["--yolo", "-p", `"${systemPrompt}"`];
  console.log(workerData);

  try {
    const child = spawn(codingAgentCli, args, {
      cwd: workDir,
      shell: true,
    });

    child.stdout.on("data", (data) => {
      if (parentPort) {
        parentPort.postMessage({ type: "log", payload: data.toString() });
      }
    });

    child.stderr.on("data", (data) => {
      if (parentPort) {
        parentPort.postMessage({ type: "log", payload: data.toString() });
      }
    });

    child.on("error", (err) => {
      if (parentPort) {
        parentPort.postMessage({
          type: "log",
          payload: `Failed to start process: ${err.message}\n`,
        });
        parentPort.postMessage({ type: "status", payload: "error" });
      }
    });

    child.on("close", (code) => {
      if (parentPort) {
        parentPort.postMessage({
          type: "log",
          payload: `Process exited with code ${code}\n`,
        });
        parentPort.postMessage({
          type: "status",
          payload: code === 0 ? "finished" : "error",
        });
      }
    });
  } catch (error) {
    if (parentPort) {
      parentPort.postMessage({
        type: "log",
        payload: `Worker exception: ${error.message}\n`,
      });
      parentPort.postMessage({ type: "status", payload: "error" });
    }
  }
}

startWorker();
