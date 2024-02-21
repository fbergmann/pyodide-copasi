export interface Csv {
  selected?: Array<boolean>
  columns: Array<string>
  rows: Array<{ [key: string]: string }>
  csv?: string
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
}
