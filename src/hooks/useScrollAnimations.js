import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

export function useScrollAnimations({
  sectionRef,
  header1Ref,
  header2Ref,
  maskRef,
  tooltipsContainerRef,
  modelRef,
  currentRotationRef,
}) {
  const splitTextsRef = useRef([]);

  useEffect(() => {
    if (!sectionRef?.current) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);

    if (header1Ref?.current) {
      const header1Split = new SplitText(header1Ref.current.querySelector('h1'), {
        type: 'chars',
        charsClass: 'char',
      });

      header1Split.chars.forEach((char) => {
        char.innerHTML = `<span>${char.innerHTML}</span>`;
      });

      splitTextsRef.current.push(header1Split);

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: '75% bottom',
        onEnter: () => {
          gsap.to(header1Ref.current.querySelectorAll('.char > span'), {
            y: '0%',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.025,
          });
        },
        onLeaveBack: () => {
          gsap.to(header1Ref.current.querySelectorAll('.char > span'), {
            y: '100%',
            duration: 1,
            ease: 'power3.out',
            stagger: 0.025,
          });
        },
      });
    }

    let tooltipSelectors = [];
    if (tooltipsContainerRef?.current) {
      const tooltips = Array.from(tooltipsContainerRef.current.children);
      
      tooltips.forEach((tooltip, index) => {
        const title = tooltip.querySelector('h2');
        const description = tooltip.querySelector('p');
        const trigger = index === 0 ? 0.65 : 0.85;
        const elements = [];

        const icon = tooltip.querySelector('ion-icon');
        if (icon) elements.push(icon);

        if (title) {
          const titleSplit = new SplitText(title, {
            type: 'lines',
            linesClass: 'line',
          });
          titleSplit.lines.forEach((line) => {
            line.innerHTML = `<span>${line.innerHTML}</span>`;
            const span = line.querySelector('span');
            if (span) elements.push(span);
          });
          splitTextsRef.current.push(titleSplit);
        }

        if (description) {
          const descriptionSplit = new SplitText(description, {
            type: 'lines',
            linesClass: 'line',
          });
          descriptionSplit.lines.forEach((line) => {
            line.innerHTML = `<span>${line.innerHTML}</span>`;
            const span = line.querySelector('span');
            if (span) elements.push(span);
          });
          splitTextsRef.current.push(descriptionSplit);
        }

        if (elements.length > 0) {
          gsap.set(elements, { y: '125%' });
          const divider = tooltip.querySelector('[class*="divider"]');
          if (divider) gsap.set(divider, { scaleX: 0 });
          tooltipSelectors.push({ trigger, elements, divider });
        }
      });
    }

    const animOptions = {
      duration: 1,
      ease: 'power3.out',
      stagger: 0.025,
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: `+=${window.innerHeight * 10}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: ({ progress }) => {
        if (header1Ref?.current) {
          const headerProgress = Math.max(0, Math.min(1, (progress - 0.05) / 0.3));
          gsap.to(header1Ref.current, {
            xPercent:
              progress < 0.05
                ? 0
                : progress > 0.35
                  ? -100
                  : -100 * headerProgress,
          });
        }

        if (maskRef?.current) {
          const maskSize =
            progress < 0.2
              ? 0
              : progress > 0.3
                ? 100
                : 100 * ((progress - 0.2) / 0.1);

          gsap.to(maskRef.current, {
            clipPath: `circle(${maskSize}% at 50% 50%)`,
          });
        }

        if (header2Ref?.current) {
          const header2Progress = (progress - 0.15) / 0.35;
          const header2XPercent =
            progress < 0.15
              ? 100
              : progress > 0.5
                ? -200
                : 100 - 300 * header2Progress;

          gsap.to(header2Ref.current, {
            xPercent: header2XPercent,
          });
        }

        const scaleX =
          progress < 0.45
            ? 0
            : progress > 0.65
              ? 100
              : 100 * ((progress - 0.45) / 0.2);

        tooltipSelectors.forEach(({ trigger, elements, divider }) => {
          gsap.to(elements, {
            y: progress >= trigger ? '0%' : '125%',
            ...animOptions,
          });
          if (divider) {
            gsap.to(divider, {
              scaleX: `${scaleX}%`,
              ...animOptions,
            });
          }
        });

        if (modelRef?.current && currentRotationRef?.current !== undefined) {
          if (progress >= 0.05) {
            const rotationProgress = (progress - 0.05) / 0.95;
            const targetRotation = Math.PI * 3 * 4 * rotationProgress;
            const rotationDiff = targetRotation - currentRotationRef.current;

            if (Math.abs(rotationDiff) > 0.001) {
              modelRef.current.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotationDiff);
              currentRotationRef.current = targetRotation;
            }
          }
        }
      },
    });

    return () => {
      scrollTrigger.kill();
      splitTextsRef.current.forEach((split) => {
        if (split.revert) split.revert();
      });
      splitTextsRef.current = [];
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.trigger === sectionRef?.current) {
          trigger.kill();
        }
      });
    };
  }, [sectionRef, header1Ref, header2Ref, maskRef, tooltipsContainerRef, modelRef, currentRotationRef]);
}
