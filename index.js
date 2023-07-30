const Koa = require('koa');
const Router = require('@koa/router');
const { isV4Format } = require('ip');
const logger = require('koa-logger');
const { exec } = require('node:child_process');

const app = new Koa();
const router = new Router();

router.get('/', async (ctx, next) => {
    const { dns, ip, prefer = 'https' } = ctx.request.query;
    if (!dns || !ip) return ctx.throw(422, 'Missing dns or ip', { error: 'Validation Error' });

    if (!isV4Format(ip)) return ctx.throw(422, 'Invalid ip', { error: 'Validation Error' });

    if (prefer && !['https', 'http'].includes(prefer)) return ctx.throw(422, 'Invalid prefer', { error: 'Validation Error' });

    const code = prefer === 'https' ? 443 : 80;

    const res_code = await new Promise((resolve, reject) => {
        exec(`curl -s -o /dev/null -w "%{http_code}" -m 2 ${prefer}://${dns} --resolve ${dns}:${code}:${ip}`, (err, stdout, stderr) => {
            if (err || !stdout) return resolve(false);
            resolve(parseInt(stdout));
        });
    })

    if (!res_code || res_code >= 400) return ctx.throw(502, 'Ip not corresponding to dns', { error: 'Bad Gateway' });

    ctx.body = {
        dns,
        ip,
        prefer: prefer || 'https',
        status: 'OK',
        code: res_code
    };
});


router.get('/healthz', (ctx, next) => {
    ctx.body = 'OK';
});

// Set up error handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            error: err?.error || 'Internal Server Error',
            message: err?.message || err
        };
    }
});

// Set up logger
app.use(logger());

app.use(router.routes());
app.use(router.allowedMethods());

console.info(`Server running on port ${process.env.PORT || 8080}`);

app.listen(process.env.PORT || 8080);