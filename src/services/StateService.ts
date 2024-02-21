import type { State } from '../components/Types'

import load_model from '../assets/python/load_model.py?raw'

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
  }

  public static loadModelFromContent(state: State, window: Window, content: string) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.modelContent = content

    state.pyodide.runPython(load_model)
    this.updateModelFromState(state)

    state.sbml = state.pyodide.globals.get('sbml')
    state.copasi = state.pyodide.globals.get('copasi')
  }
}

export const stateService = new StateService()
