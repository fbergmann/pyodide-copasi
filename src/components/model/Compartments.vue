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
const editingCompartment = ref(null)
const saving = ref(false)

const openEditDialog = (compartment) => {
  editingCompartment.value = { ...compartment }
  editDialogVisible.value = true
}

const closeEditDialog = () => {
  editDialogVisible.value = false
  editingCompartment.value = null
}

const saveCompartment = () => {
  if (!editingCompartment.value || !state?.pyodide) return
  saving.value = true
  try {
    stateService.updateCompartments(state, window, [editingCompartment.value])
    toast.add({ severity: 'success', summary: 'Saved', detail: 'Compartment updated successfully', life: 3000 })
    closeEditDialog()
  } catch (err) {
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: err instanceof Error ? err.message : 'Failed to update compartment',
      life: 5000
    })
  } finally {
    saving.value = false
  }
}

const initFilters1 = () => {
  //console.log(state?.compartments)
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
    dimensionality: { value: null, matchMode: FilterMatchMode.IN },
    initial_size: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }]
    },
    initial_expression: {
      operator: FilterOperator.AND,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    size: {
      operator: FilterOperator.OR,
      constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }]
    },
    expression: { value: [0, 50], matchMode: FilterMatchMode.BETWEEN },
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
    <h5>Compartments</h5>

    <template v-if="state?.compartments?.length > 0">
      <div class="grid">
        <div class="col-12">
          <div class="card">
            <h5>Filter Menu</h5>
            <DataTable
              :value="state.compartments"
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
              :globalFilterFields="['name', 'type', 'unit', 'initial_size', 'initial_expression']"
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
              <template #empty> No compartments. </template>
              <template #loading> Loading compartment data. Please wait. </template>
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
                header="Initial Size"
                filterField="initial_size"
                dataType="numeric"
                style="min-width: 12rem"
              >
                <template #body="{ data }">
                  {{ data.initial_size }}
                </template>
                <template #filter="{ filterModel }">
                  <InputNumber v-model="filterModel.value" mode="decimal" locale="en-US" />
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
            </DataTable>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="!state?.pyodideLoaded">
      <p>Pyodide loading ...</p>
    </template>
    <template v-else>
      <p>No compartments.</p>
    </template>

    <Dialog
      v-model:visible="editDialogVisible"
      header="Edit Compartment"
      :modal="true"
      :style="{ width: '28rem' }"
      :closable="!saving"
      @hide="closeEditDialog"
    >
      <div v-if="editingCompartment" class="flex flex-column gap-3">
        <div class="field">
          <label for="edit-name">Name</label>
          <InputText id="edit-name" v-model="editingCompartment.name" disabled class="w-full" />
          <small class="text-color-secondary">Compartment name cannot be changed</small>
        </div>
        <div class="field">
          <label for="edit-initial-size">Initial Size</label>
          <InputNumber
            id="edit-initial-size"
            v-model="editingCompartment.initial_size"
            mode="decimal"
            :min-fraction-digits="0"
            :max-fraction-digits="10"
            class="w-full"
          />
        </div>
        <div class="field">
          <label for="edit-unit">Unit</label>
          <InputText id="edit-unit" v-model="editingCompartment.unit" class="w-full" />
        </div>
        <div class="field">
          <label for="edit-type">Type</label>
          <InputText id="edit-type" v-model="editingCompartment.type" class="w-full" />
        </div>
        <div class="field">
          <label for="edit-initial-expression">Initial Expression</label>
          <InputText
            id="edit-initial-expression"
            v-model="editingCompartment.initial_expression"
            class="w-full"
          />
        </div>
      </div>
      <template #footer>
        <Button label="Cancel" class="p-button-outlined" :disabled="saving" @click="closeEditDialog" />
        <Button label="Save" :loading="saving" @click="saveCompartment" />
      </template>
    </Dialog>
  </div>
</template>

<style scoped></style>
