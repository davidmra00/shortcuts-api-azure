import { app } from '@azure/functions';
import { AppDataSource } from './db/data_source';

AppDataSource.initialize()
    .then(() => {
        console.log('Data Source has been initialized!');
    })
    .catch((err) => {
        console.error('Error during Data Source initialization:', err);
    });

app.setup({
    enableHttpStream: true,
});
