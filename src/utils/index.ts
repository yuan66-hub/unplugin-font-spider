

export function replaceHref(path: string) {
    return (match: any, p1: any, p2: any, p3: any) => {
        const newHref = `${path}${p3}`;
        return `${p1}${p2}${newHref}${p2}`;
    }
}

export function isHttp(url: string) {
    const urlRegex = /^(https|http):/i;
    return urlRegex.test(url);
}