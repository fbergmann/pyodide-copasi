<script setup lang="ts">
import { ref, inject } from 'vue'
import type { State, TimeCourseResult } from '../Types'
import stateService from '@/services/StateService'

/* @ts-ignore */
import { VuePlotly } from 'vue3-plotly'

const state: State | undefined = inject('$state')

const updatePlotFromResults = (results: TimeCourseResult | null) => {
  if (results == null) return

  const traces = []
  for (var i = 1; i < results.num_variables; i++) {
    var trace = {
      x: results.columns[0],
      y: results.columns[i],
      type: 'scatter',
      name: results.titles[i]
    }
    /* @ts-ignore */
    traces.push(trace)
  }
  return traces
}

const runTimeCourse = () => {
  if (state?.timeCourseSettings == null) return
  //console.log(state?.timeCourseSettings)

  if (
    !state.timeCourseSettings.problem.AutomaticStepSize &&
    state.timeCourseSettings.problem?.StepSize != 0
  ) {
    state.timeCourseSettings.problem.StepNumber =
      state.timeCourseSettings.problem.Duration / state.timeCourseSettings.problem.StepSize
  }

  stateService.simulateModel(state, window)
  /* @ts-ignore */
  state.plotlyData = updatePlotFromResults(state.timeCourseResult)
}

const downloadTimeCourseResults = () => {
  if (state?.time_course_csv == null) return

  const blob = new Blob([state.time_course_csv], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', 'time_course_results.csv')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const methodNames = ref([
  'Deterministic (LSODA)',
  'Deterministic (RADAU5)',
  'Stochastic (Direct method)',
  'Stochastic (Gibson + Bruck)',
  'Stochastic (τ-Leap)'
])
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Time Course</h5>
        <template v-if="state?.steadyStateSettings == null">
          <p>Pyodide loading ...</p>
        </template>
      </div>
      <template v-if="state?.timeCourseSettings != null">
        <div class="card">
          <h5>Settings</h5>
          <div class="p-fluid formgrid grid">
            <div class="field col-12 md:col-6">
              <label for="txtDuration">Duration [{{ state?.units?.time_unit }}]</label>
              <InputNumber
                id="txtDuration"
                type="text"
                :maxFractionDigits="20"
                v-model="state.timeCourseSettings.problem.Duration"
              />
            </div>
            <div class="field col-12 md:col-6">
              <label for="txtStepSize">Step Size [{{ state?.units?.time_unit }}]</label>
              <InputNumber
                id="txtStepSize"
                type="text"
                :maxFractionDigits="20"
                v-model="state.timeCourseSettings.problem.StepSize"
                :disabled="state.timeCourseSettings.problem.AutomaticStepSize"
              />
            </div>
            <div class="field-checkbox col-12 md:col-4">
              <InputSwitch
                id="chkStartInSteadyState"
                v-model="state.timeCourseSettings.problem.Start_in_Steady_State"
              />
              <label for="chkStartInSteadyState">Start in Steady State</label>
            </div>
            <div class="field-checkbox col-12 md:col-4">
              <InputSwitch
                id="chkAutomatic"
                v-model="state.timeCourseSettings.problem.AutomaticStepSize"
              />
              <label for="chkAutomatic">Automatic Stepsize</label>
            </div>
            <div class="field col-12 md:col-4">
              <label for="cmbMethodNames">Method</label>
              <Dropdown
                id="cmbMethodNames"
                v-model="state.timeCourseSettings.method.name"
                :options="methodNames"
              />
            </div>
            <div class="col-12 md:col-3">
              <Button label="Run Task" class="mr-2 mb-1" @click="runTimeCourse()" />
            </div>
            <div class="col-12 md:col-5">
              <Button label="Download Results" class="p-button-secondary mr-2 mb-1" @click="downloadTimeCourseResults()" />
            </div>
          </div>
        </div>

        <div class="card">
          <h5>Results</h5>
          <div class="p-fluid formgrid grid">
            <div class="col-12">
              <VuePlotly :data="state.plotlyData" />
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped></style>
