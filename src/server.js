import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import publicRoutes from './routes/public.routes.js';
import authRoutes from './routes/auth.routes.js';
import protectedRoutes from './routes/protected.routes.js';
import { swaggerUi, swaggerDocument } from './config/swagger.js';

const app = express();
app.use(express.json());
app.use(morgan('dev'));

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => res.status(200).json({ message: 'Hello World!' }));
app.use('/public', publicRoutes);
app.use('/auth', authRoutes);
app.use('/protected', protectedRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
