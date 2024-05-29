import moment from 'moment';
import * as winston from 'winston';
import chalk from 'chalk';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

const FORMAT_DATETIME = 'DD-MM-YYYY HH:mm:ss';

// Define a custom log format with syntax highlighting for the console
const consoleFormat = winston.format.printf((info) => {
  const { level, timestamp, errors, message } = info;
  const color = level === 'error' ? '#ee0002' : '#e1a20f';
  const datetime = moment(new Date()).format(FORMAT_DATETIME);
  const formattedTimestamp = chalk.hex(color).bold(`[${datetime}]`);
  const formattedLevel = chalk.hex(color).bold(level.toLocaleUpperCase());
  let logMessage = `${formattedTimestamp} [${formattedLevel}]: `;
  if (level === 'error' && errors) {
    (errors ?? []).forEach((err: any, index: number) => {
      let m = `\n${index + 1}: - message: ${err?.message || ''}`;
      m += `\n   - path: ${err?.path ?? ''}`;
      m += `\n   - extension code: ${err?.extensions?.code ?? ''}`;
      logMessage += chalk.hex(color)(m);
    });
  } else {
    logMessage += chalk.hex(color).bold(message);
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
    const { req, user } = context || {};
    const { body, headers } = req || {};
    let { query, variables } = body || {};
    formatLog += `\n[userId]: ${user?.id ?? ''}`;
    formatLog += `\n[ip]: ${req?.ip ?? ''}`;
    formatLog += `\n[user-agent]: ${headers?.['user-agent'] ?? ''}`;
    formatLog += `\n[query]: ${query ?? ''}`;
    formatLog += `\n[variables]: ${JSON.stringify(variables ?? '')}`;
    formatLog += `\n[errors]:`;
    errors.forEach((err: any, index: number) => {
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
