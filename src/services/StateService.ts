import type { State } from '../components/Types'

import load_model from '../assets/python/load_model.py?raw'
import simulate_model from '../assets/python/simulate_model.py?raw'
import steady_steate from '../assets/python/steady_state.py?raw'
import export_current_as_sbml from '../assets/python/export_current_as_sbml.py?raw'
import update_species from '../assets/python/update_species.py?raw'
import update_compartments from '../assets/python/update_compartments.py?raw'
import update_reactions from '../assets/python/update_reactions.py?raw'

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

  public static exportSBML(state: State, window: Window, level : number,version:number) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.sbml_export_version = version
    /* @ts-ignore */
    window.sbml_export_level = level

    state.pyodide.runPython(export_current_as_sbml)

    return state.pyodide.globals.get('sbml_export')
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

  public static updateSpecies(state: State, window: Window, speciesUpdate: object[]) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.species_update = JSON.stringify(speciesUpdate)

    state.pyodide.runPython(update_species)

    this.updateModelFromState(state)
    state.sbml = state.pyodide.globals.get('sbml')
    state.copasi = state.pyodide.globals.get('copasi')
  }

  public static updateCompartments(state: State, window: Window, compartmentsUpdate: object[]) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.compartments_update = JSON.stringify(compartmentsUpdate)

    state.pyodide.runPython(update_compartments)

    this.updateModelFromState(state)
    state.sbml = state.pyodide.globals.get('sbml')
    state.copasi = state.pyodide.globals.get('copasi')
  }

  public static updateReactions(state: State, window: Window, reactionsUpdate: object[]) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.reactions_update = JSON.stringify(reactionsUpdate)

    state.pyodide.runPython(update_reactions)

    this.updateModelFromState(state)
    state.sbml = state.pyodide.globals.get('sbml')
    state.copasi = state.pyodide.globals.get('copasi')
  }

  public static runSteadyState(state: State, window: Window) {
    if (!state.pyodide) {
      return
    }

    /* @ts-ignore */
    window.steadyStateSettings = JSON.stringify(state.steadyStateSettings)
    /* @ts-ignore */
    window.steadyStateResult = null
    /* @ts-ignore */
    window.selectionList = state.selectionList

    state.pyodide.runPython(steady_steate)

    state.steadyStateResult = JSON.parse(state.pyodide.globals.get('steady_state_result'))
    state.steadyStateSettings = JSON.parse(state.pyodide.globals.get('steady_state_settings'))
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
    state.time_course_csv = state.pyodide.globals.get('time_course_csv')
  }
}

export const stateService = new StateService()
