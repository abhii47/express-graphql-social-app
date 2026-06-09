import winston from "winston";

const logger = winston.createLogger({
    level:'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),    
    ),
    transports:[
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple(),
            )
        }),
        new winston.transports.File({ 
            filename: "logs/error.log", 
            level: "warn" 
        }),
        new winston.transports.File({ 
            filename: "logs/combined.log" 
        })
    ]
});

export const httpLogger = (req: any, res: any, next: any) => {
    const start = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(`${req.method} ${req.originalUrl}`, {
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
        });
    });
    next();
};

export default logger;