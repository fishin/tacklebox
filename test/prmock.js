'use strict';

const Bait = require('bait');
const Code = require('code');
const Hapi = require('hapi');
const Lab = require('lab');
const Mock = require('mock');

const internals = {
    defaults: {
        job: {
            dirPath: __dirname + '/tmp/job',
            workspace: 'workspace',
            configFile: 'config.json',
            mock: true
        }
    }
};

const lab = exports.lab = Lab.script();
const expect = Code.expect;
const describe = lab.describe;
const it = lab.it;

internals.prepareServer = function (callback) {

    const server = new Hapi.Server();
    server.connection();

    server.register({

        register: require('..'),
        options: internals.defaults
    }, (err) => {

        expect(err).to.not.exist();
        callback(server);
    });
};

describe('pr mock', () => {

    it('POST /api/job prs', (done) => {

        internals.prepareServer((server) => {

            const payload = {
                name: 'prs',
                scm: {
                    type: 'git',
                    url: 'https://github.com/org/repo',
                    branch: 'master'
                },
                body: ['npm install', 'npm test']
            };
            server.inject({ method: 'POST', url: '/api/job', payload: payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                expect(response.result.id).to.exist();
                done();
            });
        });
    });

    it('GET /api/job/{jobId}/prs', (done) => {

        const type = 'github';
        const routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, (mockServer) => {

            mockServer.start(() => {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                const bait = new Bait(internals.defaults.job);
                const jobId = bait.getJobByName('prs').id;
                internals.prepareServer((server) => {

                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/prs' }, (response) => {

                        //console.log(response.result);
                        expect(response.statusCode).to.equal(200);
                        expect(response.result.length).to.be.above(0);
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}', (done) => {

        const type = 'github';
        const routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls/1',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, (mockServer) => {

            mockServer.start(() => {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                internals.prepareServer((server) => {

                    const bait = new Bait(internals.defaults.job);
                    const jobId = bait.getJobByName('prs').id;
                    const number = 1;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number }, (response) => {

                        expect(response.statusCode).to.equal(200);
                        expect(response.result.commit).to.exist();
                        expect(response.result.number).to.exist();
                        done();
                    });
                });
            });
        });
    });

    it('GET /api/job/{jobId}/pr/{number}/merge', (done) => {

        const type = 'github';
        const routes = [
            {
                method: 'put',
                path: '/repos/org/repo/pulls/1/merge',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'authorized.json'
            }
        ];
        Mock.prepareServer(type, routes, (mockServer) => {

            mockServer.start(() => {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                internals.prepareServer((server) => {

                    const bait = new Bait(internals.defaults.job);
                    const jobId = bait.getJobByName('prs').id;
                    const number = 1;
                    server.inject({ method: 'GET', url: '/api/job/' + jobId + '/pr/' + number + '/merge' }, (response) => {

                        //console.log(response.result);
                        expect(response.statusCode).to.equal(200);
                        expect(response.result.sha.length).to.equal(40);
                        expect(response.result.merged).to.be.true();
                        expect(response.result.message).to.equal('Pull Request successfully merged');
                        done();
                    });
                });
            });
        });
    });

    it('DELETE /api/queue/{jobId}/pr/{number}', (done) => {

        const type = 'github';
        const routes = [
            {
                method: 'get',
                path: '/repos/org/repo/pulls/1',
                file: 'index.json'
            },
            {
                method: 'get',
                path: '/rate_limit',
                file: 'anonymous.json'
            }
        ];
        Mock.prepareServer(type, routes, (mockServer) => {

            mockServer.start(() => {

                internals.defaults.job.github = {
                    url: mockServer.info.uri
                };
                internals.prepareServer((server) => {

                    const bait = new Bait(internals.defaults.job);
                    const jobId = bait.getJobByName('prs').id;
                    const number = 1;
                    server.inject({ method: 'DELETE', url: '/api/queue/' + jobId + '/pr/' + number }, (response) => {

                        //console.log(response.result);
                        expect(response.statusCode).to.equal(200);
                        done();
                    });
                });
            });
        });
    });


    it('DELETE /api/job/{jobId} prs', (done) => {

        internals.prepareServer((server) => {

            const bait = new Bait(internals.defaults.job);
            const jobId = bait.getJobByName('prs').id;
            server.inject({ method: 'DELETE', url: '/api/job/' + jobId }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.payload).to.exist();
                done();
            });
        });
    });
});
