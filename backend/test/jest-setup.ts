import request from 'supertest';

jest.setTimeout(30_000);

declare global {
  var httpRequest: any;
  var loginAsAdmin: any;
}

global.httpRequest = (app: any) => request(app.getHttpServer());

global.loginAsAdmin = async (app: any) => {
  const res = await global
    .httpRequest(app)
    .post('/auth/login')
    .send({ email: 'admin@example.com', password: '12345678' });
  return res.body.accessToken;
};
