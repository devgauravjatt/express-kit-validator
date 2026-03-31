import express from 'express';
import appRouteRouter from './routes/app-route';
import validateRequestRouter from './routes/validate-route';

const app = express();
app.use(express.json());

app.use('/app-route', appRouteRouter);

app.use('/validate-request', validateRequestRouter);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

export default app;
