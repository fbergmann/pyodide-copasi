import type { State } from '../components/Types'

import load_model from '../assets/python/load_model.py?raw'
import simulate_model from '../assets/python/simulate_model.py?raw'

export default class StateService {
  /**
   * Updates the model based on the given state.
   * This is called whenever the model changes.
   *
   * @param state The state object containing the updated model data.
   */
  public static updateModelFromState(state: State) {
    if (!state.pyodide) {
      return
    }

    state.modelName = state.pyodide.globals.get('model_name')
    state.compartments = JSON.parse(state.pyodide.globals.get('compartments'))
    state.species = JSON.parse(state.pyodide.globals.get('species'))
    state.parameters = JSON.parse(state.pyodide.globals.get('parameters'))
    state.reactions = JSON.parse(state.pyodide.globals.get('reactions'))
    state.events = JSON.parse(state.pyodide.globals.get('events'))
    state.steadyStateSettings = JSON.parse(state.pyodide.globals.get('steady_state_settings'))
    state.timeCourseSettings = JSON.parse(state.pyodide.globals.get('time_course_settings'))
    state.units = JSON.parse(state.pyodide.globals.get('units'))
  }

  public static resetModelBeforeLoad(state: State) {
    state.modelName = 'none'
    state.compartments = null
    state.species = null
    state.parameters = null
    state.reactions = null
    state.events = null
    state.steadyStateSettings = null
    state.timeCourseSettings = null
    state.units = null
    state.modelDescription = ''
    state.modelImage = ''
    state.plotlyData = null
    state.timeCourseResult = null
  }

  public static loadModelFromContent(state: State, window: Window, content: string) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.modelContent = content

    this.resetModelBeforeLoad(state)

    state.pyodide.runPython(load_model)

    this.updateModelFromState(state)

    state.sbml = state.pyodide.globals.get('sbml')
    state.copasi = state.pyodide.globals.get('copasi')
  }

  public static simulateModel(state: State, window: Window) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.timeCourseSettings = JSON.stringify(state.timeCourseSettings)
    /* @ts-ignore */
    window.timeCourseResult = null
    /* @ts-ignore */
    window.selectionList = state.selectionList

    state.pyodide.runPython(simulate_model)
   
    state.timeCourseResult = JSON.parse(state.pyodide.globals.get('time_course_result'))
    state.timeCourseSettings = JSON.parse(state.pyodide.globals.get('time_course_settings'))
  }

}

export const stateService = new StateService()
