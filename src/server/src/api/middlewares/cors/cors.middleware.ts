import cors from 'cors';

const WHITE_LIST: string[] | RegExp[] = process.env.CORS_WHITE_LIST
  ? process.env.CORS_WHITE_LIST.split(' ')
  : [];

export const corsOptions: cors.CorsOptions = {
  origin: process.env.NODE_ENV === 'production' ? WHITE_LIST : [/localhost/],
  credentials: true,
  exposedHeaders: ['X-AUTH-TOKEN'],
};

export default cors(corsOptions);
