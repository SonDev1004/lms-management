const root = String(import.meta.env.VITE_API_ENDPOINT || '').replace(/\/+$/, '')

export default {
    rootAPI: root,
}