import basico
import sys
import simplejson as json
print('python: ', sys.version)
print('basico: ', basico.__version__)
print('COPASI: ', basico.COPASI.__version__)

dm = basico.new_model(name='Linear Chain')
model_name = dm.getModel().getObjectName()

basico.add_reaction('J0', '-> A')
basico.add_reaction('J1', 'A -> B')
basico.add_reaction('J2', 'B -> C')
basico.add_reaction('J3', 'C + A -> D')
basico.add_reaction('J4', 'D ->')

for species in ['B', 'C', 'D']:
    basico.set_species(species, initial_concentration=0)

def _recursively_replace_spaces_with_underscores(d):
    if isinstance(d, list):
        for i in range(len(d)):
            if isinstance(d[i], dict):
                _recursively_replace_spaces_with_underscores(d[i])
        return 
    
    for key in list(d.keys()):
        new_key = key.replace(' ', '_')
        if new_key != key:
            d[new_key] = d.pop(key)
        if isinstance(d[new_key], dict):
            _recursively_replace_spaces_with_underscores(d[new_key])

def _to_js(df):
    if not isinstance(df, dict):
        result_dict = basico.as_dict(df, fold_list=False) if df is not None else []
    else:
        result_dict = df

    # replace all spaces in keys with underscores recursively
    _recursively_replace_spaces_with_underscores(result_dict)

    # convert dictionary to json string
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)

    return result_json

species = _to_js(basico.get_species())
compartments = _to_js(basico.get_compartments())
reactions = _to_js(basico.get_reactions())
parameters = _to_js(basico.get_parameters())
events = _to_js(basico.get_events())

time_course_settings = _to_js(basico.get_task_settings(basico.T.TIME_COURSE))
steady_state_settings = _to_js(basico.get_task_settings(basico.T.STEADY_STATE))

units = _to_js(basico.get_model_units())

time_course_result = None
