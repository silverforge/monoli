import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';
import * as moment from 'moment';

import Facade from './src/Facade';
import IAmHomeParam from './src/model/IAmHomeParam';

const app = new Koa();
const router = new Router();
const facade = new Facade();

const PORT = process.env.PORT || 3000;

app.use(KoaBody());
app.proxy = true;

// logger
// header properties
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Content-Type', 'application/json; charset=utf8');

    let logLine = {
        timeStamp: moment().toISOString(true),
        ip: ctx.request.ip,
        method: ctx.method,
        url: ctx.url,
        body: ctx.request.body,
        responseTime: ms
    }
    console.log(`${JSON.stringify(logLine)}`);
});

router.get("/", async (ctx, next) => {
    ctx.body = facade.defaultService();
});

router.post("/motiondetected", async (ctx, next) => {
    ctx.body = await facade.motionDetected();
});

router.get('/iamhome', async (ctx, next) => {
    ctx.body = await facade.amIHome();
});

router.post("/iamhome", async (ctx, next) => {
    // console.log(`::: BODY ::: ${JSON.stringify(ctx.request.body)}`);

    let body: IAmHomeParam = new IAmHomeParam();
    if (typeof ctx.request.body === "string")
        body = JSON.parse(ctx.request.body);
    else
        body = ctx.request.body;

    let toggle = body.toggle;
    ctx.body = await facade.iAmHome(toggle);
});

app.use(router.routes());

const server = app.listen(PORT)
    .on("listening", () => {
        console.log(`MONOLI server started on ${PORT}`)
    })
    .on("error", err => {
        console.error(err);
    })
    .on("close", () => {
        console.log("server stopped")
    });

module.exports = server;
