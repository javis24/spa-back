import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import connectSessionSequelize from 'connect-session-sequelize';

import UserRoute from './routes/UserRoute.js';
import TratamientosEsteticosRoute from './routes/TratamientosEsteticosRoute.js';
import MetricasSaludRoute from './routes/MetricasSaludRoute.js';
import CitasRoute from './routes/CitasRoute.js';
import PacienteRoute from './routes/PacienteRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import RegistroAsistenciaRoute from './routes/RegistroAsistenciaRoute.js';
import AbonoSemanalRoute from './routes/AbonoSemanalRoute.js';

dotenv.config();

const app = express();
app.set('trust proxy', 1); 


const SequelizeStore = connectSessionSequelize(session.Store);
const store = new SequelizeStore({ db });

const allowlist = new Set([
  'https://siluetteplusjc.com',
  'https://www.siluetteplusjc.com',
  'http://localhost:3000', 

]);

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowlist.has(origin)) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); 

app.use(express.json());

app.use(session({
  name: 'sid',
  secret: process.env.SESS_SECRET || 'change-me',
  resave: false,
  saveUninitialized: false,
  store,
  cookie: {
    httpOnly: true,
    secure: true,     
    sameSite: 'none',   
    maxAge: 7 * 24 * 60 * 60 * 1000,

  }
}));

// Rutas
app.use('/api', UserRoute);
app.use('/api', TratamientosEsteticosRoute);
app.use('/api', MetricasSaludRoute);
app.use('/api', CitasRoute);
app.use('/api', PacienteRoute);
app.use('/api', AuthRoute);
app.use('/api', RegistroAsistenciaRoute);
app.use('/api', AbonoSemanalRoute);

export default app; 
