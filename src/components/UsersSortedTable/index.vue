<template>

  <div class="table">
    <div class="table__inner">

      {{usersCount}}

      <div class="table__filters">

        <div class="table__filters-item">

          <div class="table__filters-item-title">
            Пол
          </div>

          <div class="table__filters-item-options-list">

            <label for="checkbox-1" class="table__filters-item-option">

              <input id="checkbox-1" type="checkbox" value="male">

              <span class="table__filters-item-option-name">
                  male (2)
                </span>

            </label>

            <label for="checkbox-2" class="table__filters-item-option">

              <input id="checkbox-2" type="checkbox" value="female">

              <span class="table__filters-item-option-name">
                  female (5)
                </span>

            </label>

          </div>

        </div>

        <div class="table__filters-item">

          <div class="table__filters-item-title">
            Департамент
          </div>

          <div class="table__filters-item-options-list">

            <label for="checkbox-3" class="table__filters-item-option">

              <input id="checkbox-3" type="checkbox" value="Backend">

              <span class="table__filters-item-option-name">
                  Backend (2)
                </span>

            </label>

            <label for="checkbox-4" class="table__filters-item-option">

              <input id="checkbox-4" type="checkbox" value="Hr">

              <span class="table__filters-item-option-name">
                  Hr (1)
                </span>

            </label>

            <label for="checkbox-5" class="table__filters-item-option">

              <input id="checkbox-5" type="checkbox" value="Frontend">

              <span class="table__filters-item-option-name">
                  Frontend (1)
                </span>

            </label>

          </div>

        </div>

        <div class="table__filters-item">

          <div class="table__filters-item-title">
            Город
          </div>

          <div class="table__filters-item-options-list">

            <label for="checkbox-6" class="table__filters-item-option">

              <input id="checkbox-6" type="checkbox" value="Moscow">

              <span class="table__filters-item-option-name">
                  Moscow (3)
                </span>

            </label>

            <label for="checkbox-7" class="table__filters-item-option">

              <input id="checkbox-7" type="checkbox" value="New-York">

              <span class="table__filters-item-option-name">
                  New-York (5)
                </span>

            </label>

            <label for="checkbox-8" class="table__filters-item-option">

              <input id="checkbox-8" type="checkbox" value="Voronezh">

              <span class="table__filters-item-option-name">
                  Voronezh (2)
                </span>

            </label>

            <label for="checkbox-9" class="table__filters-item-option">

              <input id="checkbox-9" type="checkbox" value="Spb">

              <span class="table__filters-item-option-name">
                  Spb (1)
                </span>

            </label>

          </div>

        </div>

      </div>

      <div class="table__rows">

        <div class="table__row table__row_head">

          <div class="table__td table__td_active-sort table__td_sort-asc">
            Имя
          </div>

          <div class="table__td">
            Возраст
          </div>

          <div class="table__td">
            Пол
          </div>

          <div class="table__td">
            Департамент
          </div>

          <div class="table__td table__td_address">
            Адрес
          </div>

        </div>

        <div class="table__row">

          <div class="table__td">
            Mendez
          </div>

          <div class="table__td">
            30
          </div>

          <div class="table__td">
            male
          </div>

          <div class="table__td">
            department
          </div>

          <div class="table__td table__td_address">
            Moscow, Fayette Street 923
          </div>

        </div>

        <div class="table__row">

          <div class="table__td">
            Sharon
          </div>

          <div class="table__td">
            24
          </div>

          <div class="table__td">
            female
          </div>

          <div class="table__td">
            Backend
          </div>

          <div class="table__td table__td_address">
            Moscow, Brighton Avenue 666
          </div>

        </div>

      </div>

    </div>
  </div>
</template>

<script>

export default {
  name: 'UsersSortedTable',
  props: {

  },
  computed: {
    usersCount () {
      return this.$store.state.usersInitialList.length
    }
  },
  beforeCreate() {
    if( !this.$store.getters.getUsersForSortTable.length ) {
      this.$store.dispatch('loadUsers');
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

  $mobile-width : 899px;

  .table {
    display: block;
    max-width: 1200px;
    margin: 50px auto;
    border: 1px solid black;
    overflow: auto;

    @media (max-width:$mobile-width) {
      max-width: 100%;
    }

  }

  .table__inner {
    display: block;
    position: relative;

    @media (max-width:$mobile-width) {
      display: flex;
      flex-direction: row;
      align-items: stretch;
      justify-content: space-between;
    }

  }

  // Filters

  .table__filters {
    display: flex;
    align-items: stretch;
    flex-direction: row;
    justify-content: start;
    border: 1px solid black;
    border-width: 0 0 1px 0;
    background-color: rgba(134, 134, 134, 0.48);

    @media (max-width:$mobile-width) {
      border-width: 0 1px 0 0;
      width: 120px;
      min-width: 120px;
      flex-wrap: wrap;
    }

    &-item {
      display: block;
      width: 33.3%;
      border: 1px solid black;
      border-width: 0 1px 0 0;
      padding: 10px;
      word-break: break-word;

      &:last-child {
        border-width: 0;

        @media (max-width:$mobile-width) {
          border-width: 0 0 1px 0;
        }

      }

      @media (max-width:$mobile-width) {
        width: 100%;
        border-width: 0 0 1px 0;
      }

    }

    &-item-title {
      padding-bottom: 10px;
      font-weight: bold;
    }

    &-item-option {
      display: block;
      text-align: left;
      cursor: pointer;
    }

  }

  // Rows

  .table__rows {
    display: block;
    width: 100%;
  }

  .table__row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: start;
    border-bottom: 1px solid black;
  }

  .table__td {
    display: block;
    width: 20%;
    min-width: 17%;
    border-right: 1px solid black;
    word-wrap: break-word;
    padding: 5px;

    &:last-child {
      border-width: 0;
    }

    @media (max-width:$mobile-width) {
      width: 25%;
      min-width: 21%;
    }

  }

  .table__td_active-sort {
    background-color: gray;
    color: white;
    position: relative;

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 10px solid white;
      bottom: 4px;
      left: 50%;
      margin-left: -5px;
    }

  }

  .table__td_sort-asc {
    &:before {
      transform: rotate(0deg);
    }
  }

  .table__td_sort-desc {
    &:before {
      transform: rotate(180deg);
    }
  }

  .table__row_head {

    .table__td {
      font-size: 17px;
      font-weight: bold;
      cursor: pointer;
      padding-top: 15px;
      padding-bottom: 15px;

      &:hover {
        background-color: gray;
        color: white;
      }

    }

  }


  .table__td_address {
    @media (max-width:$mobile-width) {
      display: none;
    }
  }


</style>
