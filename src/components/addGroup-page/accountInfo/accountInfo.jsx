import React, {useState} from 'react';
import styles from './accountInfo.module.css';

const AccountInfo = ({
                         platform,           // объект платформы { id, name, alias }
                         activePlatform,     // текущая активная платформа (строка, например 'tg')
                         userSocialData,      // объект с данными пользователя { tg_link, vk_link, ... }
                         loading,
                         serviceAccount,
                         setGroupData
                     }) => {

    const [groupLink, setGroupLink] = useState('');

    if (loading) {
        return <div className={styles.loading}>Загрузка платформ...</div>;
    }
    if (!platform) return null;

    const isActive = activePlatform === platform.alias;

    const linkField = platform.alias === 'TG' ? 'tg_link' :
        platform.alias === 'VK' ? 'vk_link' : null;

    const userLink = linkField ? userSocialData?.[linkField] : null;
    let screen_name;
    if (userLink) {
       screen_name = userLink.split('/').at(-1)
    }

    const isConnected = !!userLink;

    // Динамический плейсхолдер
    const placeholder = platform.alias === 'tg'
        ? 'Введите ссылку на канал Telegram...'
        : platform.alias === 'vk'
            ? 'Введите ссылку на группу ВКонтакте...'
            : 'Введите ссылку...';

    const fetchGroupData = async () => {
        console.log(groupLink);
    }

    return (
        <div className={`${styles.accountInfo} ${isActive ? styles.active : ''}`}>
            <div className={styles.accountRow}>
                <div className={styles.accountType}>
                    <h3>Ваш аккаунт {platform.name}</h3>
                    <div className={styles.accountDetails}>
                        <a href={userLink} target='_blank' className={styles.accountName}>
                            {screen_name ? `@${screen_name}` : 'Не привязан'}
                        </a>
                        <span className={`${styles.accountStatus} ${isConnected ? styles.connected : styles.notConnected}`}>
                            {isConnected ? 'Привязан' : 'Не привязан'}
                        </span>
                    </div>
                </div>

                <div className={styles.serviceAccount}>
                    <h3>Сервисный аккаунт</h3>
                    <div className={styles.accountDetails}>
                        <span className={styles.accountName}>{serviceAccount.name}</span>
                    </div>
                </div>
            </div>

            <div className={styles.groupLinkInput}>
                <input
                    type="text"
                    placeholder={placeholder}
                    className={styles.linkInput}
                    value={groupLink}                    // ← важно!
                    onChange={(e) => setGroupLink(e.target.value)}
                />
                <button onClick={fetchGroupData} className={styles.requestDataBtn}>
                    Запросить данные
                </button>
            </div>
        </div>
    );
};

export default AccountInfo;