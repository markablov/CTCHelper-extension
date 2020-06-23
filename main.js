(function(){
  const CONTROLS_PANEL_CLASS = 'sudoku-play__controls-container';
  const ACTION_SELECT_ID = 'ctc_helper-select';

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

  (async function attachControls(){
    await waitForRender();

    const controlsContainer = document.querySelector(`.${CONTROLS_PANEL_CLASS}`);
    if (!controlsContainer) {
      return;
    }

    const additionalControlsContainer = document.createElement('div');
    controlsContainer.append(additionalControlsContainer);

    const actionsSelect = document.createElement('select');
    actionsSelect.id = ACTION_SELECT_ID;
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
  })();
})();
