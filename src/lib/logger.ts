import pino from 'pino';

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
//   transport: {
//     target: 'pino-pretty', // 開発用に見やすくする
//     options: {
//       colorize: true
//     }
//   }
});