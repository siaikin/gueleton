<template>

  <Skeleton v-if="loading">
    <SkeletonAvatar />
    <SkeletonTitle />
    <SkeletonDescription />
  </Skeleton>
  <TwitterCard v-else v-for="card in cards" />
</template>
