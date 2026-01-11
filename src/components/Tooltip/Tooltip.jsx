import styles from './Tooltip.module.css';

function Tooltip({ iconName, title, description, index = 0 }) {
  const tooltipClass = index === 1 ? styles.tooltipRight : styles.tooltip;

  return (
    <div className={tooltipClass}>
      <div className={styles.icon}>
        <ion-icon name={iconName}></ion-icon>
      </div>
      <div className={styles.divider}></div>
      <div className={styles.title}>
        <h2>{title}</h2>
      </div>
      <div className={styles.description}>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default Tooltip;
