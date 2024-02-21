import { reactive, type App } from 'vue'
import type { State } from './components/Types'
import stateService from '@/services/StateService'

import init_python from './assets/python/init_python.py?raw'

/**
 * Install function for installing plugin into Vue 3 application.
 *
 * @param {Object} app
 * @param {Object} options
 */
function install(app: App, options: Array<any>) {
  const state: State = reactive({
    pyodide: null,
    pyodideLoaded: false,
    errorMsg: null,
    sbml: null,
    copasi: null,
    csv: null,
    runningSimulation: false,
    modelName: 'none',
    compartments: null,
    species: null,
    parameters: null,
    reactions: null,
    events: null
  })

  const initializePyodide = async () => {
    try {
      // @ts-ignore : global loadPyodide
      state.pyodide = await loadPyodide({
        //indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
        indexURL: '/pyodide'
      })
      // load pandas lib
      if (state.pyodide) {
        // @ts-ignore : global loadPackage
        await state.pyodide.loadPackage(['copasi-basico', 'simplejson'])
        // @ts-ignore : global runPythonAsync
        await state.pyodide.runPythonAsync(init_python)
        stateService.updateModelFromState(state)
      }
      state.pyodideLoaded = true
    } catch (error: any) {
      state.errorMsg = error
    }
  }

  const addToDocument = (document: Document) => {
    const pyodideScript: HTMLScriptElement = document.createElement('script')
    //pyodideScript.setAttribute('src', 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js')
    pyodideScript.setAttribute('defer', '')
    pyodideScript.setAttribute('src', '/pyodide/pyodide.js')

    pyodideScript.onload = async () => {
      initializePyodide().then(() => {
        state.pyodideLoaded = true
      })
    }
    document.head.appendChild(pyodideScript)
  }

  app.provide('$state', state)

  addToDocument(options[0])
}

export default install
