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
import { ref, computed, onBeforeMount, inject } from 'vue'
import { useToast } from 'primevue/usetoast'
import stateService from '@/services/StateService'
//import type { State } from '../Types';

const state = inject('$state')
const toast = useToast()

const filters1 = ref(null)
const loading1 = ref(null)
const editDialogVisible = ref(false)
const editingReaction = ref(null)
const saving = ref(false)

const numericMappingParams = computed(() => {
  const m = editingReaction.value?.mapping
  if (!m || typeof m !== 'object') return []
  return Object.entries(m).filter(([, v]) => typeof v === 'number')
})

const openEditDialog = (reaction) => {
  editingReaction.value = JSON.parse(JSON.stringify(reaction))
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false
  editingReaction.value = null
}

const saveReaction = () => {
  if (!editingReaction.value || !state?.pyodide) return
  saving.value = true
  try {
    stateService.updateReactions(state, window, [editingReaction.value])
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Reaction updated successfully', life: 3000 })
    closeEditDialog()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err instanceof Error ? err.message : 'Failed to update reaction',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

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

    <Dialog
      v-model:visible="editDialogVisible"
      header="Edit Reaction"
      :modal="true"
      :style="{ width: '32rem' }"
      :closable="!saving"
      @hide="closeEditDialog"
    >
      <div v-if="editingReaction" class="flex flex-column gap-3">
        <div class="field">
          <label for="edit-name">Name</label>
          <InputText id="edit-name" v-model="editingReaction.name" disabled class="w-full" />
          <small class="text-color-secondary">Reaction name cannot be changed</small>
        </div>
        <div class="field">
          <label for="edit-scheme">Scheme</label>
          <InputText
            id="edit-scheme"
            v-model="editingReaction.scheme"
            class="w-full"
            placeholder="e.g. A -> B"
          />
          <small class="text-color-secondary">Chemical equation (e.g. A + B -> C)</small>
        </div>
        <div class="field">
          <label for="edit-function">Kinetics Function</label>
          <InputText
            id="edit-function"
            v-model="editingReaction.function"
            class="w-full"
          />
        </div>
        <div v-if="numericMappingParams.length > 0" class="field">
          <label>Parameters</label>
          <div class="flex flex-column gap-2 mt-1">
            <div
              v-for="[paramName] in numericMappingParams"
              :key="paramName"
              class="flex align-items-center gap-2"
            >
              <label :for="'edit-param-' + paramName" class="w-4rem">{{ paramName }}</label>
              <InputNumber
                :id="'edit-param-' + paramName"
                v-model="editingReaction.mapping[paramName]"
                mode="decimal"
                :min-fraction-digits="0"
                :max-fraction-digits="10"
                class="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-outlined" :disabled="saving" @click="closeEditDialog" />
        <Button label="Save" :loading="saving" @click="saveReaction" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped></style>
