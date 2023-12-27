import { getCollection } from 'astro:content'

export const getSidebarFromCollectionIdentifier = async (collectionIdentifier: string) => {
    // Fetch all sidebar collections and extract the relevant one
    const allSidebars = await getCollection('sidebar')
    const sidebar = allSidebars.find((o) => o.id === collectionIdentifier)?.data || []
    return sidebar
}