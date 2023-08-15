import styles from "../dashboard/styles/art-work.module.css";
const ArtWork = ({ image }) => {
  return <img className={styles.artIcon} alt="" src={image} />;
};

export default ArtWork;
