import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import {getUsersFiltersAssociations} from "./utils";
import {USERS_API_URL, USERS_FILTERS_KEYS} from "./constants";
import 'es6-promise/auto';


Vue.use(Vuex);
Vue.use(VueResource);


export default new Vuex.Store({
  state: {

    count : 0,

    usersInitialList  : [],
    usersModifiedList : [],

    usersListOrderParams : {
      orderKey: false,
      orderDirection: 'asc' // or desc
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
      return state.usersModifiedList
    },
    getUsersFiltersValuesAssociations: state => {
      return state.usersListFilters.filtersValuesAssociations
    },
  },
  mutations: {
    addLoadedUsers (state, users) {
      state.usersInitialList  = users.slice();
      state.usersModifiedList = users.slice();
    },
    setUsersFiltersValuesAssociations(state, associations) {
      state.usersListFilters.filtersAssociations = associations;
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
