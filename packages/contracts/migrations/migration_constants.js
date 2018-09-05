const LOCK_UP_PERCENTAGE = 800;
const MAXIMUM_INTERVAL_DIVISOR = 7;

function configPath() {
  return `${process.cwd()}/../artifacts/deployed/config.json`;
}

module.exports = {
  LOCK_UP_PERCENTAGE,
  MAXIMUM_INTERVAL_DIVISOR,
  configPath
}