export function getCurrentPage(path) {
    const cleanPath = path.replace(/^\//, '');
    if (cleanPath === 'dashboard' || cleanPath === '') return 'dashboard';
    else if (cleanPath.startsWith('meubles')) return 'meubles';
    else if (cleanPath.startsWith('materiaux')) return 'materiaux';
    return '';
}
