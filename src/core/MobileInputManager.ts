import { InputManager } from './InputManager';
import { MobileTouchControls } from '../ui/MobileTouchControls';

export class MobileInputManager {
  public touchControls: MobileTouchControls;

  constructor(inputManager: InputManager) {
    this.touchControls = new MobileTouchControls(inputManager);
  }
}
