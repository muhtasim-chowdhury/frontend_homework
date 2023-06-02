"use client"

import { useState, useEffect, Fragment } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

const cardTypes = ['star', 'pulse', 'maestro', 'mastercard', 'plus', 'visa'] as const;
type CardType = typeof cardTypes[number];

interface User {
  id: string
  name: string
  cardType: CardType
  balance: number
}

interface AllUserData {
  [pin: string]: User
}

// initial user data
const pinToUser: AllUserData = {
  '1234': {
    id: 'fg3tg33',
    name: 'Peter Parker',
    cardType: 'star',
    balance: 1000
  },
  '3333': {
    id: 'cfgsfcg',
    name: 'J. Jonah Jameson',
    cardType: 'pulse',
    balance: 50000
  },
  '0000': {
    id: 'cgeg43q',
    name: 'Mary Jane',
    cardType: 'plus',
    balance: 5000
  }
}

// initilize userdata in localstorage if it doesn't exist there yet
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify(pinToUser))
}


enum Screen {
  Welcome = "WELCOME",
  Dashboard = "DASHBOARD",
  Balance = "BALANCE",
  PinInput = "PININPUT",
  Deposit = "DEPOSIT",
  Withdraw = "WITHDRAW"
}

const getUsersData = () => {
  const usersStr = localStorage.getItem('users') || '';
  const users: AllUserData = JSON.parse(usersStr)
  return users
}

const persistChangeToBalance = (user: User, updatedBalance: number) => {
  const usersData = getUsersData()
  for (const pin in usersData) {
    let userFromLocalStorage = usersData[pin];
    
    if (userFromLocalStorage.id === user.id) {
      userFromLocalStorage.balance = updatedBalance;
    }
  }
  localStorage.setItem('users', JSON.stringify(usersData))
}

