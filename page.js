(function(){
  const CONTROLS_PANEL_CLASS = 'sudoku-play__controls-container';

  const createCage = () => {
  };

  const actions = {
    createCage: { title: 'Create cage', action: createCage },
  };

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

  (async function attachControls(){
    await waitForRender();

    const controlsContainer = document.querySelector(`.${CONTROLS_PANEL_CLASS}`);
    const reduxStore = findReduxStore();
    if (!controlsContainer || !reduxStore) {
      return;
    }

    const additionalControlsContainer = document.createElement('div');
    controlsContainer.append(additionalControlsContainer);

    const actionsSelect = document.createElement('select');
    for (const [value, { title }] of Object.entries(actions)) {
      const actionSelectOption = document.createElement('option');
      actionSelectOption.appendChild(document.createTextNode(title));
      actionSelectOption.value = value;
      actionsSelect.append(actionSelectOption);
    }
    additionalControlsContainer.prepend(actionsSelect);

    const actionButton = document.createElement('div');
    actionButton.className = 'action-button sudoku-play__action-button';
    actionButton.appendChild(document.createTextNode('Apply'));
    actionButton.style.padding = '0 10px';
    actionButton.style.margin = '0 10px';
    additionalControlsContainer.append(actionButton);

    actionButton.addEventListener('click', () => {
      const selectedAction = actionsSelect.selectedOptions[0].value;
      actions[selectedAction].action.call(null, reduxStore);
    });
  })();
})();
