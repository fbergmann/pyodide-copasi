<script setup lang="ts">
import { ref, inject } from 'vue'
import type { State } from './Types'
import ProgressBar from 'primevue/progressbar'
import stateService from '@/services/StateService'

/* @ts-ignore */
import Markdown from 'vue3-markdown-it'

const sbmlExport = ref([
    {
        label: 'Level 3 Version 1',
        command: () => {
            exportSbmlLV(3, 1)
        }
    },
    {
      label: 'Level 3 Version 2',
      command: () => {
            exportSbmlLV(3, 2)
        }
    },
    {
        separator: true
    },
    {
      label: 'Level 2 Version 4',
      command: () => {
            exportSbmlLV(2, 4)
        }
    },
    {
      label: 'Level 2 Version 1',
      command: () => {
            exportSbmlLV(2, 1)
        }
    },
    {
        separator: true
    },
    {
      label: 'Level 1 Version 2',
      command: () => {
            exportSbmlLV(1, 2)
        }
    }
]);

const state: State | undefined = inject('$state')

const baseUrl = import.meta.env.BASE_URL

const onUpload = (event: any) => {
  /* @ts-ignore */
  loadFile(event.files)
}

const loadFile = (files: Array<File>) => {
  if (state == null) {
    return
  }

  const file = files[0]
  const reader = new FileReader()
  reader.onload = (e) => {
    // @ts-ignore
    const modelCode: string = e.target.result
    stateService.loadModelFromContent(state, window, modelCode)
  }
  reader.readAsText(file)
}

