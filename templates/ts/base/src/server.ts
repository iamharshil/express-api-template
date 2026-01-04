
import { env } from './config/env';
import app from './app';
import { Bootstrap } from './config/bootstrap';

// Bootstrap (Wiring)
Bootstrap.init(app).then(() => {
    console.log('Bootstrap completed');

    app.listen(env.PORT, () => {
        console.log(`Server running on port ${env.PORT}`);
    });
}).catch(err => {
    console.error('Bootstrap failed', err);
    process.exit(1);
});
