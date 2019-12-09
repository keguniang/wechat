// 获取权限状态
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

// 获取地址
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

// 打开权限设置页面
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}

//  promise形式  显示模态对话框
export const showModal = (content) => {
    return new Promise((resolve) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result)
            }
        });
    })
}

//  promise形式  显示模态对话框
export const showToast = (title, icon) => {
    return new Promise(() => {
        wx.showToast({
            title: title,
            icon: icon,
            mask: true
        });
    })
}

//  promise形式  显示模态对话框
export const login = () => {
    return new Promise((resolve) => {
        wx.login({
            timeout: 10000,
            success: (result) => {
                resolve(result)
            }
        });
    })
}

//  promise形式  显示模态对话框
export const requestPayment = (pay) => {
    return new Promise((resolve) => {
        wx.requestPayment({
            ...pay,
            success: (result) => {
                resolve(result)
            },
            fail: (err) => {
                reject(err)
            }
        });
    })
}