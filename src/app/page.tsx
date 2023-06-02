"use client"

import { useState, Fragment } from 'react'
import Image from 'next/image'
import styles from './page.module.css'

type CardType = 'star' | 'pulse' | 'mastercard' | 'visa';

interface User {
  name: string, 
  cardType: CardType
}

const pinToUser: {[pin: string]: User} = {
  '1234': {
    name: 'Peter Parker',
    cardType: 'star'
  }, 
  '3333': {
    name: 'Jonnah Jameson',
    cardType: 'pulse'
  }
}

enum Screen {
  Welcome = "WELCOME",
  PinInput = "PININPUT",
  Dashboard = "DASHBOARD"
}

export default function ATM() {
  const [showInputBox, setShowInputBox] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [screenText, setScreenText] = useState({
    header: 'Welcome to the ATM',
    1: '',
    2: '',
    3: '',
    4: '',
    5: '',
    6: '',
    7: '',
    8: 'Enter PIN'
  })
  const [user, setUser] = useState<null | User>(null);

  const changeScreen = (screenType: Screen, user?: User) => {
    if (screenType === Screen.Welcome) {
      setScreenText({
        header: 'Welcome to the ATM',
        1: '',
        2: '',
        3: '',
        4: '',
        5: '',
        6: '',
        7: '',
        8: 'Enter PIN'
      })
    } else if (screenType === Screen.PinInput) {
      setShowInputBox(true);
      setScreenText({
            header: 'Enter PIN',
            1: '',
            2: '',
            3: '',
            4: '',
            5: '',
            6: '',
            7: '',
            8: ''
      })
    } else if (screenType === Screen.Dashboard && user) {
      setShowInputBox(false);
      setScreenText({
        header: `Hi ${user.name}! Please make a choice`,
        1: '',
        2: '',
        3: 'Withdraw',
        4: 'Deposit',
        5: '',
        6: 'Exit',
        7: 'Balance',
        8: 'Re-Enter PIN'
      })
    }
  }

  const leftSideButtons = () => {
    return [1, 2, 3, 4].map(btnNum => {
      const gridRowStart = btnNum + 2;

      return (<Fragment key={btnNum}>
        <button style={{gridArea: `${gridRowStart} / 1 / span 1 / span 1`}}></button>
        <div className={styles.screen_options} style={{gridArea: `${gridRowStart} / 2 / span 1 / span 2`}}>{screenText[btnNum]}</div>
      </Fragment>)
    })
  }

  const rightSideButtons = () => {
    return [5, 6, 7, 8].map(btnNum => {
      const gridRowStart = btnNum - 2;
      let handleClick = () => {}

      if (btnNum === 8) {
        handleClick = () => {
          changeScreen(Screen.PinInput);
        }
      }

      return (<Fragment key={btnNum}>
        <button onClick={handleClick} style={{gridArea: `${gridRowStart} / 6 / span 1 / span 1`}}></button>
        <div className={styles.screen_options} style={{gridArea: `${gridRowStart} / 4 / span 1 / span 2`}}>{screenText[btnNum]}</div>
      </Fragment>)
    })
  }

  const inputBox = () => {

    const handleEnter = (e: any) => {
      if (e.key !== 'Enter') {
        return;
      }

      // normally would make API call to backend to fetch user data
      // but in the interest of saving time, using mock data
      const userObject = pinToUser[inputValue];
      setUser(userObject);
      changeScreen(Screen.Dashboard, userObject);
    }

    if (showInputBox) {
      return (
        <input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          onKeyUp={handleEnter}
        />
      )
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.atm}>
        <div className={styles.atm_sign_ctn}>
          <Image
            src="/assets/atm_sign.png"
            alt="Atm Sign"
            className={styles.atm_sign}
            width={300}
            height={104}
          />
          <Image
            src="/assets/graffiti.png"
            alt="Atm Sign"
            className={styles.graffiti}
            width={150}
            height={40}
          />
        </div>
        <div className={styles.ctn}>
          <div className={styles.img_ctn}>
            <Image
              src="/assets/creditcard_sprite.png"
              alt="Credit Card"
              width={230}
              height={40}
            />
          </div>
          <div className={styles.screen_grid}>
            <div className={styles.screen_background}></div>
            <div className={styles.header}>{screenText.header}</div>
            {leftSideButtons()}
            {rightSideButtons()}
            {inputBox()}

            
          </div>
        </div>
      </div>
    </main>
  )
}
