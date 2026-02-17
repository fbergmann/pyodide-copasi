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

    _recursively_replace_spaces_with_underscores(result_dict)
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)
    return result_json

# Get compartment update from JS - list of compartments with modified values
compartment_update_json = js.window.compartments_update

if compartment_update_json:
    compartment_update = json.loads(compartment_update_json)
    if isinstance(compartment_update, list):
        for item in compartment_update:
            name = item.get('name')
            if name:
                kwargs = {}
                if 'initial_size' in item and item['initial_size'] is not None:
                    kwargs['initial_size'] = float(item['initial_size'])
                if 'unit' in item:
                    kwargs['unit'] = str(item['unit']) if item['unit'] is not None else ''
                if 'type' in item and item['type'] is not None:
                    kwargs['type'] = str(item['type'])
                if 'initial_expression' in item:
                    kwargs['initial_expression'] = str(item['initial_expression']) if item['initial_expression'] is not None else ''

                if kwargs:
                    try:
                        basico.set_compartment(name, **kwargs)
                    except Exception as e:
                        print('Error updating compartment', name, ':', str(e))

# Refresh model state
compartments = _to_js(basico.get_compartments())
species = _to_js(basico.get_species())
sbml = basico.save_model_to_string(type='sbml')
copasi = basico.save_model_to_string()
