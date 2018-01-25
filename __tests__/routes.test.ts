import * as server from '../dist/app';
import * as request from 'supertest';

afterEach(() => {
    server.close();
});

describe("routes: index", () => {
    it("should respond as expected", async () => {
        const response = await request(server).get("/");
        expect(response.status).toEqual(200);
        expect(response.type).toEqual("application/json");
        expect(response.body.data).toEqual("Sending some JSON");
    });
});
