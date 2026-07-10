import { startServer } from "./server";
import { logger } from "./logger";

startServer().catch((err) => {
  logger.error("Failed to start server", { err });
  process.exit(1);
});
