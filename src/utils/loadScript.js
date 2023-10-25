export const loadScript = (url, clb) => {
    const script = document.createElement('script');
    script.src = url;
    document.body.appendChild(script);
    script.onload = clb;
};