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
  const [screen, setScreen] = useState(Screen.Welcome);
  const [inputValue, setInputValue] = useState('');
  const [user, setUser] = useState<null | User>(null);

  const leftSideButtons = () => {
    return [1, 2, 3, 4].map(btnNum => {
      const gridRowStart = btnNum + 2;
      let handleClick = () => {}
      let label = '';
      if (screen === Screen.Dashboard) {
        switch(btnNum) {
          case 3: label = "Withdraw"; break; 
          case 4: label = "Deposit"; break; 
        }
      }

      return (<Fragment key={btnNum}>
        <button style={{gridArea: `${gridRowStart} / 1 / span 1 / span 1`}}></button>
        <div className={styles.screen_options} style={{gridArea: `${gridRowStart} / 2 / span 1 / span 2`}}>{label}</div>
      </Fragment>)
    })
  }

  const rightSideButtons = () => {
    return [5, 6, 7, 8].map(btnNum => {
      const gridRowStart = btnNum - 2;
      let handleClick = () => {}
      let label = '';
      if (screen === Screen.Welcome) {
        if (btnNum === 8) {
          label = 'Enter PIN'
          handleClick = () => {
            setScreen(Screen.PinInput);
          }
        }
      } else if (screen === Screen.Dashboard) {
        switch(btnNum) {
          case 6: label = "Exit"; break; 
          case 7: label = "Balance"; break; 
          case 8: label = "Re-Enter PIN"; break; 
        }
      }


      return (<Fragment key={btnNum}>
        <button onClick={handleClick} style={{gridArea: `${gridRowStart} / 6 / span 1 / span 1`}}></button>
        <div className={styles.screen_options} style={{gridArea: `${gridRowStart} / 4 / span 1 / span 2`}}>{label}</div>
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
      setScreen(Screen.Dashboard);
    }

    if (screen === Screen.PinInput) {
      return (
        <input 
          value={inputValue} 
          onChange={e => setInputValue(e.target.value)} 
          onKeyUp={handleEnter}
        />
      )
    }
  }

  const getHeader = () => {
    switch(screen) {
      case Screen.Welcome: return 'Welcome to the ATM';
      case Screen.PinInput: return 'Please enter PIN';
      case Screen.Dashboard: return `Hi ${user?.name}! Please make a choice`
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
            <div className={styles.header}>{getHeader()}</div>
            {leftSideButtons()}
            {rightSideButtons()}
            {inputBox()}

            
          </div>
        </div>
      </div>
    </main>
  )
}
