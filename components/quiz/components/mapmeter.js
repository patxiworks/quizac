import styles from './styles/mapmeter.module.css'

export default function MapMeter({distance, lastMile, totalDistance, attempts, type}) {
    
    return (
        <div id='center' className={styles.container} style={type=='single'?{justifyContent: 'flex-end'}:{}}>
            <div id="distance" className={`${styles.box} ${styles.left}`} style={type=='single'?{textAlign: 'right'}:{}}>
                <span className={styles.title}>Last distance covered</span> 
                <span className={styles.value}>{distance ? distance : 0} km</span>
            </div>
            {type != 'single'
            ? 
            <><div className={`${styles.box} ${styles.centre}`}>
                <span className={styles.title}>Distance to destination</span> 
                <span className={styles.value}>{lastMile ? lastMile : 0} km</span>
            </div>
            <div className={`${styles.box} ${styles.right}`}>
                <span className={styles.title}>Total distance covered</span> 
                <span className={styles.value}>{totalDistance ? totalDistance : 0} km {attempts ? `(${attempts})` : ''}</span>
            </div></>
            : 
            ''}
        </div>
    )
}