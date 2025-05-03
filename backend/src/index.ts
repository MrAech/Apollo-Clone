import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database';
import doctorRoutes from './routes/doctorRoutes';


dotenv.config();


const app: Express = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


testConnection().then((connected) => {
  if (!connected) {
    console.error('Failed to connect to the database. Exiting...');
    process.exit(1);
  }
});


app.use('/api/doctors', doctorRoutes);


app.get('/', (req, res) => {
  res.send('Apollo 247 Clone API is running');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
