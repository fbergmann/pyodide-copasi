<script setup lang="ts">
import { ref, inject } from 'vue'
import type { State, SteadyStateSettings } from '../Types'
import stateService from '@/services/StateService'
import Textarea from 'primevue/textarea'

const state: State | undefined = inject('$state')

const runSteadyState = () => {
  if (state?.steadyStateSettings == null) return
  state.steadyStateResult = null
  stateService.runSteadyState(state, window)
}

const species_table: any | undefined = ref(null);
const reactions_table: any | undefined = ref(null);
const compartment_table: any | undefined = ref(null);
const parameter_table: any | undefined = ref(null);


const exportTable = (ref_table : any) => {
  if (ref_table.value == null) return
  ref_table.value.exportCSV()
}

const exportSpecies = () => {
  exportTable(species_table)
}

const exportReactions = () => {
  exportTable(reactions_table)
}

const exportCompartments = () => {
  exportTable(compartment_table)
}

const exportParameters = () => {
  exportTable(parameter_table)
}

const exportStability = () => {
  if (state?.steadyStateResult == null) return
  const blob = new Blob([state.steadyStateResult.stability], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', 'stability_results.txt')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const exportProtocoll = () => {
  if (state?.steadyStateResult == null) return
  const blob = new Blob([state.steadyStateResult.protocol], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', 'protocol.txt')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Steady State</h5>
        <template v-if="state?.steadyStateSettings == null">
          <p>Pyodide loading ...</p>
        </template>
      </div>
      <template v-if="state?.steadyStateSettings != null">
        <div class="card">
          <h5>Settings</h5>
          <div class="p-fluid formgrid grid">
            <div class="field-checkbox col-12 md:col-6">
              <InputSwitch
                id="chkJacobian"
                v-model="state.steadyStateSettings.problem.JacobianRequested"
              />
              <label for="chkJacobian">Calculate Jacobian</label>
            </div>
            <div class="field-checkbox col-12 md:col-6">
              <InputSwitch
                id="chkStability"
                v-model="state.steadyStateSettings.problem.StabilityAnalysisRequested"
              />
              <label for="chkStability">perform Stability Analysis</label>
            </div>
            <div class="field col-12 md:col-6">
              <label for="txtResolution">Resolution</label>
              <InputNumber
                id="txtResolution"
                :maxFractionDigits="20"
                v-model="state.steadyStateSettings.method.Resolution"
              />
            </div>
            <div class="field col-12 md:col-6">
              <label for="txtDerivation">Derivation Factor</label>
              <InputNumber
                id="txtDerivation"
                :maxFractionDigits="20"
                v-model="state.steadyStateSettings.method.Derivation_Factor"
              />
            </div>
            <div class="field-checkbox col-12 md:col-4">
              <InputSwitch id="chkNewton" v-model="state.steadyStateSettings.method.Use_Newton" />
              <label for="chkNewton">Use Newton</label>
            </div>
            <div class="field-checkbox col-12 md:col-4">
              <InputSwitch
                id="chkIntegration"
                v-model="state.steadyStateSettings.method.Use_Integration"
              />
              <label for="chkIntegration">Use Integration</label>
            </div>
            <div class="field-checkbox col-12 md:col-4">
              <InputSwitch
                id="chkBackIntegration"
                v-model="state.steadyStateSettings.method.Use_Back_Integration"
              />
              <label for="chkBackIntegration">Use Back Integration</label>
            </div>
            <div class="col-12 md:col-3">
              <Button label="Run Task" class="mr-2 mb-1" @click="runSteadyState()" />
            </div>
            <div class="col-12 md:col-5">
              
            </div>
          </div>
        </div>

        <template v-if="state?.steadyStateResult != null">
          <div class="card">
            <h5>Results</h5>
            <p>{{ state.steadyStateResult.status }}</p>
            <TabView>
              <template
                v-if="
                  state.steadyStateResult.species != null &&
                  state.steadyStateResult.species.length > 0
                "
              >
                <TabPanel header="Species">
                  <DataTable :value="state.steadyStateResult.species" ref="species_table">
                    <template #header>
                      <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportSpecies()" />
                      </div>
                    </template>
                    <Column field="name" header="Name" :sortable="true" />
                    <Column field="concentration" :sortable="true">
                      <template #header>
                        <span class="name">
                          Concentration [{{ state.units?.quantity_unit }}/{{
                            state.units?.volume_unit
                          }}]</span
                        >
                      </template>
                    </Column>
                    <Column field="rate" :sortable="true">
                      <template #header>
                        <span class="name">
                          Rate [{{ state.units?.quantity_unit }}/({{ state.units?.time_unit }}*{{
                            state.units?.volume_unit
                          }})]</span
                        >
                      </template>
                    </Column>
                    <Column field="type" header="Type" :sortable="true" />
                  </DataTable>
                </TabPanel>
              </template>
              <template
                v-if="
                  state.steadyStateResult.compartments != null &&
                  state.steadyStateResult.compartments.length > 0
                "
              >
                <TabPanel header="Compartments">
                  <DataTable :value="state.steadyStateResult.compartments" itemid="name" ref="compartment_table">
                    <template #header>
                      <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportCompartments()" />
                      </div>
                    </template>
                    <Column field="name" header="Name" :sortable="true" />
                    <Column field="size" :sortable="true">
                      <template #header>
                        <span class="name"> Volume [{{ state.units?.volume_unit }}]</span>
                      </template>
                    </Column>
                    <Column field="rate" :sortable="true">
                      <template #header>
                        <span class="name">
                          Rate [{{ state.units?.volume_unit }}/{{ state.units?.time_unit }}]</span
                        >
                      </template>
                    </Column>
                    <Column field="type" header="Type" :sortable="true" />
                  </DataTable>
                </TabPanel>
              </template>
              <template
                v-if="
                  state.steadyStateResult.parameters != null &&
                  state.steadyStateResult.parameters.length > 0
                "
              >
                <TabPanel header="Model Quantities">
                  <DataTable :value="state.steadyStateResult.parameters" itemid="name" ref="parameter_table">
                    <template #header>
                      <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportParameters()" />
                      </div>
                    </template>
                    <Column field="name" header="Name" :sortable="true" />
                    <Column field="value" header="Value" :sortable="true" />
                    <Column field="rate" header="Rate" :sortable="true" />
                    <Column field="type" header="Type" :sortable="true" />
                  </DataTable>
                </TabPanel>
              </template>
              <template
                v-if="
                  state.steadyStateResult.reactions != null &&
                  state.steadyStateResult.reactions.length > 0
                "
              >
                <TabPanel header="Reactions">
                  <DataTable :value="state.steadyStateResult.reactions" itemid="name" ref="reactions_table">
                    <template #header>
                      <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportReactions()" />
                      </div>
                    </template>
                    <Column field="name" header="Name" :sortable="true" />
                    <Column field="flux" header="Flux" :sortable="true" />
                    <Column field="scheme" header="Reaction" :sortable="true" />
                  </DataTable>
                </TabPanel>
              </template>
              <template v-if="state.steadyStateSettings.problem.StabilityAnalysisRequested">
                <TabPanel header="Stability">
                  <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportStability()" />
                  </div>
                  <Textarea
                    v-model="state.steadyStateResult.stability"
                    :rows="35"
                    style="width: 100%"
                    :readonly="true"
                  />
                </TabPanel>
              </template>
              <TabPanel header="Protocol">
                <div style="text-align: left">
                        <Button icon="pi pi-external-link" label="Export" @click="exportProtocoll()" />
                </div>
                <Textarea
                  v-model="state.steadyStateResult.protocol"
                  :rows="20"
                  style="width: 100%"
                  :readonly="true"
                />
              </TabPanel>
            </TabView>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
