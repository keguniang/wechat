// components/Tabs/Tabs.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        tabs: {
            type: Array,
            value: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        currentIndex: 0
    },

    /**
     * 组件的方法列表
     */
    methods: {
        itemClick(e) {
            const id = e.currentTarget.dataset.id;
            this.setData({
                    currentIndex: id
                })
                // 触发父组件中的事件，并把数据传递给父组件
            this.triggerEvent('currentIndex', this.data.currentIndex);
        }
    }
})