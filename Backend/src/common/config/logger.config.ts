import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

const logLevel = process.env.LOG_LEVEL; // Level of logs from the environment

export const winstonConfig: WinstonModuleOptions = {
  level: logLevel,
  transports: [
    // Console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const ip = meta.ip ? `IP: ${meta.ip}` : '';
          const method = meta.method ? `Method: ${meta.method}` : '';
          const path = meta.path ? `Path: ${meta.path}` : '';
          return `${timestamp} [${level}]: ${message} ${ip} ${method} ${path} ${JSON.stringify(meta)}`;
        }),
      ),
    }),
  ],
};
