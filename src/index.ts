import {Hono} from 'hono';
import z from 'zod';
import {connect} from '../connections';
import zFormValidator from '../validators/zFormValidator';
import zJsonValidator from '../validators/zJsonValidator';

connect();

const app = new Hono();

app.get('/', (c) => c.text('Hono!'));

app.post('/jun', async (c) => {
  // const body = await c.req.json();
  // console.log(body);

  const file = await c.req.parseBody();
  const mista = file.mista as File;
  const jabba = file.jabba;
  console.log(await mista.arrayBuffer(), jabba);

  c.json('asd');
});

const userSchema2 = z.object({
  name: z.string(),
  password: z.string()
});

app.post('/validator', zJsonValidator(userSchema2), async (c) => {
  const user = await c.req.valid('json');
  console.log(user);
  return c.json(user);
});

const userSchema = z.object({
  name: z.string(),
  password: z.string(),
  avatar: z.file(),
  hhdf: z.file()
});

app.post('/test', zFormValidator(userSchema), async (c) => {
  const user = await c.req.valid('form');
  console.log(user);
  return c.json(user);
});

export default app;
