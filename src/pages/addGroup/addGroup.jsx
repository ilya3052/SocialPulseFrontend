import React, {useEffect, useState} from 'react';
import styles from './addGroup.module.css';
import {useNavigate} from "react-router-dom";
import {verifyAndRefreshToken} from "../../utils/utils.js";
import PlatformSelector from "../../components/addGroup-page/platformSelector/platformSelector.jsx";
import AccountInfo from "../../components/addGroup-page/accountInfo/accountInfo.jsx";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_VERSION = import.meta.env.VITE_API_VERSION;

const AddGroup = () => {
    const [platforms, setPlatforms] = useState([]);

    const [activePlatform, setActivePlatform] = useState(null);
    const [userSocialData, setUserSocialData] = useState({tg_link: null, vk_link: null});
    const [serviceAccount, setServiceAccount] = useState({name: null, id: null});

    const [loadingPlatforms, setLoadingPlatforms] = useState(true);
    const [loadingServiceAccount, setLoadingServiceAccount] = useState(true);

    const [groupData, setGroupData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlatforms = async () => {
            try {
                const res = await fetch(`${BASE_URL}/${API_VERSION}/accounts/platforms/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPlatforms(data);
                }
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoadingPlatforms(false);
            }
        }
        fetchPlatforms();
    }, [navigate])

    useEffect(() => {
        const fetchUserData = async () => {
            let token = localStorage.getItem("access_token");
            if (!token) {
                if (!(await verifyAndRefreshToken())) {
                    navigate("/login");
                    return;
                }
                return;
            }
            try {
                const getUserSocialDataResponse = await fetch(`${BASE_URL}/${API_VERSION}/accounts/users/get-social/`,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (getUserSocialDataResponse.ok) {
                    const socialData = await getUserSocialDataResponse.json();
                    setUserSocialData(socialData);
                }
                else {
                    throw new Error(await getUserSocialDataResponse.text());
                }
                            }
            catch (err) {
                console.log(err);
            }
        }
        fetchUserData();
    }, [navigate, activePlatform]);

    useEffect(() => {
        if (!activePlatform) return;
        const fetchServiceAccounts = async () => {
            const params = new URLSearchParams({platform: activePlatform}).toString();
            try {
                const getServiceAccountResponse = await fetch(`${BASE_URL}/${API_VERSION}/accounts/service-account/?${params}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (getServiceAccountResponse.ok) {
                    const accountData = await getServiceAccountResponse.json();
                    console.log(accountData);
                    setServiceAccount(accountData);
                }
                else {
                    throw new Error(await getServiceAccountResponse.text());
                }
            }
            catch (err) {
                console.log(err);
            }
            finally {
                setLoadingServiceAccount(false)
            }
        }
        fetchServiceAccounts();
    }, [activePlatform]);
    
    return (
        <main className={styles.addGroupContainer}>
            <h1 className={styles.pageTitle}>Добавить группу</h1>

            <section className={styles.section}>
                <h2>Выберите платформу</h2>
                <PlatformSelector
                    platforms={platforms}
                    activePlatform={activePlatform}
                    setActivePlatform={setActivePlatform}
                    loading={loadingPlatforms}
                />
            </section>

            {/* Блок 2: Информация об аккаунтах */}
            {activePlatform && <section className={styles.section}>
                <h2>Информация об аккаунтах</h2>
                <AccountInfo
                    platform={platforms.find(p => p.alias === activePlatform)}
                    activePlatform={activePlatform}
                    userSocialData={userSocialData}
                    loading={loadingServiceAccount}
                    serviceAccount={serviceAccount}
                    setGroupData={setGroupData}
                />
            </section>
            }
            {/* Блок 3: Данные о группе */}
            <section className={styles.section}>
                <h2>Данные о группе</h2>
                <div className={styles.groupData}>
                    <div className={styles.dataRow}>
                        <span className={styles.dataLabel}>Название группы:</span>
                        <span className={styles.dataValue}>Топор Live</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.dataLabel}>Ссылка:</span>
                        <span className={styles.dataValue}>https://t.me/toporlive</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.dataLabel}>Статус:</span>
                        <span className={`${styles.dataValue} ${styles.statusSuccess}`}>
                Группа найдена и доступна
            </span>
                    </div>
                </div>
            </section>

            {/* Кнопка добавления */}
            <div className={styles.addBtnContainer}>
                <button className={styles.addBtn}>Добавить группу</button>
            </div>
        </main>
    );
};

export default AddGroup;