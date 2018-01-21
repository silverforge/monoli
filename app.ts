import * as Koa from 'koa';

export default class App {

    private static _app = new Koa();

    public static main() {

        // x-response-time
        this._app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
            ctx.set('Content-Type', 'application/json; charset=utf8');
        });
          
        // logger
        this._app.use(async (ctx, next) => {
            const start = Date.now();
            await next();
            const ms = Date.now() - start;
            console.log(`${ctx.method} ${ctx.url} - ${ms}`);
        });
        
        // response
        this._app.use(async ctx => {
            ctx.body = '{"greetings": "Hello MoNoLi"}';
        });
        
        this._app.listen(3000);
    }
}

App.main();
