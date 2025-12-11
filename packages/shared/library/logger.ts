import moment from 'moment';
import * as winston from 'winston';
import chalk from 'chalk';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const FORMAT_DATETIME = 'DD-MM-YYYY HH:mm:ss';

// Define a custom log format with syntax highlighting for the console
const consoleFormat = winston.format.printf((info) => {
  const { level, timestamp, errors, message } = info;
  let color: string;
  switch (level) {
    case 'error':
      color = '#ee0002';
      break;
    case 'info':
      color = '#0BB976';
      break;
    case 'warn':
      color = '#e1a20f';
      break;
    default:
      color = '#ffffff';
      break;
  }
  const datetime = moment(timestamp as any).format(FORMAT_DATETIME);
  const formattedTimestamp = chalk.hex(color)(`[${datetime}]`);
  const formattedLevel = chalk.hex(color)(level === 'warn' ? 'LOG' : level.toLocaleUpperCase());
  let logMessage = `${formattedTimestamp} [${formattedLevel}]: `;
  if (level === 'error' && errors) {
    ((errors as any[]) ?? []).forEach((err: any, index: number) => {
      let m = `\n${index + 1}: - message: ${err?.message || ''}`;
      m += `\n   - path: ${err?.path ?? ''}`;
      m += `\n   - extension code: ${err?.extensions?.code ?? ''}`;
      logMessage += chalk.hex(color)(m);
    });
  } else {
    logMessage += chalk.hex(color)(message);
  }
  return logMessage;
});

// Define a custom log format
const logFileFormat = winston.format.printf(({ errors, context, message }) => {
  let hyphen = '';
  Array.from({ length: 50 }).map((_) => (hyphen += ' -'));
  const datetime = moment(new Date()).format(FORMAT_DATETIME);
  let formatLog = `[${datetime}] [ERROR]: `;
  if (context && errors) {
    const { req, user } = (context as any) || {};
    const { body, headers } = req || {};
    const { query, variables } = body || {};
    formatLog += `\n[userId]: ${user?.id ?? ''}`;
    formatLog += `\n[ip]: ${req?.ip ?? ''}`;
    formatLog += `\n[user-agent]: ${headers?.['user-agent'] ?? ''}`;
    formatLog += `\n[query]: ${query ?? ''}`;
    formatLog += `\n[variables]: ${JSON.stringify(variables ?? '')}`;
    formatLog += `\n[errors]:`;
    ((errors as any[]) ?? []).forEach((err: any, index: number) => {
      formatLog += `\n(${index + 1}): - message: ${err?.message || ''}`;
      formatLog += `\n     - path: ${err?.path ?? ''}`;
      formatLog += `\n     - extension code: ${err?.extensions?.code ?? ''}`;
    });
    formatLog += `\n${hyphen}`;
    return formatLog;
  }
  formatLog += `${message}\n${hyphen}`;
  return formatLog;
});

// Combine formats for both console and file output
const combinedFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }), // Enable stack traces for errors
  logFileFormat
);

const TransportFile = new winston.transports.File({
  filename: `logs/${new Date().toISOString().slice(0, 10)}.error.log`,
  level: 'error',
  format: combinedFormat
});

export const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }), // Enable stack traces for errors
    winston.format.combine(
      // winston.format.colorize(), // Enable colorization for the console
      consoleFormat
    )
  ),
  transports: [new winston.transports.Console(), TransportFile]
});

export class Logger {
  static error(message: string | unknown, ...args: any) {
    return logger.error(message as any, args);
  }
  static log(message: string, ...args: any) {
    return logger.warn(message, args);
  }
  static info(message: string, ...args: any) {
    return logger.info(message, args);
  }
}
