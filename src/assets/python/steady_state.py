from sympy import comp
import js
import simplejson as json
import basico

def _recursively_replace_spaces_with_underscores(d):
    if isinstance(d, list):
        for i in range(len(d)):
            if isinstance(d[i], dict):
                d[i] = _recursively_replace_spaces_with_underscores(d[i])
        return d
    
    for key in list(d.keys()):
        new_key = key.replace(' ', '_')
        if new_key != key:
            d[new_key] = d.pop(key)
        if isinstance(d[new_key], dict):
            d[new_key] = _recursively_replace_spaces_with_underscores(d[new_key])
    
    return d

def _to_js(df):
    if not isinstance(df, dict):
        result_dict = basico.as_dict(df, fold_list=False) if df is not None else []
    else:
        result_dict = df

    # replace all spaces in keys with underscores recursively
    result_dict = _recursively_replace_spaces_with_underscores(result_dict)

    # convert dictionary to json string
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)

    return result_json

def _replace_undercores_with_spaces(d):
    if isinstance(d, list):
        for i in range(len(d)):
            if isinstance(d[i], dict) or isinstance(d[i], list):
                d[i] = _replace_undercores_with_spaces(d[i])
        return d
    
    for key in list(d.keys()):
        new_key = key.replace('_', ' ') if key[0].isupper() else key
        if new_key != key:
            print('replacing', key, 'with', new_key)
            d[new_key] = d.pop(key)
        if isinstance(d[new_key], dict) or isinstance(d[new_key], list):
            d[new_key] = _replace_undercores_with_spaces(d[new_key])
    
    return d

selection_list = js.selectionList

settings = json.loads(js.steadyStateSettings)
steady_state_settings = _replace_undercores_with_spaces(settings)

if steady_state_settings:
    basico.set_task_settings(basico.T.STEADY_STATE, settings=steady_state_settings)

status_type = basico.run_steadystate(update_model=False)

species = basico.get_species()
if species is not None:
    species = basico.as_dict(species[species['type'].isin(['ode', 'reactions'])])
else:
    species = []

compartments = basico.get_compartments()
if compartments is not None:
    compartments = basico.as_dict(compartments[compartments['type'] == 'ode'])
else:
    compartments = []

reactions = basico.as_dict(basico.get_reactions())

parameters = basico.get_parameters()
if parameters is not None:
    parameters = basico.as_dict(parameters[parameters['type'] == 'ode'])
else:
    parameters = []

dm = basico.get_current_model()
task = dm.getTask('Steady-State')
log = task.getMethod().getMethodLog()
stability = task.getEigenValuesReduced().printToString()

def statusToString(status_type): 
    if status_type == 0:
        return 'No steady state with given resolution was found!'
    elif status_type == 1:
        return 'A steady state with given resolution was found.'
    elif status_type == 2:
        return 'An equilibrium steady state (zero fluxes) was found.'
    elif status_type == 3:
        return 'An invalid steady state (negative concentrations) was found.'
    
    return "A steady state with given resolution couldn't be found."

steady_state_result = _to_js({
    'status': statusToString(status_type),
    'species': species,
    'compartments': compartments,
    'reactions': reactions,
    'parameters': parameters,
    'protocol': log,
    'stability': stability,
    'jacobian': basico.as_dict(basico.get_jacobian_matrix()),
    'reduced_jacobian': basico.as_dict(basico.get_reduced_jacobian_matrix())
})

steady_state_settings = _to_js(basico.get_task_settings(basico.T.STEADY_STATE))
