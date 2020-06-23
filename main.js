(function(){
  const scriptElement = document.createElement('script');
  scriptElement.src = chrome.runtime.getURL('page.js');
  scriptElement.onload = () => scriptElement.remove();
  document.head.appendChild(scriptElement);
})();
