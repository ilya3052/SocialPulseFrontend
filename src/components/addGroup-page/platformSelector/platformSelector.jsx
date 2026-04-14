import React from 'react';
import styles from './platformSelector.module.css'; // подставь свой путь

const PlatformSelector = ({
                              platforms,        // массив [{id, name, alias}, ...]
                              activePlatform,   // строка, например 'tg'
                              setActivePlatform, // функция
                              loading = false
                          }) => {
    if (loading) {
        return <div className={styles.loading}>Загрузка платформ...</div>; // или скелетон
    }

    if (!platforms || platforms.length === 0) {
        return <div>Платформы не найдены</div>;
    }
    return (
        <div className={styles.platformsContainer}>
            {platforms.map((platform) => {
                const isActive = activePlatform === platform.alias;

                const platformStyleClass = styles[`platformBtn${platform.alias}`] || '';

                return (
                    <button
                        key={platform.id}
                        className={`
                            ${styles.platformBtn}
                            ${isActive ? styles.active : ''}
                            ${platformStyleClass}
                        `.trim()}
                        onClick={() => setActivePlatform(platform.alias)}
                    >
                        <span className={styles.platformIcon}>
                            {platform.alias.toUpperCase()}
                        </span>
                        <span className={styles.platformName}>
                            {platform.name}
                        </span>
                    </button>
                );
            })}
        </div>
    );
};

export default PlatformSelector;