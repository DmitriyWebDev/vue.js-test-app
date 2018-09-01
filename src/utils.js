const _ = require('lodash');

export function getUsersFiltersAssociations( users = [], filtersKeys = [] ) {

  let associations = {};
  let filtersKeysObj = {};

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
      if( checkKey === 'city' ) {
        console.log( 'control' )
        console.log(assocObj)
      }
    }

  }

}

export function getUsersFiltersInfoFromAssocObj( assocObj = {}, filtersKeys = [], activeFiltersObj = {} ) {

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

        let isActive = typeof activeFiltersObj[`${key}`] !== 'undefined';

        result[`${currentFilterKey}`].push({
          name : key,
          usersCount : item['usersCount'],
          id: item['filterId'],
          isActive
        });

      }

    }


  }

  return result;

}

export function modifyUsersListForBetterOrdering( users = [] ) {

  const modifiedUsersList = [];

  for(let i = 0; i < users.length; i++) {
    let user = users[i];
    user['city'] = user['address']['city'];
    modifiedUsersList.push(user);
  }

  return modifiedUsersList;

}

export function getAnotherOrderDirectionKey( currentDirectionKey = '' ) {
  if( currentDirectionKey === 'asc' ) {
    return 'desc';
  }
  return 'asc';
}

export function getRandomId() {
  // https://gist.github.com/6174/6062387
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function findStringInArray( array, string ) {

  let result = null;

  for( let i = 0; i < array.length; i++ ) {

    const item = array[i];

    if( item === string ) {
      result = i;
      break;
    }

  }

  return result;

}

export function implementFiltersToUsersList( list = [], filters = [], filtersAssociations = {} ) {

  if( !filters.length ) {
    return list;
  }

  let filteredList = list.slice();

  for( let i = 0; i < filters.length; i++ ) {

    const filterValue = filters[i];
    const filterKey = filtersAssociations[`${filterValue}`]['filterKey'];

    let filterParam = {};
    filterParam[`${filterKey}`] = filterValue;

    filteredList = _.filter(filteredList, filterParam);

  }

  return filteredList;

}