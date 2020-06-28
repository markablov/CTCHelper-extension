(function(){
  const CONTROLS_PANEL_CLASS = 'sudoku-play__controls-container';

  const getTextHints = () => {
    const hints = [...document.querySelectorAll('.sudoku-shapetext--overlay')];
    return hints.filter((element) => element.innerText.trim() !== '');
  };

  const changeHintMode = (enable) =>
    getTextHints().forEach((element) => element.style['pointer-events'] = (enable ? 'auto' : 'none'));

  const waitForRender = () => new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      for (const { addedNodes = [] } of mutations) {
        if ([...addedNodes].some((node) => node.classList.contains(CONTROLS_PANEL_CLASS))) {
          resolve();
          observer.disconnect();
          return;
        }
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });

  const findReduxStore = () => {
    const rootComponent = document.getElementById('root');
    const reactInternalsKey = Object.keys(rootComponent).find((name) => name.startsWith('__reactContainer'));
    return reactInternalsKey ? rootComponent[reactInternalsKey].child.memoizedProps.store : null;
  };

  const createHintTickCheckbox = () => {
    const hintTickCheckbox = document.createElement('input');
    hintTickCheckbox.type = 'checkbox';
    hintTickCheckbox.value = 'on';
    hintTickCheckbox.id = 'hintTickCheckbox';
    hintTickCheckbox.addEventListener('change', () => changeHintMode(hintTickCheckbox.checked));

    const hintTickCheckboxLabel = document.createElement('label');
    hintTickCheckboxLabel.htmlFor = 'hintTickCheckbox';
    hintTickCheckboxLabel.appendChild(document.createTextNode('Hint tick mode'));

    const hintTickCheckboxContainer = document.createElement('div');
    hintTickCheckboxContainer.appendChild(hintTickCheckbox);
    hintTickCheckboxContainer.appendChild(hintTickCheckboxLabel);

    return hintTickCheckboxContainer;
  };

  const attachControls = () => {
    const controlsContainer = document.querySelector(`.${CONTROLS_PANEL_CLASS}`);
    const reduxStore = findReduxStore();
    if (!controlsContainer || !reduxStore) {
      return;
    }

    const additionalControlsContainer = document.createElement('div');
    controlsContainer.append(additionalControlsContainer);

    additionalControlsContainer.appendChild(createHintTickCheckbox());
  };

  const registerOverlayHandlers = () => {
    getTextHints().forEach((element) => element.addEventListener('click', () => {
      if (element.style.textDecoration !== 'line-through') {
        element.style.textDecoration = 'line-through';
        element.style.color = '#d2d2d2';
        element.style.backgroundColor = 'transparent';
        element.style.borderColor = 'transparent';
      } else {
        element.style.textDecoration = '';
        element.style.color = '#000000';
        element.style.backgroundColor = 'rgb(255, 255, 255)';
        element.style.borderColor = 'rgb(255, 255, 255)';
      }
    }));
  };

  (async function main(){
    await waitForRender();
    attachControls();
    registerOverlayHandlers();
  })();
})();
