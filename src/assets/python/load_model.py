import basico
import js
import simplejson as json

def _to_js(df):
    result_dict = basico.as_dict(df, fold_list=False) if df is not None else []

    # convert dictionary to json string
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)

    return result_json

print('loading model')

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