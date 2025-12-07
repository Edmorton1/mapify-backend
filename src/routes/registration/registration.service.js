const {HttpError} = require('../../http.error');
const {registrationEmail, registrationProvider, isInDB} = require('./registration.repository');

function getAuthType({userDto, provider}) {
  const {email, password} = userDto;

  if (provider && email === null && password === null) return 'provider';
  if (!provider && email && password) return 'email';

  return 'none';
}

async function registrationWithEmail({userDto, profileDto, avatar}) {
  const {email} = userDto;
  const {name} = profileDto;

  await isEmailIsFree(email);
  await isNameIsFree(name);

  return await registrationEmail({userDto, profileDto, avatar});
}

async function registrationWithProvider(authDto, provider) {
  await isNameIsFree(authDto.profile.name);

  return await registrationProvider(authDto, provider);
}

async function isEmailIsFree(email) {
  if (await isInDB('users', 'email', email)) {
    throw new HttpError(409, 'An account with this email already exists');
  }
}

async function isNameIsFree(name) {
  if (await isInDB('profiles', 'name', name)) {
    throw new HttpError(409, 'This nickname is already taken');
  }
}

module.exports = {
  async registrationService({userDto, profileDto, avatar, provider}) {
    const authType = getAuthType({userDto, provider});
    switch (authType) {
      case 'email':
        return await registrationWithEmail({userDto, profileDto, avatar});
      case 'provider':
        return await registrationWithProvider(profileDto, provider);
      case 'none':
        throw new HttpError(
          400,
          "There can't be a token, email and password at the same time, choose one authorization method"
        );
    }
  }
};
