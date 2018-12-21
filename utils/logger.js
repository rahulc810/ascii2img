const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });
  
const logger = createLogger({
    format: combine(
        label({ label: 'dev' }),
        timestamp(),
        logFormat
      ),
    transports: [new transports.Console()]
});

module.exports = logger;