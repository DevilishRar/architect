(function() {
  var status = document.getElementById('status');
  var interactionsUrl = document.getElementById('interactionsUrl');

  var baseUrl = window.location.origin;
  interactionsUrl.textContent = baseUrl + '/api/interactions';

  status.textContent = 'API online - ' + baseUrl;
  status.style.color = '#2ecc71';
})();
