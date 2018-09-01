import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import {
  getUsersFiltersAssociations,
  modifyUsersListForBetterOrdering,
  getAnotherOrderDirectionKey,
  getUsersFiltersInfoFromAssocObj
} from "./utils";
const orderBy = require('lodash.orderby');
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
      state.usersModifiedList = orderBy(state.usersModifiedList, [newOrderKey], [newDirection])

    }
  },
  actions: {
    loadUsers (context) {

      Vue.http.get(USERS_API_URL).then(

        (data) => {

          const filtersAssociations = getUsersFiltersAssociations(data.body, USERS_FILTERS_KEYS);
          context.commit('addLoadedUsers', data.body);
          context.commit('setUsersFiltersValuesAssociations', filtersAssociations);

          const filtersData = getUsersFiltersInfoFromAssocObj(filtersAssociations, USERS_FILTERS_KEYS);

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
