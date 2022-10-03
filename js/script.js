
const getElementHTML = {
  get(selector){
    return document.querySelector(selector);
  },
  getAll(selector) {
    return document.querySelectorAll(selector);
  }
}

// ===================================================
// ============= VARIABLES AND CONSTANTS =============
// ===================================================
const walletContents = getElementHTML.get('.wallet__contents'),
      buttonAddToken = getElementHTML.get('#wallet__create'),
      addWalletModal = getElementHTML.get('.add__wallet'),
      tokensLists = getElementHTML.get('.wallet__contents .tokens__balances'),
      modalRemoveToken = getElementHTML.get('.modal__removeItem');

const inputToken = addWalletModal.querySelector('#token'),
      inputBalance = addWalletModal.querySelector('#balance'),
      inputs = addWalletModal.querySelectorAll('input');

const buttonBackToHome = getElementHTML.get('.button__back'),
      // buttonSaveItemToWallet = getElementHTML.get('.add__wallet .button__createToken'),
      buttonRemoveItemFromWallet = getElementHTML.get('.button__remove');

const errorMessage = getElementHTML.getAll('.error'),
      noTokens = getElementHTML.get('.no__record');

const classActive = 'active',
      classDisable = 'disable'

let balanceItems = '',
    indexToken = '';

let buttonSaveItemToWallet = '';

// ===================================================
// ============= FUNCTIONS ===========================
// ===================================================

// Abre o modal com inputs para criar um token.
const openAddToken = () => {
  const buttonSave = getElementHTML.get('.add__wallet .button__save'); 

  buttonSave.classList.add('button__createToken');
  buttonSave.classList.remove('button__editToken');

  addWalletModal.classList.replace(classDisable, classActive);
  addWalletModal.classList.replace('wallet__edit', 'wallet__create');
  buttonAddToken.classList.add(classDisable);
  walletContents.classList.add(classDisable);

  getElementHTML.get('.add__wallet .title__tokeninfo').innerText = 'Add Token'

  inputToken.value = '';
  inputBalance.value = '';

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if(localStorage.getItem(input.value) && input.parentElement.parentElement.classList.contains('wallet__create')) {
        input.nextElementSibling.innerText = 'This token already exists.';
      } else {
        input.nextElementSibling.innerText = '';
      }
    });
  });

  buttonSaveItemToWallet = getElementHTML.get('.add__wallet .button__createToken');

  buttonSaveItemToWallet.addEventListener('click', () => {
    createToken();
    createElementToken();
  })

}
// Cria os dados do token (token e balance).
const createToken = () => {

  if(inputToken.value !== '' && inputBalance.value !== '') {

    if(!localStorage.getItem(inputToken.value)) { 
      localStorage.setItem(inputToken.value, inputBalance.value);
      backToHome();
    }

  }

  fieldValidation();
  
}

// Cria o elemento HTML que vai armazenar as informações do token.
const createElementToken = () => {
  
  const keys = Object.keys(localStorage);
  const values = Object.values(localStorage); 

  balanceItems = ``;

  for(let i = 0; i < localStorage.length; i++) {
    balanceItems += `
      <li class="contents__relative contents__align contents__spacebetween">
        <div>
          <button class="button__edittoken contents__absolute" aria-label="Editar">
            <img src="assets/images/icon-edit.svg" width="32" height="auto" alt="Editar" title="Clique para editar"/>
          </button>
          <h2 class="token">${keys[i]}</h2>
        </div>
        <p class="balance">${values[i]}</p>
      </li>
    `;
  }
  
  tokensLists.innerHTML = balanceItems;

}
createElementToken();

// Envia os dados do token para o modal de edição (editToken).
const openEditToken = () =>  {
  const buttonsEdit = tokensLists.querySelectorAll('.button__edittoken ');   

  buttonsEdit.forEach((button, index) => {

    button.addEventListener('click', () => {

      indexToken = index;

      const token = localStorage.key(index);
      const balance = localStorage.getItem(token);
      editToken(token, balance);
      
    })

  });

}
openEditToken();

// Abre o modal de edição do token.
const editToken = (token, balance) => {
  const buttonSave = getElementHTML.get('.add__wallet .button__save');

  buttonSave.classList.add('button__editToken');
  buttonSave.classList.remove('button__createToken');

  buttonAddToken.classList.add(classDisable);
  walletContents.classList.add(classDisable);
  addWalletModal.classList.replace('wallet__create', 'wallet__edit');
  addWalletModal.classList.replace(classDisable, classActive);
  getElementHTML.get('.add__wallet .title__tokeninfo').innerText = 'Edit Token';

  inputToken.value = token;
  inputBalance.value = balance;

  buttonSaveItemToWallet = getElementHTML.get('.add__wallet .button__editToken');

  buttonSaveItemToWallet.addEventListener('click', () => {
    updateToken();
  });

  console.log('Index ao abrir a edição do token', indexToken)


}

