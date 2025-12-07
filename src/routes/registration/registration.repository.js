const bcrypt = require('bcrypt');
const {pg} = require('../../connections');
const {randomUUID} = require('crypto');

async function registration({profileDto, avatar, createUserFunc}) {
  const uploadedAvatar = avatar ? await uploadAvatar(avatar) : null;

  return pg.transaction(async (trx) => {
    const {id} = await createUserFunc(trx);

    const [profile] = await trx('profiles')
      .insert({...profileDto, id, avatar: uploadedAvatar})
      .returning('*');

    return profile;
  });
}

async function uploadAvatar(avatar) {
  // TODO: Mocking upload avatar
  return randomUUID();
}

async function insertUser(trx, value) {
  console.log({trx, value});
  const [user] = await trx('users').insert(value).returning(['id', 'role']);
  return user;
}

async function createUser(trx, userDto) {
  const {password} = userDto;

  // TODO: set many salt
  const hashPassword = await bcrypt.hash(password, 3);

  return await insertUser(trx, {
    ...userDto,
    password: hashPassword
  });
}

module.exports = {
  async registrationEmail({userDto, profileDto, avatar}) {
    return registration({
      profileDto,
      avatar,
      createUserFunc: (trx) => createUser(trx, userDto)
    });
  },

  async registrationProvider(profileDto, provider) {
    return registration(profileDto, (trx) =>
      insertUser(trx, {provider_id: provider.id, email: provider.email})
    );
  },

  async isInDB(table, column, value) {
    const {
      rows: [{exists}]
    } = await pg.raw(
      `SELECT EXISTS(SELECT 1 FROM ?? WHERE ?? = ?) AS "exists"`,
      [table, column, value]
    );

    return exists;
  }
};