export default function ATM() {
  const [screen, setScreen] = useState(Screen.Welcome);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    setInputValue('');

    if (screen === Screen.Welcome) {
      setUser(null);
    }
  }, [screen]);

  const leftSideButtons = () => {
    return [1, 2, 3, 4].map(btnNum => {
      const gridRowStart = btnNum + 2;
      let handleClick = () => { }
      let label = '';
      if (screen === Screen.Dashboard) {
        switch (btnNum) {
          case 3: label = "Withdraw"; handleClick = () => setScreen(Screen.Withdraw); break;
          case 4: label = "Deposit"; handleClick = () => setScreen(Screen.Deposit); break;
        }
      }

      return (<Fragment key={btnNum}>
        <button onClick={handleClick} style={{ gridArea: `${gridRowStart} / 1 / span 1 / span 1` }}></button>
        {label && <div className={styles.left_btn_text} style={{ gridArea: `${gridRowStart} / 2 / span 1 / span 2` }}>{label}</div>}
      </Fragment>)
    })
  }

  const rightSideButtons = () => {
    return [5, 6, 7, 8].map(btnNum => {
      const gridRowStart = btnNum - 2;
      let handleClick = () => { }
      let label = '';
      if (screen === Screen.Welcome) {
        if (btnNum === 8) {
          label = 'Enter PIN'
          handleClick = () => {
            setScreen(Screen.PinInput);
          }
        }
      } else if (screen === Screen.Dashboard) {
        switch (btnNum) {
          case 6: label = "Exit"; handleClick = () => setScreen(Screen.Welcome); break;
          case 7: label = "Balance"; handleClick = () => setScreen(Screen.Balance); break;
          case 8: label = "Re-Enter PIN"; handleClick = () => setScreen(Screen.PinInput); break;
        }
      } else if (screen === Screen.Balance) {
        switch (btnNum) {
          case 8: label = "Back"; handleClick = () => setScreen(Screen.Dashboard); break;
        }
      } else if (screen === Screen.PinInput) {
        switch (btnNum) {
          case 7: label = "Back";
            handleClick = () => user ? setScreen(Screen.Dashboard) : setScreen(Screen.Welcome);
            break;
          case 8: label = "Confirm";
            handleClick = () => {
              // normally would make API call to backend to fetch user data
              // but in the interest of saving time, using mock data
              const usersStr = localStorage.getItem('users') || '';
              const users: AllUserData = JSON.parse(usersStr)
              const userObject = users[inputValue];
              if (!userObject) {
                return alert("invalid user")
              }
              setUser(userObject);
              setScreen(Screen.Dashboard);
            };
        }
      }
      else if (screen === Screen.Deposit && user) {
        switch (btnNum) {
          case 7: label = "Back"; handleClick = () => { setScreen(Screen.Dashboard) }; break;
          case 8: label = "Confirm";
            handleClick = () => {
              const updatedBalance = user?.balance + Number(inputValue);
              setUser({ ...user, balance: updatedBalance});
              setScreen(Screen.Dashboard);
              persistChangeToBalance(user, updatedBalance);
            }
        }
      }
      else if (screen === Screen.Withdraw && user) {
        switch (btnNum) {
          case 7: label = "Back"; handleClick = () => { setScreen(Screen.Dashboard) }; break;
          case 8: label = "Confirm";
            handleClick = () => {
              const updatedBalance = user?.balance - Number(inputValue);
              if (updatedBalance < 0) {
                return alert("Not Enough Funds")
              }

              setUser({ ...user, balance: updatedBalance});
              setScreen(Screen.Dashboard);
              persistChangeToBalance(user, updatedBalance);
            }
        }
      }

      return (<Fragment key={btnNum}>
        <button onClick={handleClick} style={{ gridArea: `${gridRowStart} / 6 / span 1 / span 1` }}></button>
        {label && <div className={styles.right_btn_text} style={{ gridArea: `${gridRowStart} / 4 / span 1 / span 2` }}>{label}</div>}
      </Fragment>)
    })
  }

  const inputBox = () => {
    if ([Screen.PinInput, Screen.Deposit, Screen.Withdraw].includes(screen)) {
      return (
        <input
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          autoFocus
        />
      )
    }
  }

  const viewBalance = () => {
    if (screen === Screen.Balance) {
      return (
        <div className={styles.balance}>${user?.balance}</div>
      )
    }
    return null;
  }

  const getHeader = () => {
    switch (screen) {
      case Screen.Welcome: return 'Welcome to the ATM';
      case Screen.PinInput: return 'Please enter PIN';
      case Screen.Dashboard: return `Hi ${user?.name}! Please make a choice...`
      case Screen.Balance: return 'Balance'
    }
  }

  // this might be a hacky way to fade the card types, a compromise to save time
  // ideally instead of doing this, would have individual pngs for each card type and conditionally render them instead of only having 1 png file containing all card types
  const addCoverToFadeCardTypes = () => {
    return (
      <div className={styles.cover}>
        {cardTypes.map(cardType => {
          if (cardType === user?.cardType) {
            return <div key={cardType} className={styles.highlighted_card_type}></div>
          } else {
            return <div key={cardType} className={styles.faded_card_type}></div>
          }
        })}
      </div>
    )
  }

  return (
    <main className={styles.main}>
      <div className={styles.atm}>
        <div className={styles.atm_sign_ctn}>
          <Image
            src="/atm_sign.png"
            alt="Atm Sign"
            width={330}
            height={120}
          />
          <Image
            src="/graffiti.png"
            alt="Atm Sign"
            className={styles.graffiti}
            width={150}
            height={40}
          />
        </div>
        <div className={styles.atm_body}>
          <div className={styles.img_ctn}>
            <Image
              src="/creditcard_sprite.png"
              alt="Credit Card"
              width={230}
              height={40}
            />
            {addCoverToFadeCardTypes()}
          </div>
          <div className={styles.screen_grid}>
            <div className={styles.screen_background}></div>
            <div className={styles.header}>{getHeader()}</div>
            {leftSideButtons()}
            {rightSideButtons()}
            {inputBox()}
            {viewBalance()}
          </div>
          <Image
            src="/systems.png"
            width={60}
            height={7}
            alt="Systems"
            className={styles.systems}
          />
          <Image
            src="/sticker_graf.png"
            width={190}
            height={110}
            className={styles.sticker_graf}
            alt="Systems"
          />
        </div>
      </div>
    </main>
  )
}
