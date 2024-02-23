<!-- reactions contain json elements like: 

{'name': 'R1', 
 'scheme': 'A -> X', 
'flux': 0.49999987545958524, 
'particle_flux': 3.01107e+20, 
'function': 'Mass action (irreversible)', 
'key': 'Reaction_0', 
'sbml_id': '', 
'mapping': {'k1': 1.0, 'substrate': 'A'}} -->

<script setup>
import { FilterMatchMode, FilterOperator } from 'primevue/api'
import { ref, onBeforeMount, inject } from 'vue'
//import type { State } from '../Types';

const state = inject('$state')

const filters1 = ref(null)
const loading1 = ref(null)

const initFilters1 = () => {
  //console.log(state?.reactions)
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    scheme: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    function: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    flux: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN }
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
    <h5>Reactions</h5>

    <template v-if="state?.reactions?.length > 0">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Filter Menu</h5>
            <DataTable
              :value="state.reactions"
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
              :globalFilterFields="['name', 'scheme', 'function', 'flux']"
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
              <template #empty> No Reactions. </template>
              <template #loading> Loading reaction data. Please wait. </template>
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
                field="scheme"
                header="scheme"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.scheme }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by scheme"
                  />
                </template>
              </Column>
              <Column header="function" filterField="function" style="min-width: 10rem">
                <template #body="{ data }">
                  {{ data.function }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by function"
                  />
                </template>
              </Column>
              <Column header="Flux" filterField="flux" dataType="numeric" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.flux }}
                </template>
                <template #filter="{ filterModel }">
                  <InputNumber v-model="filterModel.value" mode="decimal" locale="en-US" />
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
      <p>No reactions.</p>
    </template>
  </div>
</template>

<style scoped></style>
