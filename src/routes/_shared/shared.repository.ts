import {pg} from '../../connections';

export const sharedRepository = {
  async getProfileById(id: number) {
    console.log(
      'GET PROFILE BY ID | ЕСЛИ УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ ИЗ БД И НЕ ОБНОВИТЬ СЕССИЮ, БУДЕТ ОШИБКА'
    );

    const [profile] = await pg
      .select(['id', 'name', 'avatar', 'country_code'])
      .from('profiles')
      .where('id', '=', id);

    return profile;
  }
};
