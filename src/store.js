import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import {
  getUsersFiltersAssociations,
  modifyUsersListForBetterOrdering,
  getAnotherOrderDirectionKey,
  getUsersFiltersInfoFromAssocObj,
  findStringInArray,
  implementFiltersToUsersList,
  prepareUsersCityCountInfo
} from "./utils";
const _ = require('lodash');
import {USERS_API_URL, USERS_FILTERS_KEYS} from "./constants";
import 'es6-promise/auto';


Vue.use(Vuex);
Vue.use(VueResource);


export default new Vuex.Store({
  state: {

    usersInitialList  : [],
    usersModifiedList : [], // sorted, ordered list for table

    usersListOrderParams : {
      orderKey: false,
      orderDirection: getAnotherOrderDirectionKey() // asc or desc
    },

    usersListFilters : {

      activeFiltersValuesObj : {
        // male : '',
        // Backend: '' ...
      },

      // activeFiltersValuesList is array
      // for control applied filters order
      activeFiltersValuesList : [
        // 'male',
        // 'Backend'
      ],

      filtersValuesAssociations : {
        // female : {
        //   filterKey  : 'gender',
        //   filterId   : 1, (random id for input, label tags)
        //   usersCount : 7
        // }, ...
      },

      filters : {
        // ! important info
        // Keys of this object gotten from array 'USERS_FILTERS_KEYS'
        gender : [
          // {
          //   name : 'male',
          //   usersCount : 7
          //   id: 1 (random id for input, label tags)
          //   isActive: false
          // }, ...
        ],
        department : [],
        city: []
      }

    }

  },
  getters: {
    getUsersForSortTable: state => {
      return state.usersModifiedList;
    },
    getUsersFiltersValuesAssociations: state => {
      return state.usersListFilters.filtersValuesAssociations;
    },
    getUsersOrderKey: state => {
      return state.usersListOrderParams.orderKey;
    },
    getUsersOrderDirection: state => {
      return state.usersListOrderParams.orderDirection;
    },
    getUsersFiltersGender: state => {
      return state.usersListFilters.filters.gender;
    },
    getUsersFiltersDepartment: state => {
      return state.usersListFilters.filters.department;
    },
    getUsersFiltersCity: state => {
      return state.usersListFilters.filters.city;
    },
  },
  mutations: {
    addLoadedUsers (state, users) {
      state.usersInitialList  = modifyUsersListForBetterOrdering(users);
      state.usersModifiedList = state.usersInitialList.slice();
    },
    setUsersFiltersValuesAssociations(state, associations) {
      state.usersListFilters.filtersAssociations = associations;
    },
    setUsersFiltersDataForView(state, payload) {

      const stateUsersFilters = state.usersListFilters.filters;
      const {filtersData, usersFiltersKeys} = payload;

      for( let i = 0; i < usersFiltersKeys.length; i++ ) {

        const filterKey = usersFiltersKeys[i];

        if( typeof filtersData[`${filterKey}`] !== 'undefined' ) {
          stateUsersFilters[`${filterKey}`] = filtersData[`${filterKey}`];
        }

      }

    },
    changeUsersListOrder(state, newOrderKey) {

      const oldOrderKey =  state.usersListOrderParams.orderKey;
      const oldDirection =  state.usersListOrderParams.orderDirection;

      if( newOrderKey === oldOrderKey ) {
        state.usersListOrderParams.orderDirection = getAnotherOrderDirectionKey(oldDirection);
      } else {
        state.usersListOrderParams.orderKey = newOrderKey;
        state.usersListOrderParams.orderDirection = getAnotherOrderDirectionKey();
      }

      const newDirection = state.usersListOrderParams.orderDirection;
      state.usersModifiedList = _.orderBy(state.usersModifiedList, [newOrderKey], [newDirection])

    },
    filterUsersList(state, filterParam) {

      console.log( '--- Mutation. filterUsersList()' )

      // Change filters data

      let activeFiltersValuesObj = state.usersListFilters.activeFiltersValuesObj;
      let activeFiltersValuesList = state.usersListFilters.activeFiltersValuesList;

      if( typeof activeFiltersValuesObj[`${filterParam}`] === 'undefined' ) {
        activeFiltersValuesObj[`${filterParam}`] = '';
      } else {
        delete activeFiltersValuesObj[`${filterParam}`];
      }

      const filterParamIndex = findStringInArray(activeFiltersValuesList, filterParam);

      if( filterParamIndex !== null ) {
        activeFiltersValuesList.splice(filterParamIndex, 1);
      } else {
        activeFiltersValuesList.push(filterParam);
      }

      // END Change filters data

      // Filter users list

      const initialUsersList = state.usersInitialList;
      let filtersAssociations = state.usersListFilters.filtersAssociations;
      const filteredUsersList = implementFiltersToUsersList(
          initialUsersList,
          activeFiltersValuesList,
          filtersAssociations
      );

      const orderKey =  state.usersListOrderParams.orderKey;
      const direction =  state.usersListOrderParams.orderDirection;

      // set current order
      state.usersModifiedList = _.orderBy(filteredUsersList, [orderKey], [direction])

      // END Filter users list

      // Set filters view

      filtersAssociations = getUsersFiltersAssociations(filteredUsersList, USERS_FILTERS_KEYS, true);
      prepareUsersCityCountInfo(filtersAssociations);

      const filtersData = getUsersFiltersInfoFromAssocObj(filtersAssociations, USERS_FILTERS_KEYS, activeFiltersValuesObj);
      const stateUsersFilters = state.usersListFilters.filters;

      for( let i = 0; i < USERS_FILTERS_KEYS.length; i++ ) {

        const filterKey = USERS_FILTERS_KEYS[i];

        if( typeof filtersData[`${filterKey}`] !== 'undefined' ) {
          stateUsersFilters[`${filterKey}`] = filtersData[`${filterKey}`];
        }

      }

      // END filters view

    }
  },
  actions: {
    loadUsers (context) {

      Vue.http.get(USERS_API_URL).then(

        (data) => {

          const users = data.body;
          const filtersAssociations = getUsersFiltersAssociations(users, USERS_FILTERS_KEYS);

          context.commit('addLoadedUsers', users);
          context.commit('setUsersFiltersValuesAssociations', filtersAssociations);

          const filtersData = getUsersFiltersInfoFromAssocObj(filtersAssociations, USERS_FILTERS_KEYS, {/* no active filters */});

          const filtersViewPayload = {
            filtersData : filtersData,
            usersFiltersKeys : USERS_FILTERS_KEYS
          };

          context.commit('setUsersFiltersDataForView', filtersViewPayload);

        },
        (data) => {
          console.log('Load users error');
          console.log(data);
          alert( 'Sorry, bad connection error, please try again later' )
        }

      );

    }
  },
});
