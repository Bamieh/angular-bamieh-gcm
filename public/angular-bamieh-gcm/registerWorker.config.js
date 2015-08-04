registerWorker.$inject = ['initilizationProvider'];
function registerWorker(initilizationProvider) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('service-worker.js', {scope: '/'})
      .then(initilizationProvider.initialiseState);
    } else {
      console.log('Ooops Service Workers are not Supported.');
    }
}
