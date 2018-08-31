import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import {
  getUsersFiltersAssociations,
  modifyUsersListForBetterOrdering,
  getAnotherOrderDirectionKey
} from "./utils";
const orderBy = require('lodash.orderby');
import {USERS_API_URL, USERS_FILTERS_KEYS} from "./constants";
import 'es6-promise/auto';


Vue.use(Vuex);
Vue.use(VueResource);


export default new Vuex.Store({
  state: {

    count : 0,

    usersInitialList  : [],
    usersModifiedList : [], // sorted, ordered list for table

    usersListOrderParams : {
      orderKey: false,
      orderDirection: getAnotherOrderDirectionKey() // asc or desc
    },

    usersListFilters : {

      filtersValuesAssociations : {
        // female : 'gender',
        // Frontend : 'department',
        // 'New-York' : 'city' ...
      },

      filters : {
        gender : {
          entries : [
            // {
            //   name : 'male',
            //   usersCount : 7
            // },
            // {
            //   name : 'female',
            //   usersCount : 8
            // } ...
          ]
        },
        department : {
          entries : [

          ]
        },
        city: {
          entries : [

          ]
        }
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
  },
  mutations: {
    addLoadedUsers (state, users) {
      state.usersInitialList  = modifyUsersListForBetterOrdering(users);
      state.usersModifiedList = state.usersInitialList.slice();
    },
    setUsersFiltersValuesAssociations(state, associations) {
      state.usersListFilters.filtersAssociations = associations;
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
