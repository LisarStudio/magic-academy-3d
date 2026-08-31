import * as THREE from 'three';

export type AnimationState =
  | 'Idle'
  | 'Walk'
  | 'Run'
  | 'Jump'
  | 'Fall'
  | 'Land'
  | 'CastSpell'
  | 'Hit'
  | 'Wukong_NoWood_HardLanding';

/**
 * AnimationController manages two animation sets (Unarmed / Armed) and
 * crossfades between them. It also handles the one-shot TakeItem pickup
 * animation that transitions the character from Unarmed → Armed.
 */
export class AnimationController {
  private mixer: THREE.AnimationMixer | null = null;

  // All registered actions keyed by clip name (e.g. 'Idle_Unarmed', 'Run_Armed')
  private allActions: Map<string, THREE.AnimationAction> = new Map();

  private currentAction: THREE.AnimationAction | null = null;
  private currentState: AnimationState = 'Idle';

  // Procedural mesh fallbacks
  private characterGroup: THREE.Group | null = null;
  private proceduralTime = 0;
  private isProcedural = false;

  // Armed/Unarmed state
  public isArmed = false;
  private isPlayingOneShot = false;

  constructor(modelOrGroup: THREE.Object3D, clips: THREE.AnimationClip[] = []) {
    if (clips && clips.length > 0) {
      this.initAnimations(modelOrGroup, clips);
    } else {
      this.isProcedural = true;
      if (modelOrGroup instanceof THREE.Group) {
        this.characterGroup = modelOrGroup;
      }
    }
  }

  private characterRoot: THREE.Object3D | null = null;

  private initAnimations(root: THREE.Object3D, clips: THREE.AnimationClip[]): void {
    this.characterRoot = root;
    this.mixer = new THREE.AnimationMixer(root);

    console.log('[AnimCtrl] Registering clips:', clips.map((c) => `${c.name} (${c.tracks.length}t, ${c.duration.toFixed(1)}s)`).join(' | '));

    for (const clip of clips) {
      const action = this.mixer.clipAction(clip);

      // One-shot animations
      if (clip.name === 'TakeItem' || clip.name === 'CastSpell' || clip.name === 'Wukong_NoWood_Kick' || clip.name === 'Wukong_NoWood_DoubleJump' || clip.name === 'Wukong_NoWood_HardLanding') {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }
      // Jump is one-shot
      if (clip.name.includes('Jump')) {
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
      }

      this.allActions.set(clip.name, action);
    }

    // Start playing Idle_Unarmed
    this.playState('Idle');
  }

  /**
   * Resolve which clip name to use based on current armed/unarmed state.
   */
  private resolveClipName(state: AnimationState): string {
    if (state === 'CastSpell') return 'CastSpell';
    if ((state as string) === 'Wukong_NoWood_DoubleJump') return 'Wukong_NoWood_DoubleJump';
    if (state === 'Wukong_NoWood_HardLanding') return 'Wukong_NoWood_HardLanding';

    const suffix = this.isArmed ? '_Armed' : '_Unarmed';

    if (state === 'Idle') return 'Idle' + suffix;
    if (state === 'Run' || state === 'Walk') return 'Run' + suffix;
    if (state === 'Jump') return 'Jump' + suffix;

    // Fallback: try exact state name, then Idle
    return 'Idle' + suffix;
  }

  /**
   * Play atack_wood (atack_wood.glb). Triggers onCastAtMarker at impact point (~30% of swing),
   * and onComplete when animation finishes to restore state and return staff to back.
   */
  public playAtackWood(onCastAtMarker: () => void, onComplete: () => void): void {
    const action = this.allActions.get('atack_wood') || this.allActions.get('CastSpell');
    if (!action || !this.mixer) {
      onCastAtMarker();
      onComplete();
      return;
    }

    this.isPlayingOneShot = true;

    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.stop();
    }

    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.setEffectiveWeight(1.0);
    action.setEffectiveTimeScale(1.7);
    action.play();

    this.currentAction = action;
    this.currentState = 'CastSpell';

    let hasCast = false;
    const clipDuration = action.getClip().duration;
    // Release spell at 30% of atack_wood.glb animation — during the forward swing of the attack, not after
    const castTimeThreshold = clipDuration * 0.30;

