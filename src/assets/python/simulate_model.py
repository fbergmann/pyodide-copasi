import js
import simplejson as json
import basico

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

def _replace_undercores_with_spaces(d):
    if isinstance(d, list):
        for i in range(len(d)):
            if isinstance(d[i], dict):
                _replace_undercores_with_spaces(d[i])
        return 
    
    for key in list(d.keys()):
        # ignore it if the key does not start with an upper case
        if not key[0].isupper():
            continue

        new_key = key.replace('_', ' ')
        if new_key != key:
            d[new_key] = d.pop(key)
        if isinstance(d[new_key], dict):
            _replace_undercores_with_spaces(d[new_key])
    
    return d

def _transform_result_to_js(df):
    result_dict = {        
        'titles': df.columns.tolist(),
        'columns': []
    }

    num_variables = len(result_dict['titles'])

    result_dict['num_variables'] = num_variables
    result_dict['recorded_steps'] = len(df)

    for i in range(num_variables):
        result_dict['columns'].append(df.iloc[:, i].tolist())

    # convert dictionary to json string
    result_json = json.dumps(result_dict, indent=2, ignore_nan=True)

    return result_json


selection_list = js.selectionList
time_course_settings = _replace_undercores_with_spaces(json.loads(js.timeCourseSettings))

if time_course_settings:
    basico.set_task_settings(basico.T.TIME_COURSE, settings=time_course_settings)

if selection_list:
    df = basico.run_time_course_with_output(selection_list)
else:
    df = basico.run_time_course().reset_index()

time_course_result = _transform_result_to_js(df)
time_course_settings = _to_js(basico.get_task_settings(basico.T.TIME_COURSE))
