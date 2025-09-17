export default defineAppConfig({
  gueleton: {
    // limit: 3,
    limit: { length: 3, properties: ['id', 'name'] },
  }
})
