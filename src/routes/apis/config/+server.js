import { json } from '@sveltejs/kit';

export async function GET({ cookies }) {
    const clientId = cookies.get('appConfig_clientId');
    const clientKey = cookies.get('appConfig_clientKey');

    if (!clientId || !clientKey) {
        return json({ error: 'Configuration not found' }, { status: 404 });
    }

    return json({
        clientId,
        clientKey
    });
} 