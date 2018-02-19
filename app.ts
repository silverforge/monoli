import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as KoaBody from 'koa-body';
import * as moment from 'moment';

import Facade from './src/Facade';

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
      ip: ctx.request.ip,
      method: ctx.method,
      url: ctx.url,
      timeStamp: moment().toISOString(true),
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

router.post("/iamhome", async (ctx, next) => {

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
