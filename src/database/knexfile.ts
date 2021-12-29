import dotenv from 'dotenv';

import 'ts-node/register';

dotenv.config({
  path: '../../.env',
});

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.POSTRGRES_HOSTNAME,
      database: process.env.POSTGRES_DB,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
    },
    migrations: {
      extension: 'ts',
      directory: [
        'src/infrastructure/migrations/platform-access',
        'src/infrastructure/migrations/krater',
      ],
    },
    seeds: {
      directory: ['src/infrastructure/seeds'],
    },
  },
};
