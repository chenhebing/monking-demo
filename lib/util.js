const isOnScreen = (element) => {
    const screenRect = {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
    };
    const elementRect = element.getBoundingClientRect();

    // 如果元素的下边在显示区域之上, 则表示不在显示区域之内
    if (elementRect.bottom < 0) {
        return false;
    }

    // 如果元素的左边在显示区域之右, 则表示不在显示区域之内
    if (elementRect.left > screenRect.width) {
        return false;
    }

    // 如果元素的上边在显示区域之下, 则表示不在显示区域之内
    if (elementRect.top > screenRect.height) {
        return false;
    }

    // 如果元素的右边在显示区域之左, 则表示不在显示区域之内
    if (elementRect.right < 0) {
        return false;
    }

    return true;
};

const hasScrolled = (element, distance) => {
    const screenRect = {
        height: document.documentElement.clientHeight,
        width: document.documentElement.clientWidth
    };
    const elementRect = element.getBoundingClientRect();

    return !(elementRect.top > screenRect.height + distance);
};

const getStringLen = (str) => {
    let result = 0;
    Array.from(str || '').forEach(s => {
        result += /[\u4e00-\u9fa5]/g.test(s) ? 2 : 1;
    });
    return result;
};

const goOrpheus = (url) => {
    // eslint-disable-next-line
    if (!isLocal) {
        window.location.href = url;
    }
};

export {
    isOnScreen,
    hasScrolled,
    getStringLen,
    goOrpheus
};
