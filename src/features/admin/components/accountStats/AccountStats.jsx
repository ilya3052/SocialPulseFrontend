import React from "react";
import styles from "./AccountStats.module.css";

const AccountsStats = (stats) => {
    const account_stats = stats.stats;
    return (
        <section className={styles.adminSection}>
            <h2>Сервисные аккаунты</h2>

            <div className={styles.accountsStats}>
                <div className={`${styles.statCard} ${styles.large}`}>
                    <div className={styles.statLabel}>
                        Сервисных аккаунтов TG подключено
                    </div>
                    <div className={styles.statValue}>{account_stats.tg_count}</div>
                </div>

                <div className={`${styles.statCard} ${styles.large}`}>
                    <div className={styles.statLabel}>
                        Сервисных аккаунтов VK подключено
                    </div>
                    <div className={styles.statValue}>{account_stats.vk_count}</div>
                </div>
            </div>
        </section>
    );
};

export default AccountsStats;