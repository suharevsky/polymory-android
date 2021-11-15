import { createAnimation, Animation } from '@ionic/core';

export function modalEnterZoomOut(baseEl: HTMLElement): Animation {
  const baseAnimation = createAnimation('');

  const backdropAnimation = createAnimation('');
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = createAnimation('');
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);

  wrapperAnimation
    .fromTo('transform', 'scaleX(1.8) scaleY(1.8)', 'translateX(0%) scaleX(1) scaleY(1)')
    .fromTo('opacity', 0, 1);

  backdropAnimation.fromTo('opacity', 0.01, 0.4);

  return baseAnimation
    .addElement(baseEl)
    .easing('cubic-bezier(0.36,0.66,0.04,1)')
    .duration(500)
    .beforeAddClass('show-modal')
    .addAnimation(backdropAnimation)
    .addAnimation(wrapperAnimation);
}

export function modalLeaveZoomIn(baseEl: HTMLElement): Animation {
  const baseAnimation = createAnimation('');

  const backdropAnimation = createAnimation('');
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'));

  const wrapperAnimation = createAnimation('');
  const wrapperEl = baseEl.querySelector('.modal-wrapper');
  wrapperAnimation.addElement(wrapperEl);

  wrapperAnimation
    .fromTo('transform', 'scaleX(1) scaleY(1)', 'scaleX(1.8) scaleY(1.8)')
    .fromTo('opacity', 1, 0);

  backdropAnimation.fromTo('opacity', 0.4, 0.0);

  return baseAnimation
    .addElement(baseEl)
    .easing('ease-out')
    .duration(350)
    .addAnimation(backdropAnimation)
    .addAnimation(wrapperAnimation);
}
