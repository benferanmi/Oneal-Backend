import morgan from "morgan";
import { logger } from "../logger";

const stream = {
  write: (msg: string) => logger.http ? logger.http(msg.trim()) : logger.info(msg.trim()),
};

export const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);
