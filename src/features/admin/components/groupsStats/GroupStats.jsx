import React from "react";
import styles from "./GroupStats.module.css";
import PlatformChart from "../chart/chart.jsx";

const GroupsStats = (stats) => {
    const group_stats = stats.stats;
    const vk_count = group_stats.vk_count;
    const tg_count = group_stats.tg_count;
    const total_count = vk_count + tg_count;

    return (
        <section className={styles.adminSection}>
            <h2>Группы</h2>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Всего групп подключено</div>
                    <div className={styles.statValue}>{total_count}</div>
                </div>
                <PlatformChart
                    groupStats={group_stats}
                />
                {/*<div className={styles.chartCard}>*/}
                {/*    <h3>Распределение по платформам</h3>*/}

                {/*    <div className={styles.chartPlaceholder}>*/}
                {/*        <div className={styles.pieChart}></div>*/}

                {/*        <div className={styles.chartLegend}>*/}
                {/*            <div className={styles.legendItem}>*/}
                {/*                <span className={`${styles.legendColor} ${styles.tgColor}`}></span>*/}
                {/*                <span className={styles.legendText}>VK - 65%</span>*/}
                {/*            </div>*/}

                {/*            <div className={styles.legendItem}>*/}
                {/*                <span className={`${styles.legendColor} ${styles.vkColor}`}></span>*/}
                {/*                <span className={styles.legendText}>Telegram - 35%</span>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        </section>
    );
};

export default GroupsStats;