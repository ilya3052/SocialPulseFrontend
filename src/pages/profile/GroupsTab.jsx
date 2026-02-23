import styles from './profile.module.css';

const GroupsTab = () => {
    return (
        <div className={styles.tabContent}>
            {/* Пока пусто — можно будет позже добавить карточки групп */}
            <div className={styles.groupsHeader}>
                <h3>Мои группы</h3>
                <a href="#" className={styles.addGroup}>
                    Добавить группу
                </a>
            </div>

            {/* Здесь позже будет .groups-grid с карточками */}
            {/* <div className={styles.groupsGrid}> ... </div> */}
        </div>
    );
};

export default GroupsTab;