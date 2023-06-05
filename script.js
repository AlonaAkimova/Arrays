'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type} </div>
          <div class="movements__value">${mov}</div>
        </div> `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, curr) => acc + curr, 0);
  labelSumOut.textContent = `${Math.abs(out)}€ `;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUserNames = accounts => {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUserNames(accounts);

const updateUI = function (acc) {
  displayMovements(acc.movements);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};
// Event Handlers

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    //add movement
    currentAccount.movements.push(amount);
    //update UI
    updateUI(currentAccount);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;

    inputTransferAmount.value = inputTransferTo.value = '';
  }
});
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// currencies.forEach((val, key, map) => {
//   console.log(`${key}: ${val}`);
// });

// const currenciesUnique = new Set(['USD', 'USD', 'EUR', 'GBP', 'EUR']);

// currenciesUnique.forEach((val, key, map) => {
//   console.log(`${key}: ${val}`);
// });
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// movements.forEach((movement, i) => {
//   if (movement > 300) {
//     console.log(`Movement ${i + 1}: You withdrew ${movement}`);
//   } else console.log(`Movement ${i + 1}: You deposited ${movement}`);
// });

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];
// console.log(arr.slice(2));
// console.log(arr.splice(-1)); //mutates array
// console.log(arr.splice(1, 2));

// // reverse
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse()); // mutates array

// //concat
// const letters = arr.concat(arr2);
// console.log(letters);
// //join

// console.log(letters.join(''));
// const arr = [23, 66, 64];
// console.log(arr.at(1));
// console.log(arr.at(-1));

// const juliaData = [3, 5, 2, 12, 7];
// const kateData = [9, 16, 6, 8, 3];

// const calcAverageHumanAge = arr => {
//   let humanAge = arr.map(age => {
//     if (age <= 2) {
//       return age * 2;
//     } else return 16 + age * 4;
//   });
//   const adults = humanAge.filter(age => {
//     age >= 18;
//     const average = adults.reduce((acc, age) => acc + age, 0) / adults.length
//   });
// };

// console.log(calcAverageHumanAge([3, 5, 2, 12, 7]));
// const checkDogs = function (data1, data2) {
//   const juliaKate = data1.slice(1, -2).concat(data2);
//   juliaKate.forEach((dog, index) => {
//     const dogType = dog <= 5 ? 'puppy' : 'adult';
//     console.log(
//       `Dog number ${index + 1} is a ${dogType}, and its ${dog} years old`
//     );
//   });
//   return juliaKate;
// };

// console.log(checkDogs(juliaData, kateData));

//MAP - doesn`t mutate the array

const eurToUsd = 1.1;
// const exchange = movements.map(el => {
//   return Math.trunc(el * eurToUsd);
// });
// console.log(exchange);

// const movementsUSDfor = [];
// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUsd);
// }
// console.log(movementsUSDfor);

// const moveDescr = movements.map((mov, i) => {
//   return `Movement ${i + 1}: You deposited ${mov}`;
// });
// console.log(moveDescr);

// FILTER

// const deposits = movements.filter(mov => {
//   return mov > 0;
// });

// console.log(deposits);

// const withdrawals = movements.filter(mov => {
//   return mov < 0;
// });
// console.log(withdrawals);

// REDUCE

// const sum = movements.reduce((acc, curr, i, arr) => {
//   console.log(`Iteration ${i}: ${acc}`);
//   return (acc += curr);
// }, 0);
// console.log(sum);

// let balance2 = 0;
// for (const mov of movements) {
//   balance2 = balance2 + mov;
// }
// console.log(balance2);

// Maximum value

// const maxValue = movements.reduce((acc, curr) => {
//   if (acc > curr) {
//     return acc;
//   } else {
//     return curr;
//   }
// }, movements[0]);

// console.log(maxValue);

//PIPELINE
// const totalDeposits = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(totalDeposits);

// const firstWithdraw = movements.find(mov => mov < 0);
// console.log(accounts);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// for (const acc of accounts) {
//   if (acc.owner === 'Jessica Davis') {
//     console.log(acc);
//   }
// }

//some
const anyDeposits = movements.some(mov => mov > 0);
console.log(anyDeposits);

//every - if all elements satisfy condition
console.log(movements.every(mov => mov > 0));

// FLAT AND FLAT MAP
const arr = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];
console.log(arr.flat());
const arrDeep = [
  [[1, 2], 3],
  [4, [5, 6]],
  [7, 8, 9],
];
console.log(arrDeep.flat(2));

const overalBalance = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);
const overalBalance2 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);
// creating arrays

const x = new Array(7);
x.fill(1, 3);

// Array.from
const y = Array.from({ length: 7 }, () => 1);
const z = Array.from({ length: 7 }, (curr, i) => i + 1);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );
});
//1
const depositSum = accounts
  .flatMap(acc => {
    acc.movements;
  })
  .filter(mov => mov > 0)
  .reduce((sum, curr) => sum + curr, 0);
//2.

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) => (count >= 1000 ? count + 1 : count), 0);
//3.
const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, curr) => {
      // curr > 0 ? (sums.deposits += curr) : (sums.withdrawals += curr);
      sums[curr > 0 ? 'deposits' : 'withdrawals'] += curr;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

//4.
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const expections = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (expections.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title'));
