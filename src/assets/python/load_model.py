import basico
import js
import simplejson as json

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

# the model is set on the window object by the main process
model_content = js.modelContent

# remove all models
while (basico.get_num_loaded_models() > 0):
    basico.remove_datamodel(basico.COPASI.CRootContainer.getDatamodelList().get(0))

try:

    dm = basico.load_model_from_string(model_content)
    model_name = dm.getModel().getObjectName()

    print('model name:', model_name)

    species = _to_js(basico.get_species())
    compartments = _to_js(basico.get_compartments())
    reactions = _to_js(basico.get_reactions())
    parameters = _to_js(basico.get_parameters())
    events = _to_js(basico.get_events())

    sbml = basico.save_model_to_string(type='sbml')
    copasi = basico.save_model_to_string()

    time_course_settings = _to_js(basico.get_task_settings(basico.T.TIME_COURSE))
    steady_state_settings = _to_js(basico.get_task_settings(basico.T.STEADY_STATE))

    units = _to_js(basico.get_model_units())

except:
    print('error loading model')
    model_name = ''
    species = None
    compartments = None
    reactions = None
    parameters = None
    events = None
    sbml = None
    copasi = None

time_course_result = None
steady_state_result = None
