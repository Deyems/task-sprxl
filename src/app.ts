import express, {Express, Request, Response, NextFunction} from "express";
import { logger, stream } from "./common/utils/logger";
import routes from "./routes"
import helmet, { HelmetOptions } from 'helmet';
import cookieParser from "cookie-parser";
//@ts-ignore
import xss from 'xss-clean';
import hpp from "hpp";
import cors from "cors";
import compression from "compression";
import rateLimit from 'express-rate-limit';
import morgan from "morgan";
import helmetCsp from 'helmet-csp';
import http from 'http';
import { ENVIRONMENT } from "./common/config/environment";
import errorHandler from "./errorHandler";



/**
 * Default app configurations
 */
const app: Express = express();
const port = ENVIRONMENT.APP.PORT;
const appName = ENVIRONMENT.APP.NAME;


/**
 *  uncaughtException handler
 */
process.on('uncaughtException', async (error: Error) => {
    console.error(error.name, error.message, 'UNCAUGHT EXCEPTION! 💥 Server Shutting down...');
    logger.error('UNCAUGHT EXCEPTION!! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
    process.exit(1);
});

app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

/**
 * Compression Middleware
 */
app.use(compression());

// Rate limiter middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

app.use(limiter);

//Middleware to allow CORS from frontend
app.use(
    cors({
        origin: ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        credentials: true,
    })
);
//Configure Content Security Policy (CSP)
const contentSecurityPolicy = {
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://ajax.googleapis.com'], // TODO: change this to your frontend url, scripts and other trusted sources
        styleSrc: ["'self'", 'trusted-cdn.com', "'unsafe-inline'"], // TODO: change this to your frontend url, styles and other trusted sources
        imgSrc: ["'self'", 's3-bucket-url', 'data:'], // TODO: change this to your frontend url, images and other trusted sources
        frameAncestors: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: "'self'",
    },
};

// Use Helmet middleware for security headers
app.use(
    helmet({
        contentSecurityPolicy: false, // Disable the default CSP middleware
    })
);

// Use helmet-csp middleware for Content Security Policy
app.use(helmetCsp(contentSecurityPolicy));

const helmetConfig: HelmetOptions = {
    // X-Frame-Options header to prevent clickjacking
    frameguard: { action: 'deny' },
    // X-XSS-Protection header to enable browser's built-in XSS protection
    xssFilter: true,
    // Referrer-Policy header
    referrerPolicy: { policy: 'same-origin' },
    // Strict-Transport-Security (HSTS) header for HTTPS enforcement
    hsts: { maxAge: 15552000, includeSubDomains: true, preload: true },
};

app.use(helmet(helmetConfig));

//Secure cookies and other helmet-related configurations
app.use(helmet.hidePoweredBy());
app.use(helmet.noSniff());
app.use(helmet.ieNoOpen());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.permittedCrossDomainPolicies());

// Prevent browser from caching sensitive information
app.use((_req: Request, res:Response, next:NextFunction) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

app.use(xss());

// Prevent parameter pollution
app.use(
    hpp({
        whitelist: ['date', 'createdAt'], // whitelist some parameters
    })
);

/**
 * Logger Middleware
 */
app.use(morgan(ENVIRONMENT.APP.ENV !== 'development' ? 'combined' : 'dev', { stream }));
// Add request time to req object
app.use((req: Request, _res: Response, next: NextFunction) => {
    // @ts-ignore
    req['requestTime'] = new Date().toISOString();
    next();
});


//Declard your routes entry here
app.use("/api/v1", routes);


app.all('/*', async (req, res) => {
    logger.error('route not found ' + new Date(Date.now()) + ' ' + req.originalUrl);
    res.status(404).json({
        status: 'error',
        message: `OOPs!! No handler defined for ${req.method.toUpperCase()}: ${req.url
            } route. Check the API documentation for more details.`,
    });
});

/**
 * status check
 */
app.get('*', (_req: Request, res: Response) =>
    res.send({
        Time: new Date(),
        status: 'Up and running',
    })
);

app.use(errorHandler);


// Create Server.
const server = http.createServer(app);

// Listen on a PORT
const appServer = server.listen(port, async () => {
    console.log('=> ' + appName + ' app listening on port ' + port + '!');
    logger.info('=> ' + appName + ' app listening on port ' + port + '!');
});

// Unhandled Rejection.
process.on('unhandledRejection', async (error: Error) => {
    console.error(error.name, error.message, 'UNHANDLED REJECTION! 💥 Server Shutting down...');
    logger.error('UNHANDLED REJECTION! 💥 Server Shutting down... ' + new Date(Date.now()) + error.name, error.message);
    appServer.close(() => {
        process.exit(1);
    });
});

