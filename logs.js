import  winston from 'winston';

// 创建自定义格式
const customFormat = winston.format.printf(({ level, message, timestamp, ...metadata }) => {
  // 如果有额外的元数据，可以将其附加到消息中
  const meta = JSON.stringify(metadata);
  return `${timestamp}    ${level.toUpperCase()}   ${message}${meta ? ` ${meta}` : ''}`;
});

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DDTHH:mm:ss.SSSZ', // 设置时间戳格式
      }),
      customFormat // 使用自定义格式
    ),
    transports: [
      new winston.transports.File({ filename: 'app.log' }),
      new winston.transports.Console()
    ]
  });

  export default logger;