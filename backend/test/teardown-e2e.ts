module.exports = async () => {
  console.log('[E2E] Stopping PostgreSQL testcontainer...');

  const container = (global as any).__PG_CONTAINER__;
  if (container) {
    await container.stop();
    console.log('[E2E] PostgreSQL stopped.');
  }
};
