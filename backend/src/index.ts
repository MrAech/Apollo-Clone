import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { testConnection } from './config/database';
import doctorRoutes from './routes/doctorRoutes';


dotenv.config();


const app: Express = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;


app.use(cors({
  origin: ['https://apollo-clone-23w1.onrender.com', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


testConnection().then((connected) => {
  if (!connected) {
    console.error('Failed to connect to the database. Exiting...');
    process.exit(1);
  }
});


app.use('/api/doctors', doctorRoutes);


// API test route
app.get('/api', (req, res) => {
  res.send('Apollo 247 Clone API is running');
});

const FRONTEND_OUT_PATH = path.join(__dirname, '../../../frontend/out');

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(FRONTEND_OUT_PATH));

  app.get('*', (req, res) => {

    if (req.path.startsWith('/api/')) {
      return;
    }
    

    let filePath = path.join(FRONTEND_OUT_PATH, req.path);
    

    if (req.path.endsWith('/')) {
      filePath = path.join(filePath, 'index.html');
    } 

    else if (!filePath.endsWith('.html')) {
      filePath += '.html';
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        res.sendFile(path.join(FRONTEND_OUT_PATH, 'index.html'));
      }
    });
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Access the application at the deployed URL`);
});
