
import { env } from './config/env';
import app from './app';
import { setup } from './config/setup';

// Setup (Wiring)
setup().then(() => {
    console.log('Setup completed');

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
}).catch((err: unknown) => {
    console.error('Setup failed', err);
    process.exit(1);
});
