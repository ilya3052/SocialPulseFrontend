const sendForDebug = async (debug_message) => {
        await fetch('/api/v2/accounts/debug/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                debug_message: debug_message,
            }),
        });
}

export { sendForDebug };