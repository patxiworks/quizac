import styles from "../dashboard/styles/art-work.module.css";
const ArtWork = ({ image, radius }) => {
  return <img className={styles.artIcon} alt="" src={image} style={radius ? {borderRadius: radius} : {}} />;
};

export default ArtWork;
