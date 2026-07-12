const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:4000';

class ApiClient {
  constructor() {
    this.cookie = null;
  }

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.cookie) headers.Cookie = this.cookie;

    const res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      this.cookie = setCookie.split(';')[0];
    }

    const text = await res.text();
    let json;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {
      json = text;
    }
    return { status: res.status, body: json, headers: res.headers };
  }

  get(path) {
    return this.request('GET', path);
  }
  post(path, body) {
    return this.request('POST', path, body);
  }
  patch(path, body) {
    return this.request('PATCH', path, body);
  }
}

async function loginAs(email, password = 'Demo@1234') {
  const client = new ApiClient();
  const res = await client.post('/api/auth/login', { email, password });
  if (res.status !== 200) {
    throw new Error(`login failed for ${email}: ${JSON.stringify(res.body)}`);
  }
  return client;
}

module.exports = { ApiClient, loginAs, BASE_URL };
