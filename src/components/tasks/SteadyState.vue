<script setup lang="ts"></script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card p-fluid">
        <h5>Steady State</h5>
        <div class="p-fluid formgrid grid col-12">
          <div class="p-fluid p-formgrid p-grid col-12">
            <p>Use this page to start from scratch and place your custom content.</p>
            <div class="field col-12 md:col-6">
              <label for="firstname2">Firstname</label>
              <InputText id="firstname2" type="text" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="lastname2">Lastname</label>
              <InputText id="lastname2" type="text" />
            </div>
            <div class="field col-12">
              <label for="address">Address</label>
              <Textarea id="address" rows="4" />
            </div>
            <div class="field col-12 md:col-6">
              <label for="city">City</label>
              <InputText id="city" type="text" />
            </div>
            <div class="field col-12 md:col-3">
              <label for="state">State</label>
              <InputText id="state" type="text" />
            </div>
            <div class="field col-12 md:col-3">
              <label for="zip">Zip</label>
              <InputText id="zip" type="text" />
            </div>
          </div>
          <Button label="Run" icon="pi pi-play" />
        </div>
      </div>

      <div class="card">
        <h5>Inline</h5>
        <div class="formgroup-inline">
          <div class="field">
            <label for="firstname1" class="p-sr-only">Firstname</label>
            <InputText id="firstname1" type="text" placeholder="Firstname" />
          </div>
          <div class="field">
            <label for="lastname1" class="p-sr-only">Lastname</label>
            <InputText id="lastname1" type="text" placeholder="Lastname" />
          </div>
          <Button label="Submit"></Button>
        </div>
      </div>
    </div>
    <div class="col-12">
      <div class="card">
        <h5>Advanced</h5>
        <div class="p-fluid formgrid grid">
          <div class="field col-12 md:col-6">
            <label for="firstname2">Firstname</label>
            <InputText id="firstname2" type="text" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="lastname2">Lastname</label>
            <InputText id="lastname2" type="text" />
          </div>
          <div class="field col-12">
            <label for="address">Address</label>
            <Textarea id="address" rows="4" />
          </div>
          <div class="field col-12 md:col-6">
            <label for="city">City</label>
            <InputText id="city" type="text" />
          </div>
          <div class="field col-12 md:col-3">
            <label for="state">State</label>
            <Dropdown
              id="state"
              v-model="dropdownItem"
              :options="dropdownItems"
              optionLabel="name"
              placeholder="Select One"
            ></Dropdown>
          </div>
          <div class="field col-12 md:col-3">
            <label for="zip">Zip</label>
            <InputText id="zip" type="text" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
