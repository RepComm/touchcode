import { Component } from 'preact';
import { useLocation } from 'preact-iso';

import style from "./style.module.css";

interface Props {}
interface State {
  mainMenuVisible?: boolean;
}

export class MainMenu extends Component<Props,State> {
  render () {
    let cnMainMenu = `${style.mainmenu}`;
    if (this.state.mainMenuVisible) {
      cnMainMenu += ` ${style.mainmenu_show}`;
    }
    return <div
      className={
        cnMainMenu
      }
      
      >
      <button className={style.toggle} onClick={()=>{
        this.setState({
          mainMenuVisible: !this.state.mainMenuVisible
        });
      }}/>

      { this.state.mainMenuVisible == true &&
        <div className={style.content}>
          <div className={style.menuitem}>
            open folder
          </div>
          <div className={style.menuitem}>
            open file
          </div>
        </div>
      }
    </div>
  }
}
