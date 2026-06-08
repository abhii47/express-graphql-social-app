import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10, 
    message: {
        errors: [{
            message: "Too many requests, please try again later",
        }]
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});