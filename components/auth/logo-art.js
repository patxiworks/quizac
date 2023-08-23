import styles from "./styles/logo-art.module.css";

const LogoArt = ({ assetId }) => {
    return (
        <div className={styles.leftContent}>
          <div className={styles.logo}>Quizac</div>
          <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/asset/${assetId}`}></iframe>
          <div className={styles.imageFooter}></div>
        </div>
    )
}

export default LogoArt;