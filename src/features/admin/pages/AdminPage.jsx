import React, {useEffect, useState} from "react";
import styles from "./AdminPage.module.css";

import GroupsStats from "../components/groupsStats/GroupStats.jsx";
import AccountsStats from "../components/accountStats/AccountStats.jsx";
import LoadStats from "../components/loadStats/LoadStats.jsx";
import {useNavigate} from "react-router-dom";
import {API_VERSION, BASE_URL, verifyAndRefreshToken} from "../../../utils/utils.js";

const AdminPage = () => {

    const navigate = useNavigate();

    const [groupStats, setGroupStats] = useState({vk_count: null, tg_count: null});
    const [accountStats, setAccountStats] = useState({vk_count: null, tg_count: null});
    const [loadStats, setLoadStats] = useState({
        min: {id: null, name: null, count: null},
        max: {id: null, name: null, count: null}
    });

    useEffect(() => {
        let isMounted = true;
        const abortController = new AbortController();

        const fetchSummaryInfo = async () => {
            let token = localStorage.getItem("access_token");
            if (!token) {
                if (!(await verifyAndRefreshToken())) {
                    navigate("/login");
                    return;
                }
                return;
            }
            try {
                const res = await fetch(`${BASE_URL}/${API_VERSION}/admin/summary/`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    signal: abortController.signal
                });
                if (res.ok && isMounted) {
                    const data = await res.json();
                    console.log(data);
                    setGroupStats(data.group_info);
                    setAccountStats(data.service_account_info);
                    setLoadStats(data.service_account_loading_info);
                }
            } catch (err) {
                if (err.name !== 'AbortError' && isMounted) {
                    console.log(err);
                }
            }
        };
        fetchSummaryInfo();
        return () => {
            isMounted = false;
            abortController.abort();
        };
    }, [navigate]);

    return (
        <main className={styles.adminContainer}>
            <GroupsStats stats={groupStats}/>
            <AccountsStats stats={accountStats}/>
            <LoadStats stats={loadStats} groupStats={groupStats}/>

            <div className={styles.saveBtnContainer}>
                <button className={styles.saveBtn}>Сохранить в PDF</button>
            </div>
        </main>
    );
};

export default AdminPage;