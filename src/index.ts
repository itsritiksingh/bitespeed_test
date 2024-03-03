import dotenv from 'dotenv'
dotenv.config()

import express from 'express';
import identifyRoutes from './routes/identify';
import pool from './db'

const app = express();

app.use(express.json());
app.use('/identify',identifyRoutes);


async function startServer() {
  try {
    await pool.sync({ force: false });
    console.log('Database synchronized successfully.');

    // Start the Express server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
}

startServer();