    const checkMarker = () => {
      if (!hasCast && action.time >= castTimeThreshold) {
        hasCast = true;
        onCastAtMarker();
      }
    };

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === action) {
        this.mixer?.removeEventListener('finished', onFinished as any);
        if (!hasCast) {
          hasCast = true;
          onCastAtMarker();
        }
        this.isPlayingOneShot = false;
        onComplete();
      }
    };

    this.mixer.addEventListener('finished', onFinished as any);

    // Also check marker inside mixer updates (handled by updating a marker checker)
    const updateCheck = () => {
      if (this.isPlayingOneShot && this.currentAction === action) {
        checkMarker();
        if (!hasCast) requestAnimationFrame(updateCheck);
      }
    };
    requestAnimationFrame(updateCheck);
  }

  public playCastSpellAnimation(onCastAtMarker: () => void, onComplete: () => void): void {
    this.playAtackWood(onCastAtMarker, onComplete);
  }

  public playWukongKick(onImpact: () => void, onComplete: () => void): void {
    const action = this.allActions.get('Wukong_NoWood_Kick');
    if (!action || !this.mixer) {
      onImpact();
      onComplete();
      return;
    }

    this.isPlayingOneShot = true;

    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.1);
    }

    action.reset();
    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.setEffectiveWeight(1.0);
    action.setEffectiveTimeScale(1.4);
    action.fadeIn(0.08).play();
    this.currentAction = action;

    let hasImpacted = false;
    let isFinished = false;
    const clipDuration = action.getClip().duration;
    const impactTimeThreshold = clipDuration * 0.50; // Visual impact at ~50% of kick animation

    const checkMarker = () => {
      if (!hasImpacted && action.time >= impactTimeThreshold) {
        hasImpacted = true;
        onImpact();
      }
    };

    const finishSequence = () => {
      if (isFinished) return;
      isFinished = true;
      this.mixer?.removeEventListener('finished', onFinished as any);
      if (!hasImpacted) {
        hasImpacted = true;
        onImpact();
      }
      this.isPlayingOneShot = false;
      onComplete();
    };

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === action) {
        finishSequence();
      }
    };

    this.mixer.addEventListener('finished', onFinished as any);

    // Fail-safe timeout: ensure player controls always unlock even if animation finishes off-screen
    const expectedDurationMs = ((clipDuration / 1.4) + 0.15) * 1000;
    setTimeout(() => {
      if (!isFinished) {
        finishSequence();
      }
    }, Math.max(300, expectedDurationMs));

    const updateCheck = () => {
      if (this.isPlayingOneShot && this.currentAction === action && !isFinished) {
        checkMarker();
        if (!hasImpacted) requestAnimationFrame(updateCheck);
      }
    };
    requestAnimationFrame(updateCheck);
  }

  public playHardLanding(onComplete: () => void): void {
    const action = this.allActions.get('Wukong_NoWood_HardLanding');
    if (!action || !this.mixer) {
      onComplete();
      return;
    }

    this.isPlayingOneShot = true;

    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.15); // Smooth blend out of fall
    }

    action.reset().setEffectiveWeight(1).setEffectiveTimeScale(1.0).fadeIn(0.1).play();
    this.currentAction = action;
    this.currentState = 'Wukong_NoWood_HardLanding';

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === action) {
        this.mixer?.removeEventListener('finished', onFinished as any);
        this.isPlayingOneShot = false;
        onComplete();
      }
    };

    this.mixer.addEventListener('finished', onFinished as any);
  }

  /**
   * Switch between armed and unarmed animation sets.
   */
  public setArmed(armed: boolean): void {
    if (this.isArmed === armed) return;
    this.isArmed = armed;
    console.log(`[AnimCtrl] Mode → ${armed ? '🪄 ARMED' : '🤲 UNARMED'}`);
    // Force transition to current state with the new animation set
    const prev = this.currentState;
    this.currentState = '' as any; // Reset so playState doesn't skip
    this.playState(prev, 0.25);
  }

  /**
   * Play the one-shot TakeItem pickup animation. When it finishes,
   * switch to Armed mode and call onComplete.
   */
  public playTakeItemAnimation(onComplete?: () => void): void {
    const action = this.allActions.get('TakeItem');
    if (!action || !this.mixer) {
      // No TakeItem clip available — just switch immediately
      this.setArmed(true);
      if (onComplete) onComplete();
      return;
    }

    this.isPlayingOneShot = true;

    // Fade out current
    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.2);
    }

    action.reset().setEffectiveWeight(1).fadeIn(0.15).play();
    this.currentAction = action;

    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === action) {
        this.mixer?.removeEventListener('finished', onFinished as any);
        this.isPlayingOneShot = false;
        this.setArmed(true);
        if (onComplete) onComplete();
      }
    };

    this.mixer.addEventListener('finished', onFinished as any);
  }

  /**
   * Transition to a new animation state with crossfade blending.
   */
  public playState(newState: AnimationState, duration: number = 0.2): void {
    // Don't interrupt one-shot animations
    if (this.isPlayingOneShot) return;

    // Skip if already in this state and playing
    if (this.currentState === newState && this.currentAction && this.currentAction.isRunning()) {
      return;
    }

    if (this.isProcedural) {
      this.currentState = newState;
      return;
    }

    // Resolve the right clip for current armed/unarmed mode
    const clipName = this.resolveClipName(newState);
    const newAction = this.allActions.get(clipName);

    if (!newAction) {
      // Try fallback to any Idle
      const fallback = this.allActions.get('Idle_Unarmed') || this.allActions.get('Idle_Armed');
      if (fallback && fallback !== this.currentAction) {
        if (this.currentAction) this.currentAction.fadeOut(duration);
        fallback.reset().setEffectiveWeight(1).fadeIn(duration).play();
        this.currentAction = fallback;
      }
      this.currentState = newState;
      return;
    }

    // Crossfade from old to new
    if (this.currentAction && this.currentAction !== newAction) {
      this.currentAction.fadeOut(duration);
    }

    newAction.reset().setEffectiveWeight(1).fadeIn(duration).play();
    this.currentAction = newAction;
    this.currentState = newState;
  }

  public update(delta: number): void {
    if (this.mixer) {
      this.mixer.update(delta);

      // Audit & enforce 1.0 scale on bones to guarantee zero bone scaling deformation
      if (this.characterRoot) {
        this.characterRoot.traverse((child) => {
          if ((child as THREE.Bone).isBone) {
            if (child.scale.x !== 1.0 || child.scale.y !== 1.0 || child.scale.z !== 1.0) {
              child.scale.set(1.0, 1.0, 1.0);
            }
          }
        });
      }
    }
    if (this.isProcedural && this.characterGroup) {
      this.updateProceduralAnimation(delta);
    }
  }

  private updateProceduralAnimation(delta: number): void {
    this.proceduralTime += delta * 8;

    const leftLeg = this.characterGroup?.getObjectByName('leg_L');
    const rightLeg = this.characterGroup?.getObjectByName('leg_R');
    const wand = this.characterGroup?.getObjectByName('magic_wand');
    const body = this.characterGroup?.getObjectByName('body');

    switch (this.currentState) {
      case 'Idle':
        if (body) body.position.y = Math.sin(this.proceduralTime * 0.4) * 0.03;
        if (leftLeg) leftLeg.rotation.x = 0;
        if (rightLeg) rightLeg.rotation.x = 0;
        if (wand) wand.rotation.z = Math.sin(this.proceduralTime * 0.5) * 0.05;
        break;
      case 'Walk':
        if (leftLeg) leftLeg.rotation.x = Math.sin(this.proceduralTime) * 0.4;
        if (rightLeg) rightLeg.rotation.x = -Math.sin(this.proceduralTime) * 0.4;
        if (body) body.position.y = Math.abs(Math.sin(this.proceduralTime * 2)) * 0.05;
        break;
      case 'Run':
        if (leftLeg) leftLeg.rotation.x = Math.sin(this.proceduralTime * 1.5) * 0.7;
        if (rightLeg) rightLeg.rotation.x = -Math.sin(this.proceduralTime * 1.5) * 0.7;
        if (body) body.position.y = Math.abs(Math.sin(this.proceduralTime * 3)) * 0.08;
        break;
      case 'Jump':
      case 'Fall':
        if (leftLeg) leftLeg.rotation.x = -0.3;
        if (rightLeg) rightLeg.rotation.x = 0.3;
        break;
      case 'CastSpell':
        if (wand) {
          wand.rotation.x = -Math.PI * 0.4;
          wand.rotation.z = Math.sin(this.proceduralTime * 2) * 0.2;
        }
        break;
    }
  }

  public getCurrentState(): AnimationState {
    return this.currentState;
  }
}
