import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';
import * as moment from 'moment';

const router = new Router();
const app = new Koa();
const PORT = process.env.PORT || 3000;

app.use(KoaBody());
app.proxy = true;

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Content-Type', 'application/json; charset=utf8');
});

router.get("/", async (ctx, next) => {
  ctx.body = {
    version: 'v1.0',
    name: 'monoli'
  };
});

router.post("/motiondetected", async (ctx, next) => {
    console.log(`POST arrived from ${ctx.request.ip} at ${moment().toISOString()}`);
    console.log(`::: BODY ::: ${JSON.stringify(ctx.request.body)}`);

    ctx.body= {
      received: true
    }
});

app.use(router.routes());

const server = app.listen(PORT).on("error", err => {
  console.error(err);
});

module.exports = server;
