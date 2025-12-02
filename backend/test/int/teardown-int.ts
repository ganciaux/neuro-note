module.exports = async () => {
  console.log('[INT] Stopping PostgreSQL testcontainer...');

  const container = (global as any).__PG_CONTAINER__;
  if (container) {
    await container.stop();
    console.log('[INT] PostgreSQL stopped.');
  }
};