const updateToken = () => {

  let newTokenValue = inputToken.value;
  let newBalanceValue = inputBalance.value;

  inputToken.addEventListener('input', e => {

    if(inputToken.value === '' || e.data === null) {

      newTokenValue = '';
      
    } else {

      newTokenValue += e.data;

    }

  }); 

  inputBalance.addEventListener('input', e => {

    if(inputBalance.value === '' || e.data === null) {

      newBalanceValue = '';

    } else {

      newBalanceValue += e.data;

    }

  });

  const oldToken = localStorage.key(indexToken);
  const oldBalance = localStorage.getItem(localStorage.key(indexToken));

  if(newTokenValue !== oldToken) {

    localStorage.removeItem(oldToken);
    localStorage.setItem(newTokenValue, oldBalance);

  } else if(newBalanceValue !== oldBalance) {

    localStorage.removeItem(localStorage.getItem(oldToken));
    localStorage.setItem(oldToken, newBalanceValue);

  }
  
  if(newTokenValue !== oldToken && newBalanceValue !== oldBalance) {

    localStorage.removeItem(oldToken);
    localStorage.removeItem(localStorage.getItem(oldToken));
    localStorage.setItem(newTokenValue, newBalanceValue);
  
  }

  const itemToken = getElementHTML.getAll('.tokens__balances li')[indexToken];

  itemToken.querySelector('.token').innerText = newTokenValue;
  itemToken.querySelector('.balance').innerText = newBalanceValue;

  backToHome();
}


// Volta para a home, depois que clicar no botão voltar, criar e/ou remover token.
const backToHome = () => {

  buttonAddToken.classList.remove(classDisable);
  walletContents.classList.remove(classDisable);
  addWalletModal.classList.replace(classActive, classDisable);

  inputs.forEach(input => {
    input.nextElementSibling.innerText = '';
  });

  location.reload();

}

// Valida se os campos estão vázios ou não.
const fieldValidation = () => {
  inputs.forEach(input => {
    if(input.value === '') {
      if(input.id === 'token') {
        input.nextElementSibling.innerText = 'The token cannot be empty.';
        input.classList.add('input__error');
      } else if(input.id === 'balance') {
        input.nextElementSibling.innerText = 'The balance cannot be empty.';
        input.classList.add('input__error');
      } else {
        input.nextElementSibling.innerText = '';
      }
    }
  })
}

// Remove a mensagem de erro, quandos os campos não estão mais vazios.
const eventsInput = () => {
  inputs.forEach(input => {
    input.addEventListener('input', (e) => {

      if(e.data !== null) {
        input.nextElementSibling.innerText = '';
        input.classList.remove('input__error');
      }

    });
  });
}
eventsInput();

// Verifica se a lista de tokens contém algum item.
const checkTheExistenceOfTokens = () => {
  const tokens = tokensLists.querySelectorAll('li');

  if(tokens.length === 0) {
    noTokens.classList.add('empty__list');
  } else {
    noTokens.classList.remove('empty__list');
  }
} 
checkTheExistenceOfTokens();

const renderTokenList = () => {
  console.log('teste');
}

const openModalRemove = () => {

  const buttonDoNotDeleteToken = getElementHTML.get('.modal__removeItem .no__remove'),
        buttonDeleteToken = getElementHTML.get('.modal__removeItem .yes__remove');

  modalRemoveToken.classList.add('active__modal');
  
  buttonDoNotDeleteToken.addEventListener('click', () => {
    modalRemoveToken.classList.add('active__disable');
    setTimeout(() => {
      modalRemoveToken.classList.remove('active__modal');
    modalRemoveToken.classList.remove('active__disable');
    }, 500);
  });

  buttonDeleteToken.addEventListener('click', () => {
    localStorage.removeItem(localStorage.key(indexToken));
    getElementHTML.get('.modal__removeItem').classList.remove('active__modal');
    backToHome();
  });

}

buttonRemoveItemFromWallet.addEventListener('click', openModalRemove);


buttonAddToken.addEventListener('click', openAddToken);
buttonBackToHome.addEventListener('click', backToHome);