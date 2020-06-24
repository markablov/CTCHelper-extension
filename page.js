(function(){
  const CONTROLS_PANEL_CLASS = 'sudoku-play__controls-container';

  const getTextHints = () => [...document.querySelectorAll('.sudoku-shapetext--overlay')];

  const modes = {
    hint: false,
  };

  const createCage = () => {
  };

  const getButtonTextForHintMode = () => (modes.hint ? 'Disable' : 'Enable');

  const changeHintMode = ({ actionButton }) => {
    modes.hint = !modes.hint;
    getTextHints().forEach((element) => element.style['pointer-events'] = (modes.hint ? 'auto' : 'none'));
    actionButton.textContent = getButtonTextForHintMode();
  };

  const actions = {
    createCage: {
      title: 'Create cage',
      action: createCage,
    },
    changeHintMode: {
      title: 'Hint tick mode',
      action: changeHintMode,
      buttonText: () => getButtonTextForHintMode(),
    },
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

  const attachControls = () => {
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
    actionButton.textContent = 'Apply';
    actionButton.style.padding = '0 10px';
    actionButton.style.margin = '0 10px';
    additionalControlsContainer.append(actionButton);

    const ctx = {
      store: reduxStore,
      actionButton,
    };

    actionButton.addEventListener('click', () => {
      const selectedAction = actionsSelect.selectedOptions[0].value;
      actions[selectedAction].action.call(null, ctx);
    });

    actionsSelect.addEventListener('change', () => {
      const selectedAction = actionsSelect.selectedOptions[0].value;
      const buttonText = actions[selectedAction].buttonText || 'Apply';
      actionButton.textContent = typeof buttonText === 'function' ? buttonText() : buttonText;
    });
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
