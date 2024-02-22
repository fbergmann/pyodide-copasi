export interface TimeCourseSettings {
  scheduled: boolean
  update_model: boolean
  problem: {
    AutomaticStepSize: boolean
    StepNumber: number
    StepSize: number
    Duration: number
    TimeSeriesRequested: boolean
    OutputStartTime: number
    Output_Event: boolean
    Start_in_Steady_State: boolean
    Use_Values: boolean
    Values: String
    Continue_on_Simultaneous_Events: boolean
  }
  method: {
    Integrate_Reduced_Model?: boolean
    Relative_Tolerance: number
    Absolute_Tolerance: number
    Max_Internal_Steps: number
    Max_Internal_Step_Size: number
    name: String
  }
}

export enum MethodNames {
  LSODA = 'Deterministic (LSODA)',
  RADAU5 = 'Deterministic (RADAU5)',
  DIRECT_METHOD = 'Stochastic (Direct method)',
  GIBSON_BRUCK = 'Stochastic (Gibson + Bruck)',
  TAULEAP = 'Stochastic (τ-Leap)'
}

export enum TargetCriterion {
  Distance = 'Distance',
  Rate = 'Rate',
  DistanceAndRate = 'Distance and Rate'
}

export interface SteadyStateSettings {
  scheduled: boolean
  update_model: boolean
  problem: {
    JacobianRequested: boolean
    StabilityAnalysisRequested: boolean
  }
  method: {
    name: String
    Resolution: number
    Derivation_Factor: number
    Use_Newton: boolean
    Use_Integration: boolean
    Use_Back_Integration: boolean
    Accept_Negative_Concentrations: boolean
    Iteration_Limit: number
    Maximum_duration_for_forward_integration: number
    Maximum_duration_for_backward_integration: number
    Target_Criterion: TargetCriterion
  }
}

export interface Csv {
  selected?: Array<boolean>
  columns: Array<string>
  rows: Array<{ [key: string]: string }>
  csv?: string
}

export interface ModelUnits {
  time_unit: string
  quantity_unit: string
  length_unit: string
  area_unit: string
  volume_unit: string
}

export interface TimeCourseResult {
  num_variables: number
  recorded_steps: number
  titles: Array<string>
  columns: Array<Array<number>>
}

export interface State {
  pyodide: {
    loadPackage(packages: Array<String>): void
    runPythonAsync(script: String): void
    runPython(script: String): void
    globals: any
  } | null
  errorMsg: string | null
  pyodideLoaded: boolean
  sbml: string | null
  copasi: string | null
  csv: Csv | null
  runningSimulation: boolean
  modelName: string
  compartments: any
  species: any
  parameters: any
  reactions: any
  events: any
  steadyStateSettings: SteadyStateSettings | null
  timeCourseSettings: TimeCourseSettings | null
  units: ModelUnits | null
  timeCourseResult: TimeCourseResult | null
  steadyStateResult: any
  selectionList: Array<string> | null,
  modelImage: string,
  modelDescription: string
  plotlyData: any
}
