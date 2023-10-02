const CHANNELS = {};

export const on = (event, clb) => {
    // @ts-ignore
    CHANNELS[event] = [...(CHANNELS[event] || []), clb];
};

export const off = (event, clb) => {
    // @ts-ignore
    const handlers = [...(CHANNELS[event] || [])];

    const index = handlers.indexOf(clb);
    if (index > -1) handlers.splice(index, 1);

    // @ts-ignore
    CHANNELS[event] = handlers;
};

export const publish = (event, data) => {
    // @ts-ignore
    const handlers = CHANNELS[event] || [];
    // @ts-ignore
    handlers.forEach(handler => handler(data))
};
