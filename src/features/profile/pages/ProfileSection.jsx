import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import styles from './profile.module.css';

import PersonalTab from '../components/personalTab/PersonalTab.jsx';
import GroupsTab from '../components/groupsTab/GroupsTab.jsx';

const ProfileSection = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(() => {
        const tab = searchParams.get('tab');
        return tab === 'groups' ? 'groups' : 'personal';
    });

    useEffect(() => {
        const tab = searchParams.get('tab');
        setActiveTab(tab === 'groups' ? 'groups' : 'personal');
    }, [searchParams]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSearchParams({tab});
    };

    return (
        <section className={styles.profileSection}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'personal' ? styles.active : ''}`}
                    onClick={() => handleTabChange('personal')}
                >
                    Личные данные
                </button>
                <button
                    className={`${styles.tabBtn} ${activeTab === 'groups' ? styles.active : ''}`}
                    onClick={() => handleTabChange('groups')}
                >
                    Группы
                </button>
            </div>

            <div className={styles.tabContentWrapper}>
                {activeTab === 'personal' && <PersonalTab/>}
                {activeTab === 'groups' && <GroupsTab/>}
            </div>
        </section>
    );
};

export default ProfileSection;
