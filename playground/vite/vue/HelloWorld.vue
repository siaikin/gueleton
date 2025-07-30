<script setup>
import { onMounted, ref } from 'vue'
import AntdvBreadcrumb from './antdv/AntdvBreadcrumb.vue'
import AntdvForm from './antdv/AntdvForm.vue'
import AntdvMenu from './antdv/AntdvMenu.vue'
import AntdvPage from './antdv/AntdvPage.vue'
import AntdvStepper from './antdv/AntdvStepper.vue'
import AntdvTable from './antdv/AntdvTable.vue'
import AntdvTree from './antdv/AntdvTree.vue'
import ElementPlusBreadcrumb from './element-plus/ElementPlusBreadcrumb.vue'
import ElementPlusForm from './element-plus/ElementPlusForm.vue'
import ElementPlusMenu from './element-plus/ElementPlusMenu.vue'
import ElementPlusStepper from './element-plus/ElementPlusStepper.vue'
import ElementPlusTable from './element-plus/ElementPlusTable.vue'
import ElementPlusTree from './element-plus/ElementPlusTree.vue'
import ShadcnBreadcrumb from './shadcn/ShadcnBreadcrumb.vue'
import ShadcnForm from './shadcn/ShadcnForm.vue'
import ShadcnMenu from './shadcn/ShadcnMenu.vue'
import ShadcnStepper from './shadcn/ShadcnStepper.vue'
import ShadcnTable from './shadcn/ShadcnTable.vue'

const list = ref([])
const loading = ref(false)
const inPlace = ref(false)
const fuzzy = ref(1)
</script>

<template>
  <div class="flex sticky top-0 bg-gray-300 z-50 p-4">
    <label class="mr-2">
      loading
      <input v-model="loading" type="checkbox">
    </label>
    <label class="mr-2">
      Fuzzy
      <input v-model.number="fuzzy" type="range" class="w-16" min="0" max="10" step="1">
      ({{ fuzzy }})
    </label>
    <label class="mr-2">
      In Place
      <input v-model="inPlace" type="checkbox">
    </label>
  </div>

  <details class="p-4">
    <summary>Antdv</summary>

    <details class="p-4">
      <summary>Page</summary>

      <AntdvPage />
    </details>

    <details class="p-4">
      <summary>Components</summary>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvStepper />
      </Gueleton>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvTable />
      </Gueleton>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvTree />
      </Gueleton>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvForm />
      </Gueleton>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvBreadcrumb />
      </Gueleton>

      <Gueleton
        id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
        :in-place="inPlace"
      >
        <AntdvMenu />
      </Gueleton>
    </details>
  </details>

  <details class="p-4">
    <summary>Element Plus</summary>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusStepper />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusTable />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusTree />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusForm />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusBreadcrumb />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ElementPlusMenu />
    </Gueleton>
  </details>

  <details class="p-4">
    <summary>Shadcn</summary>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ShadcnStepper />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ShadcnTable />
    </Gueleton>

    <!-- <Gueleton id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace">
      <AntdvTree />
    </Gueleton> -->

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ShadcnForm />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ShadcnBreadcrumb />
    </Gueleton>

    <Gueleton
      id="switchGameList" class="overflow-auto border m-4 p-4" :data="list" :loading="loading" :fuzzy="fuzzy"
      :in-place="inPlace"
    >
      <ShadcnMenu />
    </Gueleton>
  </details>

  <!-- <Gueleton id="switchGameList" v-slot="{ data }" :data="list" :limit="3" :loading="true" as-child :fuzzy="1" in-place>
    <div class="h-full overflow-auto border m-4 p-4">
      <div v-for="item in data" :key="item.id" class="p-4 border-b border-gray-200 hover:bg-gray-100 transition-colors">
        <div class="w-16 h-16 rounded-full bg-blue-200" data-gueleton-bone />
        <h1 class="text-2xl font-bold text-blue-600">
          {{ item.name }}
        </h1>
      </div>
    </div>
  </Gueleton> -->
</template>

<style scoped>
.hello {
  text-align: center;
}
</style>
