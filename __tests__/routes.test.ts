import * as chai from 'chai';
import { assert, should, expect } from 'chai';
import * as chaiHttp from 'chai-http';
import server from '../dist/app';

describe("test routes", () => {
    chai.use(chaiHttp);

    it("GET /", (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
                // should.not.exist(err);
                // res.status.should.eql(200);
                console.log(`BODY ::: ${JSON.stringify(res.body)}`);
                done();
            });
    });
});