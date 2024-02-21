import sys
import js
import json
import pandas as pd
import basico


dm = basico.get_current_model()
df = basico.run_time_course()
csv = df.to_csv(index=False)