const exportCopasi = () => 
{
  if (state?.copasi == null) {
    return
  }

  const blob = new Blob([state.copasi], { type: 'application/x-copasi' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', state.modelName +'.cps')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

}

const exportSBML = () =>
{
  if (state?.sbml == null) {
    return
  }

  const blob = new Blob([state.sbml], { type: 'application/sbml+xml' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  a.setAttribute('download', state.modelName +'.xml')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}


const exportSbmlLV = (level: number, version:number) =>
{
  if (state?.pyodide == null) {
    return
  }

  const model : string = stateService.exportSBML(state, window, level, version)

  const blob = new Blob([model], { type: 'application/sbml+xml' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.setAttribute('hidden', '')
  a.setAttribute('href', url)
  // create filename including sbml.modelName + Level + Version converting 
  // level and version to string
  const filename = state.modelName + '_L' + level.toString() + 'V' + version.toString() + '.xml'
  a.setAttribute('download', filename)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}


const loadDiseaseModel = (model: string) => {
  if (state == null) {
    return
  }

  state.modelImage = ''
  state.modelDescription = ''

  fetch(`${baseUrl}diseaseModels/${model}.cps`)
    .then((response) => response.text())
    .then((mdata) => {
      // loading the model might take a while 
      stateService.loadModelFromContent(state, window, mdata)
      
      // reset caption and image
      fetch(`${baseUrl}diseaseModels/captions/${model}.md`)
        .then((response) => response.text())
        .then((data) => {
          state.modelImage = `${baseUrl}diseaseModels/images/${model}.png`
          state.modelDescription = data
        })
    })

}

const diseaseModels = ref([
  {
    label: 'Airborn',
    icon: 'pi pi-fw',
    items: [
      {
        label: 'CoViD-19',
        icon: 'pi pi-fw',
        model: 'covid',
        command: () => {
          loadDiseaseModel('covid')
        }
      },
      {
        label: 'Ebola',
        icon: 'pi pi-fw',
        model: 'ebola',
        command: () => {
          loadDiseaseModel('ebola')
        }
      },
      {
        label: 'Measles',
        icon: 'pi pi-fw',
        model: 'measles',
        command: () => {
          loadDiseaseModel('measles')
        }
      },
      {
        label: 'Tuberculosis',
        icon: 'pi pi-fw',
        model: 'tuberculosis',
        command: () => {
          loadDiseaseModel('tuberculosis')
        }
      },
      {
        label: 'CoViD-19 (with delay in recovering)',
        icon: 'pi pi-fw',
        model: 'covid_mexico',
        command: () => {
          loadDiseaseModel('covid_mexico')
        }
      },
      {
        label: 'Diphtheria',
        icon: 'pi pi-fw',
        model: 'diphtheria',
        command: () => {
          loadDiseaseModel('diphtheria')
        }
      }
    ]
  },
  {
    label: 'Sexually transmitted',
    icon: 'pi pi-fw',
    items: [
      {
        label: 'HSV-2',
        icon: 'pi pi-fw',
        model: 'hsv-2',
        command: () => {
          loadDiseaseModel('hsv-2')
        }
      }
    ]
  },
  {
    label: 'Vector borne',
    icon: 'pi pi-fw',
    items: [
      {
        label: 'Malaria',
        icon: 'pi pi-fw',
        model: 'malaria',
        command: () => {
          loadDiseaseModel('malaria')
        }
      },
      {
        label: 'Zika',
        icon: 'pi pi-fw',
        model: 'zika',
        command: () => {
          loadDiseaseModel('zika')
        }
      },
      {
        label: 'Dengue',
        icon: 'pi pi-fw',
        model: 'dengue',
        command: () => {
          loadDiseaseModel('dengue')
        }
      },
      {
        label: 'Visceral Leishmaniasis',
        icon: 'pi pi-fw',
        model: 'visceralleishmaniasis',
        command: () => {
          loadDiseaseModel('visceralleishmaniasis')
        }
      }
    ]
  },
  {
    label: 'Water borne',
    icon: 'pi pi-fw',
    items: [
      {
        label: 'Cholera',
        icon: 'pi pi-fw',
        model: 'cholera',
        command: () => {
          loadDiseaseModel('cholera')
        }
      },
      {
        label: 'Dysentery',
        icon: 'pi pi-fw',
        model: 'dysentery',
        command: () => {
          loadDiseaseModel('dysentery')
        }
      },
      {
        label: 'Typhoid',
        icon: 'pi pi-fw',
        model: 'typhoid',
        command: () => {
          loadDiseaseModel('typhoid')
        }
      }
    ]
  }
])
</script>

<template>
  <div class="col-12">
    <div class="card">
      <h5>COPASI Vue Demo</h5>
      <p>
        This page runs pyodide, vue3 and within python-copasi and basico. You can choose from the
        models below, or upload your own to simulate them. While the python runtime is loading, the
        application is unfortunately unresponsive. (I'll figure this out later.)
      </p>
    </div>
    <template v-if="state === undefined || state === null || !state.pyodideLoaded">
      <ProgressBar mode="indeterminate" style="height: 6px"> </ProgressBar>
    </template>
    <template v-else>
      <div class="card">
        <h5>Current Model</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6">
            <p>Model Name</p>
          </div>
          <div class="field col-12 md:col-6">
            <p>{{ state.modelName }}</p>
          </div>
          <template v-if="state?.units != null">
            <div class="field col-12 md:col-6">
              <p>Time Unit</p>
            </div>
            <div class="field col-12 md:col-6">
              <p>{{ state.units.time_unit }}</p>
            </div>
            <div class="field col-12 md:col-6">
              <p>Quantity Unit</p>
            </div>
            <div class="field col-12 md:col-6">
              <p>{{ state.units.quantity_unit }}</p>
            </div>
          </template>
          <template v-if="state.modelImage != ''">
            <div class="col-12">
              <div class="flex justify-content-center">
                <Image :src="state.modelImage" :alt="state.modelDescription" width="80%" />
              </div>
            </div>
          </template>
          <template v-if="state.modelDescription != ''">
            <Markdown :source="state.modelDescription" />
          </template>

          <div class="col-12 md:col-6 lg:col-6">
          <span class="p-buttonset">
              <Button icon="pi pi-arrow-circle-down" title="Download current COPASI file" label="COPASI" class="mr-2 mb-2" @click="exportCopasi()"> </Button>
              <SplitButton icon="pi pi-arrow-circle-down" :model="sbmlExport" title="Download current file as SBML" label="SBML" class="p-button-secondary mr-2 mb-2" @click="exportSBML()"></SplitButton> 
            </span>
          </div>
        </div>
      </div>

      <div class="card">
        <h5>Models</h5>
        <div class="p-fluid formgrid grid">
          <div class="col-12 md:col-6">
            <p>Choose a model to simulate:</p>
            <TieredMenu :model="diseaseModels" width="400" />
          </div>
          <div class="col-12 md:col-6">
            <p>or upload your own</p>
            <FileUpload
              mode="advanced"
              name="upload[]"
              :auto="true"
              :showCancelButton="false"
              :showUploadButton="false"
              :maxFileSize="100000000"
              @uploader="onUpload"
              customUpload
            >
              <template #empty>
                <p>Drag and drop files here.</p>
              </template>
            </FileUpload>
          </div>
          <div class="col-12">
            <p>
              The disease models come from
              <a href="https://dismolib.uvadcos.io" target="_blank">dismolib</a>.
            </p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped></style>
