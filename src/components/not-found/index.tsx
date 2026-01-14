import styles from './index.module.scss';
export default function NotFound() {
  return (
    <div className={styles.notFound}>
      <div className={styles.head}>
        <div className={styles.meta}></div>
        <div className={styles.meta}></div>
      </div>
      <div className={styles.body}></div>
    </div>
  );
}
