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
import { useToast } from 'primevue/usetoast'
import stateService from '@/services/StateService'
//import type { State } from '../Types';

const state = inject('$state')
const toast = useToast()

const filters1 = ref(null)
const loading1 = ref(null)
const editDialogVisible = ref(false)
const editingEvent = ref(null)
const saving = ref(false)

const openEditDialog = (event) => {
  const ev = JSON.parse(JSON.stringify(event))
  let assignments = ev.assignments
  if (!Array.isArray(assignments)) {
    assignments = []
  }
  ev.assignments = assignments.map((a) => ({
    target: (typeof a === 'object' && (a.target ?? a.Target)) || '',
    expression: (typeof a === 'object' && (a.expression ?? a.Expression)) || ''
  }))
  if (ev.assignments.length === 0) {
    ev.assignments = [{ target: '', expression: '' }]
  }
  editingEvent.value = ev
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false
  editingEvent.value = null
}

const addAssignment = () => {
  if (editingEvent.value) {
    editingEvent.value.assignments = [...(editingEvent.value.assignments || []), { target: '', expression: '' }]
  }
}

const removeAssignment = (index) => {
  if (editingEvent.value?.assignments?.length > 1) {
    editingEvent.value.assignments = editingEvent.value.assignments.filter((_, i) => i !== index)
  }
}

const saveEvent = () => {
  if (!editingEvent.value || !state?.pyodide) return
  const ev = { ...editingEvent.value }
  ev.assignments = ev.assignments.filter((a) => a.target || a.expression)
  saving.value = true
  try {
    stateService.updateEvents(state, window, [ev])
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Event updated successfully', life: 3000 })
    closeEditDialog()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err instanceof Error ? err.message : 'Failed to update event',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

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
                  <div class="flex align-items-center gap-2">
                    <span>{{ data.name }}</span>
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      v-tooltip.top="'Edit'"
                      @click="openEditDialog(data)"
                    />
                  </div>
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

    <Dialog
      v-model:visible="editDialogVisible"
      header="Edit Event"
      :modal="true"
      :style="{ width: '36rem' }"
      :closable="!saving"
      @hide="closeEditDialog"
    >
      <div v-if="editingEvent" class="flex flex-column gap-3">
        <div class="field">
          <label for="edit-name">Name</label>
          <InputText id="edit-name" v-model="editingEvent.name" disabled class="w-full" />
          <small class="text-color-secondary">Event name cannot be changed</small>
        </div>
        <div class="field">
          <label for="edit-trigger">Trigger</label>
          <InputText
            id="edit-trigger"
            v-model="editingEvent.trigger"
            class="w-full"
            placeholder="e.g. Time > 10"
          />
        </div>
        <div class="field">
          <label for="edit-delay">Delay</label>
          <InputText id="edit-delay" v-model="editingEvent.delay" class="w-full" />
        </div>
        <div class="field">
          <label for="edit-priority">Priority</label>
          <InputText id="edit-priority" v-model="editingEvent.priority" class="w-full" />
        </div>
        <div class="flex gap-3">
          <div class="field flex-1">
            <label>Fire at Initial Time</label>
            <InputSwitch v-model="editingEvent.fire_at_initial_time" />
          </div>
          <div class="field flex-1">
            <label>Persistent</label>
            <InputSwitch v-model="editingEvent.persistent" />
          </div>
          <div class="field flex-1">
            <label>Delay Calculation</label>
            <InputSwitch v-model="editingEvent.delay_calculation" />
          </div>
        </div>
        <div class="field">
          <div class="flex align-items-center justify-content-between mb-2">
            <label>Assignments</label>
            <Button icon="pi pi-plus" class="p-button-sm p-button-text" @click="addAssignment" />
          </div>
          <div class="flex flex-column gap-2">
            <div
              v-for="(assignment, index) in editingEvent.assignments"
              :key="index"
              class="flex align-items-center gap-2"
            >
              <InputText
                v-model="assignment.target"
                placeholder="Target"
                class="flex-1"
              />
              <InputText
                v-model="assignment.expression"
                placeholder="Expression"
                class="flex-1"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-sm p-button-danger"
                :disabled="editingEvent.assignments.length <= 1"
                @click="removeAssignment(index)"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-outlined" :disabled="saving" @click="closeEditDialog" />
        <Button label="Save" :loading="saving" @click="saveEvent" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped></style>
