import * as Koa from 'koa';

export default class App {

    private static _app = new Koa();

    public static main() {
        this._app.use(async ctx => {
            ctx.body = 'Hello MoNoLi';
        });

        this._app.listen(3000);        
    }
}

App.main();