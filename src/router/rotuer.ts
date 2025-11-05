import Controller from "../controller/controller";
import express, { Router, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { middleware as openapiValidator } from 'express-openapi-validator';
import { HttpError } from 'express-openapi-validator/dist/framework/types';
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';

export function startServer(controller: Controller) {
  const app = express();
  const port = process.env.PORT || 3000;

  // --- Swagger UI Setup ---
  const openApiPath = path.resolve(__dirname, '../../openapi.yaml');
  const file = fs.readFileSync(openApiPath, 'utf8');
  const swaggerDocument = YAML.load(file) as Record<string, any>;
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.CORS_ORIGIN 
      : '*',
  };
  app.use(cors(corsOptions));

  app.use(express.static(path.join(__dirname, '..', '..', 'public')));

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // --- OpenAPI Validator Middleware ---
  app.use(
    openapiValidator({
      apiSpec: './openapi.yaml',
      validateRequests: true,
      validateResponses: true, // Responses can be validated as well
    })
  );

  app.use('/api', createRouter(controller));

  // --- OpenAPI Error Handler ---
  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
      message: err.message,
      errors: err.errors,
    });
  });

  const httpServer = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`API docs available at http://localhost:${port}/api-docs`);
  });
}

function createRouter(controller: Controller): Router{
    const router = Router();

    router.get("/images", controller.getProducts.bind(controller));
    router.post("/google-vto", controller.perfromTryOnGoogleVto.bind(controller));
    router.post("/gemini-flash-image", controller.perfromTryOnByGeminiFlashImage.bind(controller));

    return router;
}