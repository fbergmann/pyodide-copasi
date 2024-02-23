<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref, onBeforeMount, inject } from 'vue'
//import type { State } from '../Types';

const state = inject('$state')

const filters1 = ref(null)
const loading1 = ref(null)

const types = ref(['fixed', 'assignment', 'ode', 'reactions'])

const initFilters1 = () => {
  //console.log(state?.species)

  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    unit: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    compartment: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    initial_concentration: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    initial_expression: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    concentration: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    expression: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
    rate: { value: null, matchMode: FilterMatchMode.EQUALS },
    type: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    }
  }
}

const clearFilter1 = () => {
  initFilters1()
}

onBeforeMount(() => {
  initFilters1()
})
</script>

<template>
  <div class="card">
    <h5>Species</h5>

    <template v-if="state?.species?.length > 0">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Filter Menu</h5>
            <DataTable
              :value="state.species"
              :paginator="true"
              class="p-datatable-gridlines"
              :rows="10"
              dataKey="name"
              :rowHover="true"
              v-model:filters="filters1"
              filterDisplay="menu"
              :loading="loading1"
              :filters="filters1"
              responsiveLayout="scroll"
              :globalFilterFields="[
                'name',
                'type',
                'unit',
                'initial_concentration',
                'initial_expression'
              ]"
            >
              <template #header>
                <div class="flex justify-content-between flex-column sm:flex-row">
                  <Button
                    type="button"
                    icon="pi pi-filter-slash"
                    label="Clear"
                    class="p-button-outlined mb-2"
                    @click="clearFilter1()"
                  />
                  <span class="p-input-icon-left mb-2">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters1['global'].value"
                      placeholder="Keyword Search"
                      style="width: 100%"
                    />
                  </span>
                </div>
              </template>
              <template #empty> No species. </template>
              <template #loading> Loading species data. Please wait. </template>
              <Column field="name" header="Name" style="min-width: 12rem" :sortable="true">
                <template #body="{ data }">
                  {{ data.name }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by name"
                  />
                </template>
              </Column>
              <Column
                header="Initial Concentration"
                filterField="initial_concentration"
                dataType="numeric"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.initial_concentration }}
                </template>
                <template #filter="{ filterModel }">
                  <InputNumber v-model="filterModel.value" mode="decimal" locale="en-US" />
                </template>
              </Column>
              <Column
                field="compartment"
                header="compartment"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
                :sortable="true"
              >
                <template #body="{ data }">
                  {{ data.compartment }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by compartment"
                  />
                </template>
              </Column>
              <Column header="unit" filterField="unit" style="min-width: 10rem">
                <template #body="{ data }">
                  {{ data.unit }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by unit"
                  />
                </template>
              </Column>
              <Column
                field="type"
                header="type"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.type }}
                </template>
                <template #filter="{ filterModel }">
                  <Dropdown
                    v-model="filterModel.value"
                    :options="types"
                    placeholder="Any"
                    class="p-column-filter"
                    :showClear="true"
                  />
                </template>
              </Column>
              <Column
                header="initial_expression"
                filterField="initial_expression"
                :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 14rem"
              >
                <template #body="{ data }">
                  {{ data.initial_expression }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by initial expression"
                  />
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="!state?.pyodideLoaded">
      <p>Pyodide loading ...</p>
    </template>
    <template v-else>
      <p>No species.</p>
    </template>
  </div>
</template>

<style scoped></style>
