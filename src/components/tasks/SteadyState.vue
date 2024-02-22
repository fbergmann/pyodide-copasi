<script setup lang="ts">
import { ref, inject } from 'vue'
import type { State, SteadyStateSettings } from '../Types'

const state: State | undefined = inject('$state')

const runSteadyState = () => {
  if (state?.steadyStateSettings == null) return
  const settings: SteadyStateSettings = state?.steadyStateSettings
  console.log(settings)
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
              <Button label="Download Results" class="p-button-secondary mr-2 mb-1" />
            </div>
          </div>
        </div>

        <div class="card">
          <h5>Results</h5>
          <TabView>
            <TabPanel header="Species">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
            <TabPanel header="Compartments">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
            <TabPanel header="Model Quantities">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
            <TabPanel header="Reactions">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
            <TabPanel header="Stability">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
            <TabPanel header="Protocoll">
              <p class="line-height-3 m-0"></p>
            </TabPanel>
          </TabView>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
