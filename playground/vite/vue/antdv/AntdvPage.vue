<script setup>
import { onMounted, ref } from 'vue'
import { Gueleton } from '../../../../src/client/vue'

const loading = ref(false)
const inPlace = ref(false)
const fuzzy = ref(1)

const posts = ref([])
const comments = ref([])
const users = ref([])

const postsColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Title', dataIndex: 'title', key: 'title' },
  { title: 'Body', dataIndex: 'body', key: 'body' },
  { title: 'User ID', dataIndex: 'userId', key: 'userId' },
])

const commentsColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Body', dataIndex: 'body', key: 'body' },
  { title: 'Post ID', dataIndex: 'postId', key: 'postId' },
])

const usersColumns = ref([
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Username', dataIndex: 'username', key: 'username' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Website', dataIndex: 'website', key: 'website' },
])

async function fetchData() {
  try {
    loading.value = true
    posts.value = []
    comments.value = []
    users.value = []

    await new Promise(resolve => setTimeout(resolve, 1000))
    await Promise.all([
      fetch('https://jsonplaceholder.typicode.com/posts'),
      fetch('https://jsonplaceholder.typicode.com/comments'),
      fetch('https://jsonplaceholder.typicode.com/users'),
    ]).then(([postsRes, commentsRes, usersRes]) => Promise.all([
      postsRes.json(),
      commentsRes.json(),
      usersRes.json(),
    ])).then(([postsData, commentsData, usersData]) => {
      posts.value = postsData
      comments.value = commentsData
      users.value = usersData
    })
  }
  catch (error) {
    console.error('Failed to fetch data:', error)
  }
  finally {
    loading.value = false
  }
}

onMounted(() => fetchData())
</script>

<template>
  <div class="flex gap-2">
    <button type="primary" class="border border-black p-1" @click="fetchData">
      Refresh
    </button>
    <label class="border border-black p-1">
      Loading
      <input v-model="loading" type="checkbox">
    </label>
    <label class="border border-black p-1">
      In-place
      <input v-model="inPlace" type="checkbox">
    </label>
    <label class="border border-black p-1">
      Fuzzy
      <input v-model.number="fuzzy" type="range" :min="0" :max="10">
      <span>({{ fuzzy }})</span>
    </label>
  </div>

  <a-tabs default-active-key="1">
    <a-tab-pane key="1" tab="Posts">
      <Gueleton id="posts" v-slot="{ data }" :data="posts" :loading="loading" :fuzzy="fuzzy" :in-place="inPlace">
        <a-table :data-source="data" :columns="postsColumns" row-key="id" />
      </Gueleton>
    </a-tab-pane>
    <a-tab-pane key="2" tab="Comments">
      <Gueleton id="comments" v-slot="{ data }" :data="comments" :loading="loading" :fuzzy="fuzzy" :in-place="inPlace">
        <a-table :data-source="data" :columns="commentsColumns" row-key="id" />
      </Gueleton>
    </a-tab-pane>
    <a-tab-pane key="3" tab="Users">
      <Gueleton id="users" v-slot="{ data }" :data="users" :loading="loading" :fuzzy="fuzzy" :in-place="inPlace">
        <a-table :data-source="data" :columns="usersColumns" row-key="id" />
      </Gueleton>
    </a-tab-pane>
  </a-tabs>
</template>
