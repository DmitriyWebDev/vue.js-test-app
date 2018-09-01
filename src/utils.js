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
      let assocKey = user[`${checkKey}`];

      if( key === 'address' ) {
        checkKey = 'city';
        assocKey = `${user['address'][`${checkKey}`]}`;
      }

      if( typeof filtersKeysObj[`${checkKey}`] === 'undefined' ) continue;

      _setAssociation( associations, assocKey, checkKey )

    }

  }

  return associations;

  // local utils

  function _setAssociation( assocObj, assocKey, checkKey ) {

    let newAssociation = {
      filterKey  : checkKey,
      filterId   : getRandomId(),
      usersCount : 1
    };

    if( typeof assocObj[`${assocKey}`] === 'undefined' ) {
      assocObj[`${assocKey}`] = newAssociation;
    } else {
      assocObj[`${assocKey}`]['usersCount'] += 1;
    }

  }

}

export function getUsersFiltersInfoFromAssocObj( assocObj, filtersKeys ) {

  let result = {

    //gender : [ <-- key from 'filtersKeys' param
      // {
      //   name : 'male',
      //   usersCount : 7
      //   id: 1 (random id for input, label tags)
      // }, ...
    //], ...
    //department : [...], ...

  };

  for( let i = 0; i < filtersKeys.length; i++ ) {

    const currentFilterKey = filtersKeys[i];

    result[`${currentFilterKey}`] = [];

    for( let key in assocObj ) {

      if( !assocObj.hasOwnProperty( key ) ) continue;

      const item = assocObj[`${key}`];

      if( item['filterKey'] === currentFilterKey ) {

        result[`${currentFilterKey}`].push({
          name : key,
          usersCount : item['usersCount'],
          id: item['filterId']
        });

      }

    }


  }

  return result;

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

export function getRandomId() {
  // https://gist.github.com/6174/6062387
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}