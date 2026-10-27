import * as THREE from 'three';

export type AnimationState =
  | 'Idle'
  | 'Walk'
  | 'Run'
  | 'Sprint'
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
  private idleCyclePhase: 'base' | 'variation' | null = null;
  private idleCyclesUntilDecision = 3;
  private readonly headGazeTarget = new THREE.Vector3();
  private hasHeadGazeTarget = false;
  private headBone: THREE.Bone | null = null;
  private neckBone: THREE.Bone | null = null;
  private gazeYaw = 0;
  private gazePitch = 0;
  private readonly appliedHeadGaze = new THREE.Quaternion();
  private readonly appliedNeckGaze = new THREE.Quaternion();
  private readonly gazeHeadPosition = new THREE.Vector3();
  private readonly gazeDirection = new THREE.Vector3();
  private readonly gazeParentRotation = new THREE.Quaternion();

  // Procedural mesh fallbacks
  private characterGroup: THREE.Group | null = null;
  private proceduralTime = 0;
  private isProcedural = false;

  // Armed/Unarmed state
  public isArmed = false;
  private isPlayingOneShot = false;
  private oneShotAction: THREE.AnimationAction | null = null;
  private oneShotMarkerTime = -1;
  private oneShotOnMarker: (() => void) | null = null;
  private oneShotMarkerFired = false;

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
    root.traverse((child) => {
      if (!(child as THREE.Bone).isBone) return;
      const name = child.name.toLowerCase();
      if (!this.headBone && (name === 'mixamorig:head' || name.endsWith(':head'))) this.headBone = child as THREE.Bone;
      if (!this.neckBone && (name === 'mixamorig:neck' || name.endsWith(':neck'))) this.neckBone = child as THREE.Bone;
    });

    console.log('[AnimCtrl] Registering clips:', clips.map((c) => `${c.name} (${c.tracks.length}t, ${c.duration.toFixed(1)}s)`).join(' | '));

    for (const clip of clips) {
      this.registerClip(clip);
    }

    this.mixer.addEventListener('finished', (event) => {
      const finishedAction = (event as { action: THREE.AnimationAction }).action;
      if (this.currentState !== 'Idle') return;
      if (this.idleCyclePhase === 'variation' && finishedAction === this.currentAction) {
        this.playIdleClip(this.resolveClipName('Idle'), 'base', 0.48);
      }
    });
    this.mixer.addEventListener('loop', (event) => {
      const loopedAction = (event as { action: THREE.AnimationAction }).action;
      if (this.currentState !== 'Idle' || this.idleCyclePhase !== 'base' || loopedAction !== this.currentAction) return;
      this.idleCyclesUntilDecision--;
      if (this.idleCyclesUntilDecision > 0) return;
      if (this.allActions.has('Idle_Kick') && Math.random() < 0.38) {
        this.playIdleClip('Idle_Kick', 'variation', 0.48);
      } else {
        this.idleCyclesUntilDecision = 2 + Math.floor(Math.random() * 3);
      }
    });

    // Start playing Idle_Unarmed
    this.playState('Idle');
  }

  private registerClip(clip: THREE.AnimationClip): void {
    if (!this.mixer || this.allActions.has(clip.name)) return;
    const action = this.mixer.clipAction(clip);
    if (['TakeItem', 'CastSpell', 'Wukong_NoWood_Kick', 'Idle_Kick', 'Wukong_NoWood_DoubleJump', 'Wukong_NoWood_HardLanding', 'Atack_Jump', 'Dodge_Back', 'Swing_To_Land', 'Swing_To_Land2', 'Climbing', 'Climbing_To_Top', 'Continue'].includes(clip.name) || clip.name.includes('Jump') || clip.name.startsWith('Idle_')) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    }
    this.allActions.set(clip.name, action);
  }

  /** Register optional FBX clips when their background loading finishes. */
  public addClips(clips: THREE.AnimationClip[]): void {
    for (const clip of clips) this.registerClip(clip);
  }

  public hasClip(name: string): boolean { return this.allActions.has(name); }
  public getClipDuration(name: string): number { return this.allActions.get(name)?.getClip().duration ?? 1.2; }

  /** Softly turns the head toward a nearby NPC while in ordinary gameplay. */
  public setGazeTarget(target: THREE.Vector3 | null): void {
    this.hasHeadGazeTarget = target !== null;
    if (target) this.headGazeTarget.copy(target);
  }

  /** Run a prepared one-shot action without changing gameplay-specific logic. */
  public playOneShot(name: string, onComplete: () => void, speed = 1, markerFraction = -1, onMarker?: () => void): void {
    const action = this.allActions.get(name);
    if (!action || !this.mixer) { onComplete(); return; }
    if (this.currentAction && this.currentAction !== action) this.currentAction.fadeOut(0.1);
    this.idleCyclePhase = null;
    this.isPlayingOneShot = true;
    this.oneShotAction = action;
    this.oneShotMarkerTime = markerFraction >= 0 ? action.getClip().duration * markerFraction : -1;
    this.oneShotOnMarker = onMarker ?? null;
    this.oneShotMarkerFired = false;
    action.reset().setLoop(THREE.LoopOnce, 1).setEffectiveTimeScale(speed).setEffectiveWeight(1).fadeIn(0.08).play();
    action.clampWhenFinished = true;
    this.currentAction = action;
    this.currentState = name as AnimationState;
    const onFinished = (event: { action: THREE.AnimationAction }) => {
      if (event.action !== action) return;
      this.mixer?.removeEventListener('finished', onFinished as any);
      if (this.oneShotAction !== action) return;
      if (!this.oneShotMarkerFired && this.oneShotOnMarker) this.oneShotOnMarker();
      this.oneShotAction = null;
      this.oneShotOnMarker = null;
      this.oneShotMarkerTime = -1;
      this.isPlayingOneShot = false;
      onComplete();
    };
    this.mixer.addEventListener('finished', onFinished as any);
  }

  public playAirAttack(onImpact: () => void, onComplete: () => void): void {
    // Use the same quick kick the player uses on the ground. The supplied
    // Atack_Jump FBX is a longer acrobatic move and leaves an unresponsive hang
    // in mid-air, so it is not the combat animation for this input.
    this.playWukongKick(onImpact, onComplete);
  }

  public playBackwardDodge(onComplete: () => void): void {
    this.playOneShot('Dodge_Back', onComplete, 1.15);
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
    if (state === 'Sprint') return this.allActions.has('Wukong_Naruto_Run') ? 'Wukong_Naruto_Run' : 'Run' + suffix;
    if (state === 'Run' || state === 'Walk') return 'Run' + suffix;
    if (state === 'Jump') return 'Jump' + suffix;
    if (state === 'Fall') return 'Fall' + suffix;

    // Fallback: try exact state name, then Idle
    return 'Idle' + suffix;
  }

  /**
   * Play atack_wood (atack_wood.glb). Triggers onCastAtMarker at impact point (~30% of swing),
   * and onComplete when animation finishes to restore state and return staff to back.
   */
  public playAtackWood(onCastAtMarker: () => void, onComplete: () => void): void {
    this.idleCyclePhase = null;
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
    const castTimeThreshold = clipDuration * 0.42;

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
    this.idleCyclePhase = null;
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
    const impactTimeThreshold = clipDuration * 0.42; // New kick's leg extension reaches contact at about frame 20/49.

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
    this.idleCyclePhase = null;
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
    this.idleCyclePhase = null;
    this.currentState = '' as any; // Reset so playState doesn't skip
    this.playState(prev, 0.25);
  }

  /**
   * Play the one-shot TakeItem pickup animation. When it finishes,
   * switch to Armed mode and call onComplete.
   */
  public playTakeItemAnimation(onContact?: () => void, onComplete?: (completed: boolean) => void): void {
    this.idleCyclePhase = null;
    const action = this.allActions.get('TakeItem');
    if (!action || !this.mixer) {
      onContact?.();
      onComplete?.(false);
      return;
    }

    const duration = action.getClip().duration;
    if (!Number.isFinite(duration) || duration <= 0 || action.getClip().tracks.length === 0) {
      onContact?.();
      onComplete?.(false);
      return;
    }

    this.isPlayingOneShot = true;

    // Fade out current
    if (this.currentAction && this.currentAction !== action) {
      this.currentAction.fadeOut(0.2);
    }

    action.reset().setLoop(THREE.LoopOnce, 1).setEffectiveTimeScale(1).setEffectiveWeight(1).fadeIn(0.15).play();
    action.clampWhenFinished = true;
    this.currentAction = action;
    this.currentState = 'Idle';

    let contacted = false;
    let settled = false;
    let lastActionTime = action.time;
    let stalledFrames = 0;
    const contactAt = duration * 0.72;
    const contact = () => {
      if (contacted) return;
      contacted = true;
      try {
        onContact?.();
      } catch (error) {
        console.error('[AnimCtrl] TakeItem contact callback failed:', error);
      }
    };
    const finish = (completed: boolean) => {
      if (settled) return;
      settled = true;
      this.mixer?.removeEventListener('finished', onFinished as any);
      contact();
      this.isPlayingOneShot = false;
      try {
        onComplete?.(completed);
      } catch (error) {
        console.error('[AnimCtrl] TakeItem completion callback failed:', error);
      }
    };
    const onFinished = (e: { action: THREE.AnimationAction }) => {
      if (e.action === action) {
        finish(true);
      }
    };

    this.mixer.addEventListener('finished', onFinished as any);

    const checkContact = () => {
      if (settled) return;
      if (!this.isPlayingOneShot || this.currentAction !== action) {
        finish(false);
        return;
      }
      if (action.time > lastActionTime + 0.0001) {
        lastActionTime = action.time;
        stalledFrames = 0;
      } else {
        stalledFrames++;
      }
      if (action.time >= contactAt) contact();
      // The mixer 'finished' event is the primary signal, but also watch the
      // action clock so a dropped event cannot leave the interaction locked.
      if (action.time >= duration - 0.025) {
        finish(true);
        return;
      }
      // A stalled mixer (stopped action or external interruption) must never
      // strand the player. Count actual render frames rather than wall-clock
      // milliseconds so a slow device can still finish the full clip.
      if (stalledFrames >= 180 || !action.isRunning()) {
        finish(false);
        return;
      }
      requestAnimationFrame(checkContact);
    };
    requestAnimationFrame(checkContact);
  }

  /**
   * Transition to a new animation state with crossfade blending.
   */
  public playState(newState: AnimationState, duration: number = 0.2): void {
    // Don't interrupt one-shot animations
    if (this.isPlayingOneShot) return;

    if (newState === 'Idle') {
      // Idle base/variation are sequenced by real clip-finished events. Calls
      // from the player update loop must not restart the active idle each frame.
      if (this.idleCyclePhase !== null && this.currentState === 'Idle') return;
      this.playIdleClip(this.resolveClipName('Idle'), 'base', duration);
      return;
    }
    this.idleCyclePhase = null;

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

  private playIdleClip(name: string, phase: 'base' | 'variation', fadeDuration: number): void {
    const next = this.allActions.get(name);
    if (!next || !this.mixer) {
      this.idleCyclePhase = null;
      this.currentState = 'Idle';
      return;
    }
    if (this.currentAction && this.currentAction !== next) this.currentAction.crossFadeTo(next, fadeDuration, false);
    if (phase === 'base') {
      this.idleCyclesUntilDecision = 2 + Math.floor(Math.random() * 3);
      next.reset().setLoop(THREE.LoopRepeat, Infinity).setEffectiveWeight(1).setEffectiveTimeScale(1);
      next.clampWhenFinished = false;
    } else {
      next.reset().setLoop(THREE.LoopOnce, 1).setEffectiveWeight(1).setEffectiveTimeScale(1);
      next.clampWhenFinished = true;
    }
    if (this.currentAction !== next) next.fadeIn(fadeDuration);
    next.play();
    this.currentAction = next;
    this.currentState = 'Idle';
    this.idleCyclePhase = phase;
  }

  public update(delta: number): void {
    if (this.mixer) {
      // Remove the previous additive gaze before the mixer applies this frame's pose.
      if (this.headBone) this.headBone.quaternion.multiply(this.appliedHeadGaze.clone().invert());
      if (this.neckBone) this.neckBone.quaternion.multiply(this.appliedNeckGaze.clone().invert());
      this.appliedHeadGaze.identity();
      this.appliedNeckGaze.identity();
      this.mixer.update(delta);
      this.updateHeadGaze(delta);
      if (this.oneShotAction && !this.oneShotMarkerFired && this.oneShotMarkerTime >= 0 && this.oneShotAction.time >= this.oneShotMarkerTime) {
        this.oneShotMarkerFired = true;
        this.oneShotOnMarker?.();
      }

      // Retain the rig's existing scale safeguard after animation evaluation.
      if (this.characterRoot) {
        this.characterRoot.traverse((child) => {
          if ((child as THREE.Bone).isBone &&
            (child.scale.x !== 1 || child.scale.y !== 1 || child.scale.z !== 1)) {
            child.scale.set(1, 1, 1);
          }
        });
      }
    }
    if (this.isProcedural && this.characterGroup) {
      this.updateProceduralAnimation(delta);
    }
  }

  private updateHeadGaze(delta: number): void {
    const gazeAllowed = this.currentState === 'Idle' || this.currentState === 'Walk' || this.currentState === 'Run' || this.currentState === 'Sprint';
    let targetYaw = 0;
    let targetPitch = 0;
    if (gazeAllowed && this.hasHeadGazeTarget && this.headBone?.parent) {
      this.headBone.getWorldPosition(this.gazeHeadPosition);
      this.gazeDirection.copy(this.headGazeTarget).sub(this.gazeHeadPosition).normalize();
      this.headBone.parent.getWorldQuaternion(this.gazeParentRotation).invert();
      this.gazeDirection.applyQuaternion(this.gazeParentRotation);
      targetYaw = THREE.MathUtils.clamp(Math.atan2(this.gazeDirection.x, this.gazeDirection.z), -0.42, 0.42);
      const horizontal = Math.hypot(this.gazeDirection.x, this.gazeDirection.z);
      targetPitch = THREE.MathUtils.clamp(-Math.atan2(this.gazeDirection.y, horizontal), -0.24, 0.24);
    }
    const blend = 1 - Math.exp(-Math.max(0, delta) * 4.2);
    this.gazeYaw = THREE.MathUtils.lerp(this.gazeYaw, targetYaw, blend);
    this.gazePitch = THREE.MathUtils.lerp(this.gazePitch, targetPitch, blend);
    if (Math.abs(this.gazeYaw) < 0.002 && Math.abs(this.gazePitch) < 0.002) return;
    if (this.neckBone) {
      this.appliedNeckGaze.setFromEuler(new THREE.Euler(this.gazePitch * 0.25, this.gazeYaw * 0.3, 0, 'XYZ'));
      this.neckBone.quaternion.multiply(this.appliedNeckGaze);
    }
    if (this.headBone) {
      this.appliedHeadGaze.setFromEuler(new THREE.Euler(this.gazePitch * 0.75, this.gazeYaw * 0.7, 0, 'XYZ'));
      this.headBone.quaternion.multiply(this.appliedHeadGaze);
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
      case 'Sprint':
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
