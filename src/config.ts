const env = {
  logLevel: process.env.LOG_LEVEL || "info",
  logData: process.env.LOG_DATA === "true",
}

export { env }
