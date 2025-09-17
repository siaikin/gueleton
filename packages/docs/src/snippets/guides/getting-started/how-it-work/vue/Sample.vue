<template>
  <Gueleton
    data-key="tweet-cards"
    :data="cards"
    :loading="loading"
    v-slot="{ data: cards }"
  >
    <TwitterCard v-for="card in cards" />
  </Gueleton>
</template>
