import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import db from './config/Database.js';
import SequelizeStore from 'connect-session-sequelize';
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

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
  db: db
});

// (async()=>{
  // await db.sync();
// }) ();

app.use(cors({
  origin: 'http://localhost:4321', 
  credentials: true,
}));


app.use(session({
  secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: false,
        sameSite: 'lax', 
    }
}));


app.use(express.json());
app.use('/api', UserRoute);
app.use('/api', TratamientosEsteticosRoute);
app.use('/api', MetricasSaludRoute);
app.use('/api', CitasRoute);
app.use('/api', PacienteRoute);
app.use('/api', AuthRoute);
app.use('/api', RegistroAsistenciaRoute);
app.use('/api', AbonoSemanalRoute);

// store.sync();

app.listen(process.env.APP_PORT, ()=> {
    console.log('Server up and running...');
});
