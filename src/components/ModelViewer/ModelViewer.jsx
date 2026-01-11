import { useThreeScene } from '../../hooks/useThreeScene';
import styles from './ModelViewer.module.css';

function ModelViewer({ modelPath = '/beer.glb', onModelLoad }) {
  const { containerRef } = useThreeScene(modelPath, onModelLoad);

  return <div ref={containerRef} className={styles.modelContainer} />;
}

export default ModelViewer;
