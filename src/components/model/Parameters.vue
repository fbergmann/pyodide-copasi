<!--
    Paramters are read from json elements like: 

    {
        'name': 'J0_inputFlux', 
        'type': 'fixed', 
        'unit': '', 
        'initial_value': 50.0, 
        'initial_expression': '', 
        'expression': '', 
        'value': 50.0, 
        'rate': 0.0, 
        'key': 'ModelValue_0', 
        'sbml_id': 'J0_inputFlux'
    }


-->

<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref, onBeforeMount, inject } from 'vue'
//import type { State } from '../Types';

const state = inject('$state')

const filters1 = ref(null)
const loading1 = ref(null)

const initFilters1 = () => {
  console.log(state?.parameters)

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
    initial_value: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.GREATER_THAN }]
    },
    initial_expression: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    value: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    expression: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    rate: { value: null, matchMode: FilterMatchMode.EQUALS },
    type: { value: null, matchMode: FilterMatchMode.IN }
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
    <h5>Parameters</h5>

    <template v-if="state?.parameters?.length > 0">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Filter Menu</h5>
            <DataTable
              :value="state.parameters"
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
              :globalFilterFields="['name', 'type', 'unit', 'initial_value', 'initial_expression']"
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
              <template #empty> No parameters. </template>
              <template #loading> Loading parameters data. Please wait. </template>
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
                header="Initial Value"
                filterField="initial_value"
                dataType="numeric"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.initial_value }}
                </template>
                <template #filter="{ filterModel }">
                  <InputNumber v-model="filterModel.value" mode="decimal" locale="en-US" />
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
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by type"
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
              <Column
                header="expression"
                filterField="expression"
                :showFilterMatchModes="false"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 14rem"
              >
                <template #body="{ data }">
                  {{ data.expression }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by expression"
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
      <p>No Parameters.</p>
    </template>
  </div>
</template>

<style scoped></style>
