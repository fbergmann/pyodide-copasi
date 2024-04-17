import basico 
import js

version = int(js.window.sbml_export_version)
level = int(js.window.sbml_export_level)


sbml_export = basico.save_model_to_string(type='sbml', sbml_level=level, sbml_version=version)