import { useRef } from 'react';
import Tooltip from '../Tooltip/Tooltip';
import ModelViewer from '../ModelViewer/ModelViewer';
import { useScrollAnimations } from '../../hooks/useScrollAnimations';
import styles from './ProductOverview.module.css';

const tooltipsData = [
  {
    iconName: 'leaf',
    title: 'Pure Ingredients',
    description:
      'We select only the finest hops and malt from natural origins. Each bottle is a celebration of authenticity.',
  },
  {
    iconName: 'wine',
    title: 'Artisanal Fermentation',
    description:
      'Our traditional recipe is slowly fermented, creating a unique and complex flavor that awakens all senses.',
  },
];

function ProductOverview() {
  const sectionRef = useRef(null);
  const header1Ref = useRef(null);
  const header2Ref = useRef(null);
  const maskRef = useRef(null);
  const tooltipsContainerRef = useRef(null);
  const modelRef = useRef(null);
  const currentRotationRef = useRef(0);

  const handleModelLoad = ({ model }) => {
    modelRef.current = model;
  };

  useScrollAnimations({
    sectionRef,
    header1Ref,
    header2Ref,
    maskRef,
    tooltipsContainerRef,
    modelRef,
    currentRotationRef,
  });

  return (
    <section ref={sectionRef} className={styles.productOverview}>
      <div className={styles.header1} ref={header1Ref}>
        <h1>Every Sip Matters With</h1>
      </div>
      <div className={styles.header2} ref={header2Ref}>
        <h1>BrewCraft</h1>
      </div>
      <div className={styles.circularMask} ref={maskRef}></div>
      <div className={styles.tooltips} ref={tooltipsContainerRef}>
        {tooltipsData.map((tooltip, index) => (
          <Tooltip
            key={index}
            iconName={tooltip.iconName}
            title={tooltip.title}
            description={tooltip.description}
            index={index}
          />
        ))}
      </div>
      <ModelViewer modelPath="/beer.glb" onModelLoad={handleModelLoad} />
    </section>
  );
}

export default ProductOverview;
