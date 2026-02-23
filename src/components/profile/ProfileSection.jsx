import { useState } from 'react';
import styles from './profile.module.css';

import PersonalTab from './PersonalTab';
import GroupsTab from './GroupsTab';

const ProfileSection = () => {
    const [activeTab, setActiveTab] = useState('personal');

    return (
        <section className={styles.profileSection}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'personal' ? styles.active : ''}`}
                    onClick={() => setActiveTab('personal')}
                >
                    Личные данные
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'groups' ? styles.active : ''}`}
                    onClick={() => setActiveTab('groups')}
                >
                    Группы
                </button>
            </div>

            <div className={styles.tabContentWrapper}>
                {activeTab === 'personal' && <PersonalTab />}
                {activeTab === 'groups' && <GroupsTab />}
            </div>
        </section>
    );
};

export default ProfileSection;