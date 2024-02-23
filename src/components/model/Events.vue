<!--

    Events will be displayed from json strings like: 

    {
        'name': 'pe_event_0', 
        'trigger': 'Time % 360 > 1', 
        'delay': '', 
        'assignments': [{'target': '[q]', 'expression': '0.0124334'}], 
        'priority': '', 
        'fire_at_initial_time': False, 
        'persistent': False, 
        'delay_calculation': False, 
        'key': 'Event_0', 
        'sbml_id': ''
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
  //console.log(state?.events)
  filters1.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    trigger: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    assignments: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    priority: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    delay: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }]
    },
    fire_at_initial_time: { value: null, matchMode: FilterMatchMode.EQUALS },
    delay_calculation: { value: null, matchMode: FilterMatchMode.EQUALS },
    persistent: { value: null, matchMode: FilterMatchMode.EQUALS }
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
    <h5>Events</h5>

    <template v-if="state?.events?.length > 0">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Filter Menu</h5>
            <DataTable
              :value="state.events"
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
              :globalFilterFields="['name', 'trigger', 'assignments', 'delay', 'priority']"
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
              <template #empty> No Events. </template>
              <template #loading> Loading Events data. Please wait. </template>
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
              <Column field="trigger" header="Trigger" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.trigger }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by Trigger"
                  />
                </template>
              </Column>
              <Column field="assignments" header="Assignments" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.assignments }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by Assignments"
                  />
                </template>
              </Column>
              <Column field="delay" header="Delay" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.delay }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by Delay"
                  />
                </template>
              </Column>
              <Column field="priority" header="Priority" style="min-width: 12rem">
                <template #body="{ data }">
                  {{ data.priority }}
                </template>
                <template #filter="{ filterModel }">
                  <InputText
                    type="text"
                    v-model="filterModel.value"
                    class="p-column-filter"
                    placeholder="Search by Priority"
                  />
                </template>
              </Column>
              <Column
                field="fire_at_initial_time"
                header="fire_at_initial_time"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.fire_at_initial_time }}
                </template>
              </Column>
              <Column
                field="persistent"
                header="persistent"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.persistent }}
                </template>
              </Column>
              <Column
                field="delay_calculation"
                header="delay_calculation"
                :filterMenuStyle="{ width: '14rem' }"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.delay_calculation }}
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
      <p>No Events.</p>
    </template>
  </div>
</template>

<style scoped></style>
