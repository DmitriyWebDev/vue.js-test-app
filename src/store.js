import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource'
import {getUsersFiltersAssociations} from "./utils";
import {USERS_API_URL, USERS_FILTERS_KEYS} from "./constants";

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
      filtersAssociations : {
        // female : 'gender',
        // Frontend : 'department',
        // 'New-York' : 'city' ...
      }


    }

  },
  mutations: {
    addLoadedUsers (state, users) {
      console.log( 'addUsers ---' )
      console.log( users )
      state.usersInitialList = users;
    }
  },
  actions: {
    loadUsers (context) {

      console.log( 'loadUsers() ---' )

      Vue.http.get(USERS_API_URL).then(

        (data) => {
          const filtersAssociations = getUsersFiltersAssociations(data.body, USERS_FILTERS_KEYS);
          console.log(filtersAssociations)
          context.commit('addLoadedUsers', data.body)
        },
        (data) => {
          console.log(data)
        }

      );



    }
  },
});
