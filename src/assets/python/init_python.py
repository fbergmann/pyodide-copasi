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

def _to_js(df):
    result_dict = basico.as_dict(df, fold_list=False) if df is not None else []

    # convert dictionary to json string
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)

    return result_json

species = _to_js(basico.get_species())
compartments = _to_js(basico.get_compartments())
reactions = _to_js(basico.get_reactions())
parameters = _to_js(basico.get_parameters())
events = _to_js(basico.get_events())
