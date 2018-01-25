import * as Koa from 'koa';
import * as Router from 'koa-router';

const router = new Router();
const app = new Koa();
const PORT = process.env.PORT || 3000;

// logger
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${ms}`);
});

// x-response-time
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
    ctx.set('Content-Type', 'application/json; charset=utf8');
});

router.get("/", async ctx => {
  ctx.body = {
    data: "Sending some JSON"
  };
});

app.use(router.routes());

const server = app.listen(PORT).on("error", err => {
  console.error(err);
});

module.exports = server;
