export function getUsersFiltersAssociations( users, filtersKeys ) {

  let associations = {};
  let  filtersKeysObj = {};

  for( let i = 0; i < filtersKeys.length; i++ ) {
    const key = filtersKeys[i];
    filtersKeysObj[`${key}`] = '';
  }

  for( let i = 0; i < users.length; i++ ) {

    const user = users[i];
    const usersKeys = Object.keys(user);

    for(let i = 0; i < usersKeys.length; i++) {

      const key = usersKeys[i];
      let checkKey = key;

      if( key === 'address' ) {
        checkKey = 'city';
        if( typeof filtersKeysObj[`${checkKey}`] === 'undefined' ) continue;
        associations[`${user['address'][`${checkKey}`]}`] = checkKey;
      } else {
        if( typeof filtersKeysObj[`${checkKey}`] === 'undefined' ) continue;
        associations[`${user[`${checkKey}`]}`] = checkKey;
      }

    }

  }

  return associations;

}

export function modifyUsersListForBetterOrdering(users) {

  const modifiedUsersList = [];

  for(let i = 0; i < users.length; i++) {
    let user = users[i];
    user['city'] = user['address']['city'];
    modifiedUsersList.push(user);
  }

  return modifiedUsersList;

}

export function getAnotherOrderDirectionKey( currentDirectionKey ) {
  if( currentDirectionKey === 'asc' ) {
    return 'desc';
  }
  return 'asc';
}