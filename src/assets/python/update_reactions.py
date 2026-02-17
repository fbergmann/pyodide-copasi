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

# Get reaction update from JS - list of reactions with modified values
reaction_update_json = js.window.reactions_update

if reaction_update_json:
    reaction_update = json.loads(reaction_update_json)
    if isinstance(reaction_update, list):
        for item in reaction_update:
            name = item.get('name')
            if name:
                # set_reaction for scheme and function
                kwargs = {}
                if 'scheme' in item and item['scheme'] is not None:
                    kwargs['scheme'] = str(item['scheme'])
                if 'function' in item and item['function'] is not None:
                    kwargs['function'] = str(item['function'])

                if kwargs:
                    try:
                        basico.set_reaction(name, **kwargs)
                    except Exception as e:
                        print('Error updating reaction', name, ':', str(e))

                # set_reaction_parameters for mapping (numeric parameters only)
                mapping = item.get('mapping')
                if isinstance(mapping, dict):
                    for param_name, param_value in mapping.items():
                        if isinstance(param_value, (int, float)) and not isinstance(param_value, bool):
                            try:
                                basico.set_reaction_parameters('(' + name + ').' + param_name, value=float(param_value))
                            except Exception as e:
                                print('Error updating reaction parameter', name, param_name, ':', str(e))

# Refresh model state
reactions = _to_js(basico.get_reactions())
species = _to_js(basico.get_species())
sbml = basico.save_model_to_string(type='sbml')
copasi = basico.save_model_to_string()
